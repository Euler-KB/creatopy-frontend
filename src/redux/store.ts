import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice';
import itemsReducer from './features/itemsSlice';
import forgotPasswordReducer from './features/forgotPasswordSlice';

export default configureStore({
    reducer: {
        auth: authReducer,
        items: itemsReducer,
        forgotPassword: forgotPasswordReducer
    }
});
