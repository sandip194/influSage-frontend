import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Sidebar from "./SidebarVendor";
import ChatHeader from "./ChatHeaderVendor";
import ChatMessages from "./ChatMessagesVendor";
import ChatInput from "./ChatInputVendor";
import { useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ChatAppPageVendor() {
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

  // Start conversation via campaign
  const startConversation = async (campaignApplicationId) => {
    try {
      const res = await fetch(`${BASE_URL}/chat/startconversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          p_campaignapplicationid: campaignApplicationId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.p_status) throw new Error(data.message);
      return data.conversationId;
    } catch (err) {
      console.error("❌ Start conversation error:", err);
      return null;
    }
  };

  // Send message via SP
  const sendMessageToSP = async (conversationId, text) => {
    try {
      const res = await fetch(`${BASE_URL}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          p_action: "send",
          p_conversationid: conversationId,
          p_roleid: currentUser.role,
          p_messages: text,
          p_filepath: null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.p_status) throw new Error(data.message);
      return data;
    } catch (err) {
      console.error("❌ Send message error:", err);
      return null;
    }
  };

  // Handle sending message
  const handleSendMessage = async (text) => {
    if (!activeChat) return;

    let conversationId = activeChat.id;

    // If no conversation exists, start one
    if (!conversationId) {
      conversationId = await startConversation(
        activeChat.campaignApplicationId
      );
      if (!conversationId) return;
      setActiveChat({ ...activeChat, id: conversationId });
    }

    const result = await sendMessageToSP(conversationId, text);
    if (result?.p_status) {
      const newMsg = {
        id: Date.now(),
        sender: currentUser.id,
        content: text,
        type: "text",
        conversationId,
      };
      setMessages((prev) => [...prev, newMsg]);
      socket?.emit("sendMessage", newMsg);
    }
  };

  return (
    <div className="h-[85vh] flex flex-row overflow-hidden gap-2">
      {/* Sidebar (Expanded on desktop, full width on mobile) */}
      <div
        className={`w-full md:w-3/4 h-full ${
          activeChat ? "hidden md:block" : "block"
        }`}
      >
        <Sidebar onSelectChat={(chat) => setActiveChat(chat)} />
      </div>

      {/* Chat Area (Narrow, right-aligned on desktop) */}
      {/* Chat Area (Expanded and right-aligned on desktop) */}
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
