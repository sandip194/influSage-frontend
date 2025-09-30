import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RiReplyLine, RiEdit2Line, RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";

export default function ChatMessagesVendor({ chat }) {
  const [messages, setMessages] = useState([]);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const scrollRef = useRef(null);


  const { token, id: userId, role } = useSelector((state) => state.auth) || {};
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    console.log("Current chat:", chat);
    if (!chat?.conversationid || !token) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/chat/messages`, {
          params: {
            p_conversationid: chat.conversationid,
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  if (!chat) return <div className="flex-1 p-4">Select a chat to start messaging</div>;

    return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map((msg, index) => {
        const isMe = msg.senderId === role || msg.senderId === userId;
        const isLast = index === messages.length - 1;

        return (
          <div
            key={msg.id}
            ref={isLast ? scrollRef : null}
            className={`relative flex ${isMe ? "justify-end" : "items-start space-x-2"}`}
            onMouseEnter={() => setHoveredMsgId(msg.id)}
            onMouseLeave={() => setHoveredMsgId(null)}
          >
            {/* Avatar (only for receiver) */}
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
              className={`p-1 rounded-lg max-w-xs space-y-2 break-words ${
                isMe ? "bg-[#0D132D] text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              {/* Text Content */}
              {msg.content && <div className="px-2 py-1">{msg.content}</div>}

              {/* File Preview */}
              {msg.file && (() => {
                const fileUrl = `${BASE_URL}/${msg.file}`;
                const extension = msg.file.split(".").pop().toLowerCase();

                if (["jpeg", "jpg", "png", "gif", "bmp", "webp"].includes(extension)) {
                  return (
                    <img
                      src={fileUrl}
                      alt="attachment"
                      className="max-w-[200px] rounded cursor-pointer"
                      onClick={() => window.open(fileUrl, "_blank")}
                    />
                  );
                }

                if (["mp4", "webm", "ogg"].includes(extension)) {
                  return (
                    <video
                      controls
                      className="max-w-[250px] rounded cursor-pointer"
                    >
                      <source src={fileUrl} type={`video/${extension}`} />
                      Your browser does not support the video tag.
                    </video>
                  );
                }

                if (extension === "pdf") {
                  return (
                    <iframe
                      src={fileUrl}
                      className="w-full max-w-[300px] h-[400px] rounded border"
                      title="PDF Preview"
                    />
                  );
                }

                if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension)) {
                  return (
                    <a
                      href={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      📄 Preview in Google Docs
                    </a>
                  );
                }

                // Fallback
                return (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    📎 Download file
                  </a>
                );
              })()}
            </div>

            {/* Hover Actions */}
            {hoveredMsgId === msg.id && (
              <div
                className={`absolute flex gap-2 items-center px-3 py-1 bg-white shadow-md rounded-md ${
                  isMe ? "right-0 -top-8" : "left-14 -top-8"
                }`}
              >
                <button
                  onClick={() => console.log("Reply to", msg.id)}
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
