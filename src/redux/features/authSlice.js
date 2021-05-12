import {createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import {gql} from "@apollo/client";
import client from "../../shared/api";
import _ from 'lodash';
import {AUTH_TICKET_FRAGMENT, LOGIN_RESPONSE_FRAGMENT, USER_FRAGMENT} from "../../shared/fragments";
import {withData} from "../../shared/utils";

const schema = {
    Query: {
        user: gql`
            ${USER_FRAGMENT}
            query{
                user{
                    ...userPayload
                }
            }
        `
    },
    Mutation: {
        login: gql`
            ${USER_FRAGMENT}
            ${AUTH_TICKET_FRAGMENT}
            ${LOGIN_RESPONSE_FRAGMENT}
            mutation Login($username: String!, $password: String!) {
                login(username: $username, password: $password) {
                    ...loginResponse
                }
            }
        `,
        signUp: gql`
            ${USER_FRAGMENT}
            ${AUTH_TICKET_FRAGMENT}
            mutation SignUp($input: SignUpInput!){
                signUp(input: $input){
                    ...authTicketResponse
                }
            }
        `,

    }
};

const persistTicket = (ticket) => {

    //  persist info
    window.localStorage.setItem('@auth', JSON.stringify({
        user: ticket.user,
        accessToken: ticket.accessToken
    }));

};

export const selectAuth = x => x.auth;
export const selectUser = x => x.auth.user;
export const selectToken = x => x.auth.accessToken;

export const getCurrentUser = createAsyncThunk('auth/user', async (values,thunkAPI) => {

    const response = await client.query({
        query: schema.Query.user
    });

    return withData(response,thunkAPI,'user');
});

export const loginAsync = createAsyncThunk('auth/login',async ({ username , password }, thunkAPI) => {

    const response = await client.mutate({
        mutation: schema.Mutation.login,
        variables: {
            username,
            password
        }
    });

    //  process authentication response
    if(response.data?.login?.status === 'success'){
        persistTicket(response.data.login.ticket);
    }

    return withData(response,thunkAPI,'login');
});


export const signUpAsync = createAsyncThunk('auth/signup',async (values,thunkAPI) => {

    const response = await client.mutate({
        mutation: schema.Mutation.signUp,
        variables: {
            input: values
        }
    });

    //  process authentication response
    if(!_.isNil(response.data)){
        persistTicket(response.data.signUp);
    }

    return withData(response,thunkAPI,'signUp');
});

const getInitialState = () => {

    const _auth = window.localStorage.getItem('@auth');
    if(_auth)return  { ...JSON.parse(_auth) , status : 'idle' , error: null } ;

    return {
        accessToken: null,
        user: null,
        status: 'idle',
        error: null
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {

        clearState: (state) => {
            state.accessToken = null;
            state.user = null;
            state.status = 'idle';
            state.error = null;
        },

        login: (state,action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },

        logout: (state) => {
            state.user = null;
            state.accessToken = null;

            //  clear localstorage
            window.localStorage.removeItem('@auth');
        }
    },
    extraReducers: {

        [loginAsync.fulfilled]: (state,action) => {
            const response = action.payload;
            switch (response.status) {
                case 'success':
                    state.user = response.ticket.user;
                    state.accessToken = response.ticket.accessToken;
                    state.status = 'complete';
                    break;
                case "invalid_credentials":
                    state.status = 'failed';
                    state.error = 'Invalid username or password';
                    break;
                default:
                    break;
            }
        },
        [loginAsync.rejected]: (state,action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
        [loginAsync.pending]: (state) => {
            state.status = 'loading'
        },

        [signUpAsync.fulfilled]: (state,action) => {
            const response = action.payload;
            state.user = response.user;
            state.accessToken = response.accessToken;
            state.status = 'complete';
        },

        [signUpAsync.pending]: (state,action) => {
            state.status = 'loading';
        },

        [signUpAsync.rejected]: (state,action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }
    }
});

export const { login , logout , clearState } = authSlice.actions;

export default authSlice.reducer;
