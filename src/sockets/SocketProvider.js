import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { initSocket, getSocket } from "./socket";
import { setConnected, setOnlineUsers } from "../features/socket/socketSlice";

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.id);

  useEffect(() => {
    if (token) {
      const socket = initSocket(token);

      socket.connect();

      socket.on("connect", () => {
        dispatch(setConnected(true));
        socket.emit("register", userId);
      });

      socket.on("disconnect", () => {
        dispatch(setConnected(false));
      });

      socket.on("onlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      // Add other socket event listeners here (e.g., chat messages, notifications)

      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("onlineUsers");
        // Remove other listeners
        socket.disconnect();
      };
    }
  }, [token, userId, dispatch]);

  return children;
};

export default SocketProvider;
