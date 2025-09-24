import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Sidebar from "./SidebarVendor";
import ChatHeader from "./ChatHeaderVendor";
import ChatMessages from "./ChatMessagesVendor";
import ChatInput from "./ChatInputVendor";
import { useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ChatAppPage() {
  const { token, userId, role } = useSelector((state) => state.auth);

  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const currentUser = { id: userId, role };

  // Initialize Socket.IO
  useEffect(() => {
    if (!token) return;
    const newSocket = io(BASE_URL, { auth: { token } });
    setSocket(newSocket);

    newSocket.on("connect", () => console.log("✅ Connected:", newSocket.id));
    newSocket.on("disconnect", () => console.log("❌ Disconnected"));
    newSocket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => newSocket.disconnect();
  }, [token]);

const insertMessage = async ({ conversationId, roleId, message, filePath = null }) => {
  try {
     const payload = {
      p_conversationid: conversationId,
      p_roleid: roleId,
      p_messages: message,
      p_filepath: filePath
    };

    const res = await axios.post(
      `/chat/insertmessage`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = res.data;

    if (!data.p_status) throw new Error(data.message || "Failed to send message");

    return data;
  } catch (err) {
    console.error("Insert message error:", err);
    return null;
  }
};

const handleSendMessage = async ({ text, file }) => {
  if (!activeChat?.conversationid) return;

  const conversationId = activeChat.conversationid;

  const result = await insertMessage({
    conversationId,
    roleId: currentUser.role,
    message: text,
    filePath: file ? file : "", 
  });

  if (result?.p_status) {
    const newMsg = {
      id: Date.now(),
      sender: currentUser.id,
      content: text,
      type: file ? "file" : "text",
      conversationId,
      files: result.filePaths ? result.filePaths.split(",") : [],
    };

    setMessages((prev) => [...prev, newMsg]);
    socket?.emit("sendMessage", newMsg);
  }
};

  return (
    <div className="h-[85vh] flex flex-row overflow-hidden gap-2">
     <Sidebar
  onSelectChat={(chat) => {
    const normalizedChat = chat.campaign ? { ...chat, conversationid: chat.campaign.conversationid } : chat;
    setActiveChat(normalizedChat);
    setMessages([]); 
  }}
/>
      <div
        className={`w-full md:w-[600px] h-full flex flex-col bg-white rounded-2xl shadow-md ${
          activeChat ? "flex" : "hidden md:flex"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white rounded-t-2xl border-b border-gray-200">
          <ChatHeader chat={activeChat} onBack={() => setActiveChat(null)} />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <ChatMessages chat={activeChat} messages={messages} />
        </div>

        {/* Input */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100">
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
