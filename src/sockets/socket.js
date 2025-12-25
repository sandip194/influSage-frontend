import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let socket = null;

export function initSocket(token) {
  if (!socket && token) {
    socket = io(BASE_URL, {
      auth: { token },
    });
    console.log("✅ Socket initialized:", socket);
  }
  return socket;
}

export const getSocket = () => socket;

export const resetSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("❌ Socket disconnected and reset");
    socket = null;
  }
};