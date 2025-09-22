import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
  },
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload;
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload); // add latest on top
    },
    markAsRead: (state, action) => {
      const index = state.items.findIndex((n) => n.notification_id === action.payload);
      if (index !== -1) state.items[index].is_read = true;
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { setNotifications, addNotification, markAsRead, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
