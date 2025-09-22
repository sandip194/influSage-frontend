// ChatAppPage.js
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

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

  // Start conversation via campaign
  const startConversation = async (campaignApplicationId) => {
    try {
      const res = await fetch(`${BASE_URL}/chat/startconversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ p_campaignapplicationid: campaignApplicationId }),
      });
      const data = await res.json();
      if (!res.ok || !data.p_status) throw new Error(data.message);
      return data.conversationId;
    } catch (err) {
      console.error("❌ Start conversation error:", err);
      return null;
    }
  };

  // Call your insertMessage API
  const insertMessage = async (conversationId, text, files = null) => {
    try {
      const formData = new FormData();
      formData.append("p_conversationid", conversationId);
      formData.append("p_roleid", currentUser.role);
      formData.append("p_messages", text);
      if (files) {
        for (let file of files) {
          formData.append("files", file);
        }
      }

      // const res = await fetch(`${BASE_URL}/chat/message`, {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: formData,
      // });

      const data = await res.json();
      if (!res.ok || !data.p_status) throw new Error(data.message);
      return data;
    } catch (err) {
      console.error("❌ Insert message error:", err);
      return null;
    }
  };

  // Handle sending message
  const handleSendMessage = async ({ text, file }) => {
    if (!activeChat) return;

    let conversationId = activeChat.id;

    // If no conversation exists, start one
    if (!conversationId) {
      conversationId = await startConversation(activeChat.campaignApplicationId);
      if (!conversationId) return;
      setActiveChat({ ...activeChat, id: conversationId });
    }

    const result = await insertMessage(conversationId, text, file ? [file] : null);
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
    <div className="h-[85vh] flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`md:w-1/4 w-full h-full border-gray-200 flex-shrink-0 me-2 ${
          activeChat ? "hidden md:block" : "block"
        }`}
      >
        <Sidebar onSelectChat={(chat) => setActiveChat(chat)} />
      </div>

      {/* Chat area */}
      <div
        className={`flex-1 h-full flex flex-col ${
          activeChat ? "flex" : "hidden md:flex"
        }`}
      >
        <div className="sticky top-0 z-10 bg-white rounded-2xl border-b border-gray-200">
          <ChatHeader chat={activeChat} onBack={() => setActiveChat(null)} />
        </div>

        <div className="flex-1 overflow-y-auto bg-white p-4">
          <ChatMessages chat={activeChat} messages={messages} />
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100">
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
