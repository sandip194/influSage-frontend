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

            state.messages.push({
                ...incoming,
                readbyvendor: incoming.readbyvendor ?? false,
                readbyinfluencer: incoming.readbyinfluencer ?? false,
            });
            // console.log("Redux Message Added", incoming);
        },


        updateMessage: (state, action) => {
            const { id, tempId, newId, content, file, edited, status } = action.payload;

            const msg = state.messages.find(
                (m) =>
                (id && String(m.id) === String(id)) ||
                (tempId && String(m.tempId) === String(tempId))
            );

            if (!msg) {
                console.log("⚠️ No message found to update", action.payload);
                return;
            }

            if (newId) msg.id = newId;
            if (content !== undefined) msg.content = content;
            if (file) msg.file = file;
            if (edited) msg.edited = true;
            if (status) msg.status = status;

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
            const { messageId, readerRole } = action.payload;

            state.messages = state.messages.map(msg => {
                if (String(msg.id) !== String(messageId)) return msg;

                const updatedMsg = {
                    ...msg,
                    readbyvendor: readerRole === 2 ? true : msg.readbyvendor ?? false,
                    readbyinfluencer: readerRole === 1 ? true : msg.readbyinfluencer ?? false,
                };

                // console.log(
                //     `✅ Message ${updatedMsg.id} marked as read by role ${readerRole}`,
                //     updatedMsg
                // );

                return updatedMsg;
            });

            // console.log("🟢 Updated messages array:", state.messages);
        },

        setMessages: (state, action) => {
            state.messages = action.payload;
        },
    },
});

export const { setActiveChat, addMessage, setActiveConversation, updateMessage, updateMessageStatus, deleteMessage, undoDeleteMessage, setMessageRead, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
