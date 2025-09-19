import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Sidebar from './SidebarVendor';
import ChatHeader from './ChatHeaderVendor';
import ChatMessages from './ChatMessagesVendor';
import ChatInput from './ChatInputVendor';
import { useSelector } from 'react-redux';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function ChatAppPageVendor() {
  const { token, userId, role } = useSelector((state) => state.auth);

  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  // current user first
  const currentUser = { id: userId, role };

  // Initialize socket after component mounts
  useEffect(() => {
    const newSocket = io(BASE_URL, {
      auth: { token },
    });
    setSocket(newSocket);

    newSocket.on("connect", () => console.log("✅ Connected:", newSocket.id));
    newSocket.on("disconnect", () => console.log("❌ Disconnected"));
    newSocket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => newSocket.disconnect();
  }, [token]);

  // Register user on socket after login
  useEffect(() => {
    if (socket && currentUser?.id) {
      socket.emit("register", currentUser.id);
      console.log("📡 Registering user:", currentUser.id);
    }
  }, [socket, currentUser]);

  // Create conversation
  const createConversation = async (receiverId, receiverRole) => {
    try {
      const res = await fetch(`${BASE_URL}/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          p_senderid: currentUser.id,
          p_senderrole: currentUser.role,
          p_receiverid: receiverId,
          p_receiverrole: receiverRole,
          p_message: "",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Conversation creation failed");
      return data.data;
    } catch (err) {
      console.error("❌ Create conversation error:", err);
      return null;
    }
  };

  // Send message
  const handleSendMessage = async (text) => {
    // if (!text.trim()) return;
    if (!activeChat) return;

    let conversationId = activeChat?.id;

    // If no conversation exists → create one
    if (!conversationId) {
      const conv = await createConversation(activeChat.userId, activeChat.role);
      if (!conv) return;
      setActiveChat(conv);
      conversationId = conv.id;
    }

    const newMsg = {
      id: Date.now(),
      sender: currentUser.id,
      content: text,
      type: "text",
      conversationId,
    };

    setMessages((prev) => [...prev, newMsg]);
    socket?.emit("sendMessage", newMsg);
  };

  return (
    <div className="h-[85vh] flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`md:w-1/4 w-full h-full border-gray-200 flex-shrink-0 me-2 ${
          activeChat ? 'hidden md:block' : 'block'
        }`}
      >
        <Sidebar onSelectChat={(chat) => setActiveChat(chat)} />
      </div>

      {/* Chat area */}
      <div
        className={`flex-1 h-full flex flex-col ${
          activeChat ? 'flex' : 'hidden md:flex'
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
