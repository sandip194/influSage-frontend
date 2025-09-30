import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RiReplyLine, RiEdit2Line, RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";

export default function ChatMessages({ chat }) {
  const [messages, setMessages] = useState([]);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const scrollRef = useRef(null);

  const { token, id: userId, role } = useSelector((state) => state.auth) || {};
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
            time: msg.createddate,
            replyId: msg.replyid || null 
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
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  if (!chat) return <div className="flex-1 p-4">Select a chat to start messaging</div>;

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map((msg) => {
        const isMe = msg.senderId === role || msg.senderId === userId;

        return (
          <div
            key={msg.id}
            className={`flex relative ${isMe ? "justify-end" : "items-start space-x-2"}`}
            onMouseEnter={() => setHoveredMsgId(msg.id)}
            onMouseLeave={() => setHoveredMsgId(null)}
          >
            {/* Avatar */}
            {!isMe && (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                {chat?.img ? (
                  <img
                    src={chat.img}
                    alt={chat.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>{chat?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`p-3 rounded-lg max-w-xs space-y-2 break-words ${
                isMe ? "bg-[#0D132D] text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              {/* File */}
              {msg.file && (
                <div className="mb-2">
                  {msg.file.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                    <img
                      src={`${BASE_URL}/${msg.file}`}
                      alt="attachment"
                      className="max-w-[200px] rounded-md mb-2"
                    />
                  ) : (
                    <a
                      href={`${BASE_URL}/${msg.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      📎 View file
                    </a>
                  )}
                </div>
              )}

              {msg.replyId && (
                <div className="text-xs text-gray-500 border-l-4 pl-2 border-blue-500 mb-1 italic max-w-xs">
                  {messages.find((m) => m.id === msg.replyId)?.content || "Original message"}
                </div>
              )}

              {/* Text Content */}
              {msg.content && <div>{msg.content}</div>}
            </div>

            {/* Hover Actions */}
            {hoveredMsgId === msg.id && (
              <div
                className={`absolute flex gap-2 items-center px-3 py-1 bg-white shadow-md rounded-md ${
                  isMe ? "right-0 -top-8" : "left-14 -top-8"
                }`}
              >
                <button
                  onClick={() => setReplyToMessage?.(msg)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <RiReplyLine size={18} />
                </button>
                {isMe && (
                  <>
                    <button
                      onClick={() => console.log("Edit", msg.id)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <RiEdit2Line size={18} />
                    </button>
                    <button
                      onClick={() => console.log("Delete", msg.id)}
                      className="p-1 rounded-full hover:bg-gray-100 text-red-500"
                    >
                      <RiDeleteBinLine size={18} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
