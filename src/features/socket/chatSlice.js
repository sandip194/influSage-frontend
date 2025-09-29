// src/store/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
        activeChat: null,
    },
    reducers: {
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
            state.messages = []; // reset on change
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        updateMessageStatus: (state, action) => {
            const { tempId, newId, fileUrl } = action.payload;
            const msg = state.messages.find((m) => m.id === tempId);
            if (msg) {
                msg.id = newId || msg.id;
                msg.status = "sent";
                if (fileUrl) msg.fileUrl = fileUrl;
            }
        }
    },
});

export const { setActiveChat, addMessage, updateMessageStatus } = chatSlice.actions;
export default chatSlice.reducer;
