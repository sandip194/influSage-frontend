import { useEffect, useState, useRef } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { getSocket } from "../../sockets/socket";
import useSocketRegister from "../../sockets/useSocketRegister";

export default function ChatHeaderVendor({ chat, onBack, onOnlineStatusChange  }) {
  useSocketRegister();
  // console.log("ChatHeaderVendor rendered");
  // console.log("ChatHeaderVendor props chat:", chat);
  const initial = chat?.name?.charAt(0).toUpperCase() || "?";
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  // const [onlineTime, setOnlineTime] = useState(0); // Uncomment if you want to use timer
  const timerRef = useRef(null);
  const hasRequestedOnlineUsers = useRef(false);
  const listenersAttached = useRef(false);

  const { userId } = useSelector((state) => state.auth);
  const socket = getSocket();
  // console.log("Socket instance in ChatHeaderVendor:", socket);

  useEffect(() => {
    const chatUserId = chat?.influencerid; // or chat?.id if you fix your data shape
    // console.log("ChatHeaderVendor useEffect:", { chatUserId, userId, socketConnected: socket?.connected });
    if (!chatUserId || !userId || !socket?.connected) return;

  socket.emit("register", userId);

  if (!hasRequestedOnlineUsers.current) {
    socket.emit("online-users");
    hasRequestedOnlineUsers.current = true;
  }

  if (!listenersAttached.current) {
    const handleUserOnline = ({ userId: uid }) => {
     // console.log("Received user-online event:", uid);
      if (String(uid) === String(chatUserId)) {
        setIsOnline(true);
        onOnlineStatusChange(true)
      }
    };
    const handleUserOffline = ({ userId: uid, lastSeen }) => {
     // console.log("Received user-offline event:", uid, lastSeen);
      if (String(uid) === String(chatUserId)) {
        setIsOnline(false);
        setLastSeen(lastSeen);
        onOnlineStatusChange(false)
      }
    };

    const handleInitialOnlineUsers = (data) => {
      // console.log("Received online-users event:", data);
      let userIds = [];

      if (Array.isArray(data)) {
        userIds = data;
      } else if (data && data.userIds) {
        userIds = data.userIds;
      }

      const normalizedUserIds = userIds
        .filter(id => id != null && id !== '' && id !== 'null')
        .map(id => String(id));

      if (normalizedUserIds.includes(String(chatUserId))) {
        setIsOnline(true);
         onOnlineStatusChange(true)
      } else {
        setIsOnline(false);
         onOnlineStatusChange(false)
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
}, [chat?.influencerid, userId, socket]);

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