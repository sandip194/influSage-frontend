
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; // Example slice

export const store = configureStore({
  reducer: {
     auth: authReducer,
  },
});
