import { useEffect, useState, useRef } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { getSocket } from "../../sockets/socket";
import useSocketRegister from "../../sockets/useSocketRegister";

export default function ChatHeaderUnified({ chat, onBack, onOnlineStatusChange }) {
  useSocketRegister();

  const { userId, role } = useSelector((state) => state.auth);
  const socket = getSocket();

  const initial = chat?.name?.charAt(0)?.toUpperCase() || "?";

  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  const hasRequestedOnlineUsers = useRef(false);
  const listenersAttached = useRef(false);
  const timerRef = useRef(null);

  // 👤 role-wise user id to track
  const chatUserId =
    role === 1 ? chat?.vendorId : chat?.influencerid;

  useEffect(() => {
    if (!chatUserId || !userId || !socket?.connected) return;

    socket.emit("register", userId);

    const handleOnline = (data) => {
      const uid = data?.userId ?? data;
      if (String(uid) === String(chatUserId)) {
        setIsOnline(true);
        setLastSeen(null);
        onOnlineStatusChange?.(true);
      }
    };

    const handleOffline = (data) => {
      const uid = data?.userId ?? data;
      if (String(uid) === String(chatUserId)) {
        setIsOnline(false);
        setLastSeen(data?.lastSeen || null);
        onOnlineStatusChange?.(false);
      }
    };

    const handleInitialOnlineUsers = (data) => {
      let userIds = [];

      if (Array.isArray(data)) userIds = data;
      else if (data?.userIds) userIds = data.userIds;

      const normalized = userIds
        .filter(Boolean)
        .map((id) => String(id));

      if (normalized.includes(String(chatUserId))) {
        setIsOnline(true);
        setLastSeen(null);
        onOnlineStatusChange?.(true);
      } else {
        setIsOnline(false);
        onOnlineStatusChange?.(false);
      }
    };

    if (!hasRequestedOnlineUsers.current) {
      socket.emit("online-users");
      hasRequestedOnlineUsers.current = true;
    }

    if (!listenersAttached.current) {
      socket.on("user-online", handleOnline);
      socket.on("user-offline", handleOffline);
      socket.on("online-users", handleInitialOnlineUsers);
      listenersAttached.current = true;
    }

    return () => {
      if (listenersAttached.current) {
        socket.off("user-online", handleOnline);
        socket.off("user-offline", handleOffline);
        socket.off("online-users", handleInitialOnlineUsers);
        listenersAttached.current = false;
      }
      hasRequestedOnlineUsers.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [chatUserId, userId, socket, role]);

  const formatLastSeen = (time) => {
    if (!time) return "Offline";
    const date = new Date(time);
    return `Last seen: ${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <div className="flex items-center space-x-3 p-4 bg-white rounded-t-2xl">
      <button onClick={onBack} className="md:hidden cursor-pointer text-2xl text-gray-500 mr-2">
        <RiArrowLeftLine />
      </button>

      <div className="relative w-10 h-10">
        <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
          {chat?.img ? (
            <img
              src={chat.img}
              alt={chat?.name_campaignname || chat?.fullname}
              onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
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

      <div>
        <div className="font-semibold">
          {role === 2 ? chat?.fullname || "Chat" : chat?.name_campaignname || "Chat"}
        </div>
        <div className="text-sm text-gray-400">
          {isOnline ? "Online" : formatLastSeen(lastSeen)}
        </div>
      </div>
    </div>
  );
}
