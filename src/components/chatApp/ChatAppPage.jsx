import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import axios from "axios";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ChatAppPage() {
  const { token, id: userId, role } = useSelector((state) => state.auth);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  // Initialize Socket.IO
  useEffect(() => {
    if (!token) return;

    const newSocket = io(BASE_URL, { auth: { token } });
    setSocket(newSocket);

    newSocket.on("connect", () => console.log("✅ Connected:", newSocket.id));
    newSocket.on("disconnect", () => console.log("❌ Disconnected"));

    newSocket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]); // append new message
    });

    return () => newSocket.disconnect();
  }, [token]);


  // Send message
  const handleSendMessage = async ({ text, file }) => {
    if (!activeChat) return;

    try {
      const formData = new FormData();
      formData.append("p_conversationid", activeChat.id);
      formData.append("p_roleid", role);
      formData.append("p_messages", text);
      if (file) {
        formData.append("file", file); // The key must match what your backend expects
      }

      const res = await axios.post(`/chat/insertmessage`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Let axios set this automatically; optional
        },
      });

      if (res.data?.p_status) {
        const newMsg = {
          id: Date.now(),
          senderId: role,
          content: text,
          conversationId: activeChat.id,
          fileUrl: res.data?.filepath || null, // If backend returns file path
        };

        setMessages((prev) => [...prev, newMsg]);
        socket?.emit("sendMessage", newMsg);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };


  return (
    <div className="h-[85vh] flex overflow-hidden">
      <div className={`md:w-1/4 w-full h-full border-gray-200 flex-shrink-0 me-2 ${activeChat ? "hidden md:block" : "block"}`}>
        <Sidebar onSelectChat={(chat) => setActiveChat(chat)} />
      </div>

      <div className={`flex-1 h-full flex flex-col ${activeChat ? "flex" : "hidden md:flex"}`}>
        <div className="sticky top-0 z-10 bg-white rounded-2xl border-b border-gray-200">
          <ChatHeader chat={activeChat} onBack={() => setActiveChat(null)} />
        </div>

        <div className="flex-1 overflow-y-auto bg-white p-4">
          <ChatMessages chat={{ ...activeChat, myRoleId: role, myUserId: userId }} messages={messages} />
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100">
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
