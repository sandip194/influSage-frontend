import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let socket = null;

export function initSocket(token, userId) {
  if (!socket && token) {
    socket = io(BASE_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      if (userId) {
        socket.emit("register", userId);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }
  return socket;
}

export const getSocket = () => socket;

export const resetSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    console.log("🔄 Socket reset");
  }
};