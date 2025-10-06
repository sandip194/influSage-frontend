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
        updateMessage: (state, action) => {
            const { id, content, file } = action.payload;
            const index = state.messages.findIndex((msg) => msg.id === id);
            if (index !== -1) {
                state.messages[index] = {
                    ...state.messages[index],
                    content,
                    file: file || state.messages[index].file,
                };
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

            state.messages = state.messages.map(msg =>
                msg.id?.toString() === messageId?.toString()
                    ? {
                        ...msg,
                        readbyvendor:
                            readbyvendor !== undefined ? readbyvendor : msg.readbyvendor,
                        readbyinfluencer:
                            readbyinfluencer !== undefined
                                ? readbyinfluencer
                                : msg.readbyinfluencer,
                    }
                    : msg
            );
        },

        setMessages: (state, action) => {
            state.messages = action.payload;
        },
    },
});

export const { setActiveChat, addMessage,updateMessage, updateMessageStatus, deleteMessage, undoDeleteMessage, setMessageRead, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
