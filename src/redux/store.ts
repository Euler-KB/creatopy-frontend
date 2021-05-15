import {configureStore} from "@reduxjs/toolkit";
import authReducer from './features/authSlice';
import itemsReducer from './features/itemsSlice';
import forgotPasswordReducer from './features/forgotPasswordSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        items: itemsReducer,
        forgotPassword: forgotPasswordReducer
    }
});


export type RootState = ReturnType<typeof store.getState>

export default store;
