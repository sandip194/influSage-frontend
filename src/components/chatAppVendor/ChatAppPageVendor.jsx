import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Sidebar from "./SidebarVendor";
import ChatHeader from "./ChatHeaderVendor";
import ChatMessages from "./ChatMessagesVendor";
import ChatInput from "./ChatInputVendor";
import { useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ChatAppPageVendor() {
  const { token, id: userId, role } = useSelector((state) => state.auth);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);


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

  // Send message
  const handleSendMessage = async ({ text, file }) => {
    if (!activeChat) return;

    try {
      const payload = {
        p_conversationid: activeChat.id,
        p_conversationid: activeChat.conversationid,
        p_roleid: role,
        p_messages: text,
        p_filepath: file || null,
      };

      const res = await axios.post(`/chat/insertmessage`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.p_status) {
        const newMsg = {
          id: Date.now(),
          senderId: role,
          content: text,
          conversationId: activeChat.id,
          conversationId: activeChat.conversationid,
        };

        // Append locally and emit to Socket.IO
        setMessages((prev) => [...prev, newMsg]);
        socket?.emit("sendMessage", newMsg);
      }
    } catch (err) {
      console.error(err);
    }
  };

    return (
  <div className="h-[85vh] flex flex-row gap-2 overflow-hidden">
    {/* Sidebar */}
    <Sidebar
      onSelectChat={(chat) => {
        const normalizedChat = chat.campaign
          ? { ...chat, conversationid: chat.campaign.conversationid }
          : chat;

        setActiveChat(normalizedChat);
        setMessages([]); 
      }}
      className="md:w-1/4 w-full h-full"
    />

    {/* Chat Area */}
    <div
      className={`flex-1 md:w-[600px] h-full flex flex-col bg-white rounded-2xl shadow-md ${
        activeChat ? "flex" : "hidden md:flex"
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 rounded-t-2xl">
        <ChatHeader chat={activeChat} onBack={() => setActiveChat(null)} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4" style={{
      backgroundImage: 'url("https://www.transparenttextures.com/patterns/skulls.png")',
      backgroundRepeat: 'repeat',
      backgroundSize: 'auto',
      backgroundPosition: 'center',
      opacity: 0.9  // Optional: adjust for lighter feel
    }}>
        {activeChat ? (
          <ChatMessages
            chat={{
              ...activeChat,
              myRoleId: role,
              myUserId: userId,
            }}
            messages={messages}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100">
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  </div>
);

}
