
import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from '../features/socket/notificationSlice'; // Example slice
import socketReducer from '../features/socket/socketSlice';
import chatReducer from '../features/socket/chatSlice';
import authReducer from '../features/auth/authSlice'; // Example slice

export const store = configureStore({
  reducer: {
     notifications: notificationReducer,
     auth: authReducer,
     socket: socketReducer,
     chat: chatReducer
  },
});
