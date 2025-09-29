import { useEffect, useState, useRef } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { getSocket } from "../../sockets/socket";

export default function ChatHeader({ chat, onBack }) {
  const initial = chat?.name?.charAt(0).toUpperCase() || "?";
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  // const [onlineTime, setOnlineTime] = useState(0); // Uncomment if needed in UI
  const timerRef = useRef(null);
  const hasRequestedOnlineUsers = useRef(false);
  const listenersAttached = useRef(false); // Prevent duplicate listener attachments

  const { id: userId } = useSelector((state) => state.auth);

  useEffect(() => {
    const socket = getSocket();
    if (!chat?.id || !socket?.connected) {
      console.warn("Socket not ready or chat.id missing");
      return;
    }

    socket.emit("register", userId);

    if (!hasRequestedOnlineUsers.current) {
      socket.emit("online-users");
      hasRequestedOnlineUsers.current = true;
    }

    if (!listenersAttached.current) {
      // Handle when a user comes online
      const handleOnline = (...args) => {
        const data = args[0];
        // Extract userId from event data (handle object or primitive)
        const uid = data?.userId ?? data ?? args[1];
        if (String(uid) === String(chat.id)) {
          setIsOnline(true);
          if (timerRef.current) clearInterval(timerRef.current);
          // Optionally start timer here if you want
        }
      };

      // Handle when a user goes offline
      const handleOffline = (...args) => {
        const data = args[0];
        const uid = data?.userId ?? data ?? args[1];
        const ls = data?.lastSeen ?? args[2];
        if (String(uid) === String(chat.id)) {
          setIsOnline(false);
          setLastSeen(ls);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      };

      // Handle initial list of online users
      const handleInitialOnline = (...args) => {
        let userIds = args[0];

        // Normalize userIds to an array of strings
        if (Array.isArray(userIds)) {
          userIds = userIds.filter(id => id != null && id !== '' && id !== 'null').map(String);
        } else if (userIds && typeof userIds === 'object' && userIds.userIds) {
          userIds = (userIds.userIds || []).filter(id => id != null && id !== '' && id !== 'null').map(String);
        } else {
          userIds = userIds ? [String(userIds)] : [];
        }

        if (userIds.includes(String(chat.id))) {
          setIsOnline(true);
          if (timerRef.current) clearInterval(timerRef.current);
          // Optionally start timer here if you want
        } else {
          setIsOnline(false);
        }
      };

      socket.on("user-online", handleOnline);
      socket.on("user-offline", handleOffline);
      socket.on("online-users", handleInitialOnline);

      listenersAttached.current = true;
    }

    return () => {
      if (listenersAttached.current) {
        socket.off("user-online");
        socket.off("user-offline");
        socket.off("online-users");
        listenersAttached.current = false;
      }
      if (timerRef.current) clearInterval(timerRef.current);
      hasRequestedOnlineUsers.current = false;
    };
  }, [chat?.id, userId]);

  const formatLastSeen = (time) => {
    if (!time) return "Offline";
    const date = new Date(time);
    return `Last seen: ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };


  return (
    <div className="flex items-center space-x-3 p-4 bg-white rounded-t-2xl">
      <button onClick={onBack} className="md:hidden text-2xl text-gray-500 mr-2">
        <RiArrowLeftLine />
      </button>

      <div className="relative w-10 h-10">
        <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
          {chat?.img ? (
            <img src={chat.img} alt={chat.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            <span>{initial}</span>
          )}
        </div>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      <div>
        <div className="font-semibold">{chat?.name || "Chat"}</div>
        <div className="text-sm text-gray-400">
          {isOnline ? "Online" : formatLastSeen(lastSeen)} {/* Add onlineTime if needed: `Online for ${onlineTime}s` */}
        </div>
      </div>
    </div>
  );
}