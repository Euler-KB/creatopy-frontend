import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import client from "../../shared/api";
import {gql} from "@apollo/client";
import {withData} from "../../shared/utils";

const schema = {
    Mutation: {
        forgotPassword: gql`
            mutation ForgotPassword($username: String!){
                forgotPassword(username: $username){
                    id
                    token
                }
            }
        `,
        resetPassword: gql`
            mutation ResetPassword($code: String!, $newPassword: String!, $confirmPassword: String!,$id: ID!){
                resetPassword(code: $code, newPassword: $newPassword, confirmPassword: $confirmPassword,id: $id)
            }
        `
    }
}

export const selectForgotPassword = x => x.forgotPassword;


export const beginPasswordReset = createAsyncThunk('forgotPassword/begin',async ({ username },thunkAPI) => {

    const response = await client.mutate({
        mutation: schema.Mutation.forgotPassword,
        variables: {
            username
        }
    });

    return withData(response,thunkAPI,'forgotPassword');
});

export const completePasswordReset = createAsyncThunk('forgotPassword/complete', async ({ id, code , newPassword, confirmPassword },thunkAPI) => {

    const response = await client.mutate({
        mutation: schema.Mutation.resetPassword,
        variables: {
            code,
            newPassword,
            confirmPassword,
            id
        }
    });

    return withData(response,thunkAPI,'resetPassword');
});

const forgotPasswordSlice = createSlice({
    name: 'forgotPassword',
    initialState: {
        status: '',
        code: '',
        id: '',
        confirmUsername: false,
        error: null
    },
    reducers: {

        clearState: (state) => {
            state.status = '';
            state.code = '';
            state.id = '';
            state.confirmUsername = false;
            state.error = null;
        }
    },

    extraReducers: {
        [beginPasswordReset.fulfilled]: (state,action) => {
            state.confirmUsername = true;
            state.code  = action.payload.token;
            state.id = action.payload.id;
            state.status = 'confirm_username';
        },
        [beginPasswordReset.rejected]: (state,action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
        [beginPasswordReset.pending]: (state,action) => {
            state.status = 'loading';
        },


        [completePasswordReset.fulfilled]: (state,action) => {
            state.status = 'complete';
        },
        [completePasswordReset.rejected]: (state,action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
        [completePasswordReset.pending]: (state,action) => {
            state.status = 'loading';
        },

    }
});

export const { clearState } = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
