// src/store/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
        activeChat: null,
        activeConversationId: null,
    },
    reducers: {
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
            state.messages = []; // reset on change
        },
        setActiveConversation: (state, action) => {
            state.activeConversationId = action.payload;
        },
        addMessage: (state, action) => {
            const incoming = action.payload;

            const exists = state.messages.some(
                (m) =>
                    String(m.id) === String(incoming.id) ||
                    (incoming.tempId && String(m.tempId) === String(incoming.tempId))
            );

            if (exists) return;

            console.log("Redux Message Added",incoming)
            state.messages.push(incoming);
        },

        updateMessage: (state, action) => {
            const { tempId, newId, content, fileUrl } = action.payload;

            const msg = state.messages.find(
                (m) =>
                    String(m.id) === String(tempId) ||
                    String(m.tempId) === String(tempId)
            );

            if (!msg) return;

            msg.id = newId ?? msg.id;
            msg.content = content ?? msg.content;
            msg.file = fileUrl ?? msg.file;
            msg.status = "sent";
            msg.isTemp = false;
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

            state.messages = state.messages.map((msg) => {
                if (Number(msg.id) !== Number(messageId)) return msg;

                return {
                    ...msg,
                    readbyvendor:
                        readbyvendor === true ? true : msg.readbyvendor,
                    readbyinfluencer:
                        readbyinfluencer === true ? true : msg.readbyinfluencer,
                };
            });
        },


        setMessages: (state, action) => {
            state.messages = action.payload;
        },
    },
});

export const { setActiveChat, addMessage, setActiveConversation, updateMessage, updateMessageStatus, deleteMessage, undoDeleteMessage, setMessageRead, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
