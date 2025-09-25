import { useEffect, useState, useRef } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ChatHeader({ chat, onBack }) {
  const initial = chat?.name?.charAt(0).toUpperCase() || "?";
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [onlineTime, setOnlineTime] = useState(0);
  const timerRef = useRef(null);

  const [socket] = useState(() => io(BASE_URL, { autoConnect: true }));
  const { userId } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!chat?.id) return;

    socket.emit("register",userId);

    socket.on("user-online", ({ userId }) => {
      if (userId === chat.id) {
        setIsOnline(true);
        setOnlineTime(0);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setOnlineTime((prev) => prev + 1), 1000);
      }
    });

    socket.on("user-offline", ({ userId, lastSeen }) => {
      if (userId === chat.id) {
        setIsOnline(false);
        setLastSeen(lastSeen);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    });

    // ✅ Handle initial online users list
    socket.on("online-users", ({ userIds }) => {
      if (userIds.includes(chat.id)) {
        setIsOnline(true);
        setOnlineTime(0);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setOnlineTime((prev) => prev + 1), 1000);
      }
    });

    return () => {
      socket.off("user-online");
      socket.off("user-offline");
      socket.off("online-users");
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [chat?.id]);


  const formatLastSeen = (time) => {
    if (!time) return "Offline";
    const date = new Date(time);
    return `Last seen: ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  const formatOnlineTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `Online`;
  };

  return (
    <div className="flex items-center space-x-3 p-4 bg-white  rounded-t-2xl">
      <button onClick={onBack} className="md:hidden text-2xl text-gray-500 mr-2">
        <RiArrowLeftLine />
      </button>

      {/* Profile image with online dot */}
      <div className="relative w-10 h-10">
        <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
          {chat?.img ? (
            <img
              src={chat.img}
              alt={chat.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>{initial}</span>
          )}
        </div>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      {/* Name and dynamic status */}
      <div>
        <div className="font-semibold">{chat?.name || "Chat"}</div>
        <div className="text-sm text-gray-400">
          {isOnline ? formatOnlineTime(onlineTime) : formatLastSeen(lastSeen)}
        </div>
      </div>
    </div>
  );
}
