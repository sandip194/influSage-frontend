import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getSocket } from "./socket";

export default function useSocketRegister() {
  const socket = getSocket();
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    if (!socket || !token || !userId) return;
    if (!socket.connected) return;

    console.log("🔐 Socket registered via hook:", userId);
    socket.emit("register", userId);
  }, [socket, token, userId]);
}
