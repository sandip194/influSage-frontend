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
        },
        deleteMessage: (state, action) => {
        const message = state.messages.find(msg => msg.id === action.payload);
        if (message) {
            message.deleted = true; 
        }
        },
        undoDeleteMessage: (state, action) => {
        const message = state.messages.find(msg => msg.id === action.payload);
        if (message) {
            message.deleted = false; 
        }
        },
      setMessageRead: (state, action) => {
        const { messageId, readbyvendor, readbyinfluencer } = action.payload;
        console.log("Before update:", state.messages.find(m => m.id === messageId));

        state.messages = state.messages.map(msg =>
            msg.id === messageId
            ? {
                ...msg,
                readbyvendor: readbyvendor !== undefined ? readbyvendor : msg.readbyvendor,
                readbyinfluencer: readbyinfluencer !== undefined ? readbyinfluencer : msg.readbyinfluencer,
                }
            : msg
        );
        },

        setMessages: (state, action) => {
        state.messages = action.payload;
        },
    },
});

export const { setActiveChat, addMessage, updateMessageStatus, deleteMessage, undoDeleteMessage, setMessageRead,setMessages } = chatSlice.actions;
export default chatSlice.reducer;
    