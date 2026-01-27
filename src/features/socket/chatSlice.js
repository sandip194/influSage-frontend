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
            const { id, tempId, newId, content, file, status } = action.payload;

            const msg = state.messages.find(
                (m) =>
                (tempId && String(m.tempId) === String(tempId)) ||
                (id && String(m.id) === String(id))
            );
            if (!msg) return;
            if (newId) {
                msg.id = newId;
                delete msg.tempId;
            }
            if (content !== undefined) {
                msg.content = content;
            }
            if (file !== undefined) {
                msg.file = file;
            }
            if (status) {
                msg.status = status;
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
            console.log("🔴 REDUX setMessageRead", action.payload);

            const { messageId, readbyvendor, readbyinfluencer } = action.payload;

            state.messages = state.messages.map((msg) => {
                if (String(msg.id) !== String(messageId)) return msg;

                console.log("✅ MATCH FOUND FOR READ", msg.id);

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
