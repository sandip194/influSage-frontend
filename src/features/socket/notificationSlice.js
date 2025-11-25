import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    lastThreeUnread: [],
    unreadCount: 0,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload;
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    incrementUnread: (state) => {
      state.unreadCount += 1;
    },
    setLastThreeUnread: (state, action) => {
      state.lastThreeUnread = action.payload;
    },
    markAllRead: (state) => {
      state.unreadCount = 0;
    }
  },
});

export const {
  setNotifications,
  addNotification,
  setUnreadCount,
  incrementUnread,
  setLastThreeUnread,
  markAllRead
} = notificationSlice.actions;

export default notificationSlice.reducer;
