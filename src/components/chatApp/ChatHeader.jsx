import { useEffect, useState, useRef } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { getSocket } from "../../sockets/socket";

export default function ChatHeader({ chat, onBack }) {

  // console.log("ChatHeader rendered");
  // console.log("ChatHeader props chat:", chat);

  const initial = chat?.name?.charAt(0).toUpperCase() || "?";
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  // const [onlineTime, setOnlineTime] = useState(0); // Uncomment if needed in UI
  const timerRef = useRef(null);
  const hasRequestedOnlineUsers = useRef(false);
  const listenersAttached = useRef(false); // Prevent duplicate listener attachments

  const { userId } = useSelector((state) => state.auth);
  const socket = getSocket();
  // console.log("Socket instance in ChatHeader:", socket);



  useEffect(() => {
    const chatUserId = chat?.vendorId; // update if needed
    if (!chatUserId) {
      console.warn("chatUser Id missing");
      return;
    }
    if (!userId) {
      console.warn("userId missing");
      return;
    }
    if (!socket?.connected) {
      console.warn("Socket not connected");
      return;
    }

    socket.emit("register", userId);

    const handleOnline = (data) => {
      const uid = data?.userId ?? data;
      console.log("user-online event:", uid);
      if (String(uid) === String(chatUserId)) {
        setIsOnline(true);
        setLastSeen(null);
      }
    };

    const handleOffline = (data) => {
      const uid = data?.userId ?? data;
      const ls = data?.lastSeen;
      console.log("user-offline event:", uid, ls);
      if (String(uid) === String(chatUserId)) {
        setIsOnline(false);
        setLastSeen(ls);
      }
    };

    const handleInitialOnline = (data) => {
      // console.log("online-users event:", data);
      let userIds = [];

      if (Array.isArray(data)) {
        userIds = data;
      } else if (data && data.userIds) {
        userIds = data.userIds;
      }

      const normalizedUserIds = userIds.filter(id => id).map(String);

      if (normalizedUserIds.includes(String(chatUserId))) {
        setIsOnline(true);
        setLastSeen(null);
      } else {
        setIsOnline(false);
      }
    };

    if (!hasRequestedOnlineUsers.current) {
      socket.emit("online-users");
      hasRequestedOnlineUsers.current = true;
    }

    if (!listenersAttached.current) {
      socket.on("user-online", handleOnline);
      socket.on("user-offline", handleOffline);
      socket.on("online-users", handleInitialOnline);

      listenersAttached.current = true;
    }

    return () => {
      if (listenersAttached.current) {
        socket.off("user-online", handleOnline);
        socket.off("user-offline", handleOffline);
        socket.off("online-users", handleInitialOnline);
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
          {isOnline ? "Online" : formatLastSeen(lastSeen)} {/* Add onlineTime if needed: `Online for ${onlineTime}s` */}
        </div>
      </div>
    </div>
  );
}