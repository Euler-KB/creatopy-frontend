import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {gql} from "@apollo/client";
import client from "../../shared/api";
import _ from 'lodash';
import {AUTH_TICKET_FRAGMENT, LOGIN_RESPONSE_FRAGMENT, USER_FRAGMENT} from "../../shared/fragments";
import {withData} from "../../shared/utils";
import {RootState} from "../store";

export type UserInfo = {
    id: number
    username: string
    name: string
    phone?: string
    email?: string
    created_at: string
    last_updated: string
}

export type AuthStateType = {
    accessToken?: string | null
    user?: UserInfo | null
    status?: string,
    error?: string | null
}

export type AuthenticationTicket = {
    accessToken?: string
    user?: UserInfo
}

export type SignUpInput = {
    username: string
    name: string
    phone?: string
    email?: string
    password: string
    confirmPassword: string
}

export type LoginInputs = {
    username: string
    password: string
}

export type LoginResponse = {
    status: string
    ticket: AuthenticationTicket
}

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

const persistTicket = (ticket: AuthenticationTicket) => {

    //  persist info
    window.localStorage.setItem('@auth', JSON.stringify({
        user: ticket.user,
        accessToken: ticket.accessToken
    }));

};

export const selectAuth = (x: RootState): AuthStateType => x.auth;
export const selectUser = (x: RootState): UserInfo => x.auth.user as UserInfo;
export const selectToken = (x: RootState): string => x.auth.accessToken as string;

export const getCurrentUser = createAsyncThunk<UserInfo>('auth/user', async (values, thunkAPI) => {

    const response = await client.query({
        query: schema.Query.user
    });

    return withData(response, thunkAPI, 'user');
});

export const loginAsync = createAsyncThunk<LoginResponse, LoginInputs>('auth/login', async ({username, password}, thunkAPI) => {

    const response = await client.mutate({
        mutation: schema.Mutation.login,
        variables: {
            username,
            password
        }
    });

    //  process authentication response
    if (response.data?.login?.status === 'success') {
        persistTicket(response.data.login.ticket);
    }

    return withData(response, thunkAPI, 'login');
});


export const signUpAsync = createAsyncThunk<AuthenticationTicket, SignUpInput>('auth/signup', async (values, thunkAPI) => {

    const response = await client.mutate({
        mutation: schema.Mutation.signUp,
        variables: {
            input: values
        }
    });

    //  process authentication response
    if (!_.isNil(response.data)) {
        persistTicket(response.data.signUp);
    }

    return withData<AuthenticationTicket>(response, thunkAPI, 'signUp');
});

const getInitialState = (): AuthStateType => {

    const _auth = window.localStorage.getItem('@auth');
    if (_auth) return {...JSON.parse(_auth), status: 'idle', error: null};

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

        login: (state, action) => {
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
    extraReducers: builder => {
        builder.addCase(loginAsync.fulfilled, (state, action) => {
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
        });

        builder.addCase(loginAsync.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });

        builder.addCase(loginAsync.pending, (state) => {
            state.status = 'loading'
        });

        builder.addCase(signUpAsync.fulfilled, (state, action) => {
            const response = action.payload;
            state.user = response.user;
            state.accessToken = response.accessToken;
            state.status = 'complete';
        });

        builder.addCase(signUpAsync.pending, (state, action) => {
            state.status = 'loading';
        });

        builder.addCase(signUpAsync.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });

    }
});

export const {login, logout, clearState} = authSlice.actions;

export default authSlice.reducer;
