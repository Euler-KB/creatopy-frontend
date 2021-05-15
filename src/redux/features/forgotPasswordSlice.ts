import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import client from "../../shared/api";
import {gql} from "@apollo/client";
import {withData} from "../../shared/utils";
import {RootState} from "../store";

export type ForgotPasswordState = {
    status: string
    code?: string | null
    id?: any
    confirmUsername: boolean
    error?: string | null
};

export type BeginPasswordInput = {
    username: string
}

export type ResetPasswordInput = {
    id: string
    code: string
    newPassword: string
    confirmPassword: string
}

export type ForgotPasswordResponse = {
    id: string
    token: string
}

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

export const selectForgotPassword = (x: RootState): ForgotPasswordState => x.forgotPassword;


export const beginPasswordReset = createAsyncThunk<ForgotPasswordResponse, BeginPasswordInput>('forgotPassword/begin', async ({username}, thunkAPI) => {

    const response = await client.mutate({
        mutation: schema.Mutation.forgotPassword,
        variables: {
            username
        }
    });

    return withData<ForgotPasswordResponse>(response, thunkAPI, 'forgotPassword');
});

export const completePasswordReset = createAsyncThunk<boolean, ResetPasswordInput>('forgotPassword/complete', async ({id, code, newPassword, confirmPassword}, thunkAPI) => {

    const response = await client.mutate({
        mutation: schema.Mutation.resetPassword,
        variables: {
            code,
            newPassword,
            confirmPassword,
            id
        }
    });

    return withData<boolean>(response, thunkAPI, 'resetPassword');
});


const initialState: ForgotPasswordState = {
    status: '',
    code: '',
    id: '',
    confirmUsername: false,
    error: null
};

const forgotPasswordSlice = createSlice({
    name: 'forgotPassword',
    initialState,
    reducers: {

        clearState: (state) => {
            state.status = '';
            state.code = '';
            state.id = '';
            state.confirmUsername = false;
            state.error = null;
        }
    },

    extraReducers: builder => {

        builder.addCase(beginPasswordReset.fulfilled, (state, action) => {
            state.confirmUsername = true;
            state.code = action.payload.token;
            state.id = action.payload.id;
            state.status = 'confirm_username';
        });

        builder.addCase(beginPasswordReset.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });

        builder.addCase(beginPasswordReset.pending, (state, action) => {
            state.status = 'loading';
        });

        builder.addCase(completePasswordReset.fulfilled, (state, action) => {
            state.status = 'complete';
        });

        builder.addCase(completePasswordReset.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });

        builder.addCase(completePasswordReset.pending, (state, action) => {
            state.status = 'loading';
        });


    }
});

export const {clearState} = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
