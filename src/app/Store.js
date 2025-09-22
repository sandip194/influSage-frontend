
import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from '../features/notifications/notificationSlice'; // Example slice
import authReducer from '../features/auth/authSlice'; // Example slice

export const store = configureStore({
  reducer: {
     notifications: notificationReducer,
     auth: authReducer,
  },
});
