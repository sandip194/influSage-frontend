// src/sockets/socketEvents.js
import { addMessage } from "../features/socket/chatSlice";
import { addNotification } from "../features/socket/notificationSlice";
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

  socket.on("notification", (data) => {
    dispatch(addNotification(data));
  });

  socket.on("online-users", ({ userIds }) => {
    dispatch(setOnlineUsers(userIds));
  });
};
