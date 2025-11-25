// src/sockets/socketEvents.js
import { addMessage, deleteMessage, setMessageRead, undoDeleteMessage, updateMessage } from "../features/socket/chatSlice";
import { addNotification, setUnreadCount, setLastThreeUnread, setNotifications, incrementUnread } from "../features/socket/notificationSlice";
import { setConnected, setOnlineUsers } from "../features/socket/socketSlice";

export const registerSocketEvents = (socket, dispatch, userId) => {
  if (!socket) return;

  socket.on("connect", () => {
    dispatch(setConnected(true));
    socket.emit("register", userId);
  });

  socket.on("disconnect", () => dispatch(setConnected(false)));

  socket.on("receiveMessage", (msg) => {
    dispatch(addMessage(msg));
  });

  socket.on("unreadCount", (count) => {
    dispatch(setUnreadCount(count));
  });

  socket.on("lastThreeUnread", (list) => {
    dispatch(setLastThreeUnread(list));
  });

  socket.on("allNotifications", (list) => {
    dispatch(setNotifications(list));
  });

  socket.on("receiveNotification", (notif) => {
    dispatch(addNotification(notif));
    dispatch(incrementUnread());
  });


  socket.on("online-users", ({ userIds }) => {
    dispatch(setOnlineUsers(userIds));
  });

  // Listen for delete message event
  socket.on("deleteMessage", (messageId) => {
    dispatch(deleteMessage(messageId)); // Delete message locally in Redux
  });

  // Listen for undo delete message event
  socket.on("undoDeleteMessage", (messageId) => {
    dispatch(undoDeleteMessage(messageId)); // Undo delete locally in Redux
  });

  socket.on("updateMessageStatus", ({ messageId, readbyvendor, readbyinfluencer }) => {
    console.log("Received read update:", { messageId, readbyvendor, readbyinfluencer });
    dispatch(setMessageRead({ messageId, readbyvendor, readbyinfluencer }));
  });

  socket.on("editMessage", ({ updatedMsg }) => {
    dispatch(updateMessage(updatedMsg));;
  });

};  
