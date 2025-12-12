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
            const { tempId, newId, content, fileUrl } = action.payload;
            const index = state.messages.findIndex((msg) => msg.id === tempId);
            if (index !== -1) {
                state.messages[index] = {
                    ...state.messages[index],
                    id: newId,
                    content: content || state.messages[index].content,
                    file: fileUrl || state.messages[index].file,
                    status: "sent",
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
        const { messageId, messageIds, readbyvendor, readbyinfluencer } = action.payload;

        console.log("🧠 REDUX UPDATE TICK", {
            messageId: action.payload.messageId,
            readbyvendor: action.payload.readbyvendor,
            readbyinfluencer: action.payload.readbyinfluencer,
        });

            const idsToUpdate = messageIds || (messageId ? [messageId] : []);

            state.messages = state.messages.map((msg) => {
                if (!idsToUpdate.includes(String(msg.id))) return msg;

                return {
                    ...msg,
                    readbyvendor: readbyvendor !== undefined ? readbyvendor : msg.readbyvendor,
                    readbyinfluencer: readbyinfluencer !== undefined
                        ? readbyinfluencer
                        : msg.readbyinfluencer,
                };
            });
        },


        setMessages: (state, action) => {
            state.messages = action.payload;
        },
    },
});

export const { setActiveChat, addMessage, updateMessage, updateMessageStatus, deleteMessage, undoDeleteMessage, setMessageRead, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
