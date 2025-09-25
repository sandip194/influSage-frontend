import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function ChatMessages({ chat }) {
  const [messages, setMessages] = useState([]);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const scrollRef = useRef(null);
  const { token, id: userId, role } = useSelector((state) => state.auth) || {};

  useEffect(() => {
    if (!chat?.id || !token) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/chat/messages`, {
          params: {
            p_conversationid: chat.id,
            p_roleid: role,
            p_limit: 50,
            p_offset: 0
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.data?.records) {
          const formattedMessages = res.data.data.records.map((msg) => ({
            id: msg.messageid,
            senderId: msg.roleid,
            content: (msg.message || "").replace(/^"|"$/g, ""),
            file: Array.isArray(msg.filepath) ? msg.filepath.join(",") : msg.filepath || "",
            time: msg.createddate
          }));      

          setMessages(formattedMessages);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [chat, token, role]);

  // Scroll to top so recent message is visible
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [messages]);

  if (!chat) return <div className="flex-1 p-4">Select a chat to start messaging</div>;

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
      {messages.map((msg) => {
        const isMe = msg.senderId === role || msg.senderId === userId;

        return (
          <div
            key={msg.id}
            className={`flex relative ${isMe ? "justify-end" : "items-start space-x-2"}`}
            onMouseEnter={() => setHoveredMsgId(msg.id)}
            onMouseLeave={() => setHoveredMsgId(null)}
          >
            {!isMe && (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                {chat?.img ? (
                  <img src={chat.img} alt={chat.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span>{chat?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            )}

            <div className={`p-3 rounded-lg max-w-xs ${isMe ? "bg-[#0D132D] text-white" : "bg-gray-200 text-gray-900"}`}>
              {msg.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
