import { useEffect, useState, useRef } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { getSocket } from "../../sockets/socket";

export default function ChatHeaderVendor({ chat, onBack }) {
  const initial = chat?.name?.charAt(0).toUpperCase() || "?";
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  // const [onlineTime, setOnlineTime] = useState(0); // Uncomment if you want to use timer
  const timerRef = useRef(null);
  const hasRequestedOnlineUsers = useRef(false);
  const listenersAttached = useRef(false);

  const { id: userId } = useSelector((state) => state.auth);
  const socket = getSocket();

  useEffect(() => {
    if (!chat?.id || !userId || !socket?.connected) return;

    socket.emit("register", userId);

    if (!hasRequestedOnlineUsers.current) {
      socket.emit("online-users");
      hasRequestedOnlineUsers.current = true;
    }

    if (!listenersAttached.current) {
      const handleUserOnline = ({ userId: uid }) => {
        if (String(uid) === String(chat.id)) {
          setIsOnline(true);
        }
      };
      const handleUserOffline = ({ userId: uid, lastSeen }) => {
        if (String(uid) === String(chat.id)) {
          setIsOnline(false);
          setLastSeen(lastSeen);
        }
      };

      const handleInitialOnlineUsers = (data) => {
        // data might be { userIds: [...] } or an array directly
        let userIds = [];

        if (Array.isArray(data)) {
          userIds = data;
        } else if (data && data.userIds) {
          userIds = data.userIds;
        }

        // Normalize IDs to strings and filter invalids
        const normalizedUserIds = userIds
          .filter(id => id != null && id !== '' && id !== 'null')
          .map(id => String(id));

        if (normalizedUserIds.includes(String(chat.id))) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      };

      socket.on("user-online", handleUserOnline);
      socket.on("user-offline", handleUserOffline);
      socket.on("online-users", handleInitialOnlineUsers);

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
  }, [chat?.id, userId, socket]);

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
          {isOnline ? "Online" : formatLastSeen(lastSeen)}
        </div>
      </div>
    </div>
  );
}