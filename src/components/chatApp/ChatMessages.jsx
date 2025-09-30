import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RiReplyLine, RiEdit2Line, RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";
import { Tooltip } from "antd";

// ⏱️ Consistent formatTime function (copied from ChatMessagesVendor)
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffMins < 1440) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  return date.toLocaleDateString();
};

export default function ChatMessages({ chat, setReplyToMessage }) {
  const [messages, setMessages] = useState([]);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [deletedMessage, setDeletedMessage] = useState({ id: null, timestamp: null });
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
            p_offset: 0,
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.data?.records) {
          const formattedMessages = res.data.data.records.map((msg) => ({
            id: msg.messageid,
            senderId: msg.roleid,
            content: (msg.message || "").replace(/^"|"$/g, ""),
            file: Array.isArray(msg.filepath)
              ? msg.filepath.join(",")
              : msg.filepath || "",
            time: msg.createddate,
            replyId: msg.replyid || null,
            deleted: msg.deleted || false,
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
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  const handleDeleteMessage = async (messageId) => {
    try {
      const res = await axios.put(
        `/chat/undodeletemessage`,
        {
          p_messageid: messageId,
          p_roleid: role,
          p_action: "delete",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.p_status) {
        toast.success(res.data.message);
        setDeletedMessage({ id: messageId, timestamp: Date.now() });
      } else {
        toast.error(res.data.message || "Failed to delete message");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong while deleting.");
    }
  };

  const handleUndoMessage = async (messageId) => {
    if (!deletedMessage.id || deletedMessage.id !== messageId) {
      toast.error("No deleted message to undo.");
      return;
    }

    const now = Date.now();
    const elapsedMinutes = (now - deletedMessage.timestamp) / (1000 * 60);

    if (elapsedMinutes > 15) {
      toast.error("Undo time expired (15 minutes).");
      return;
    }

    try {
      const res = await axios.put(
        `/chat/undodeletemessage`,
        {
          p_messageid: messageId,
          p_roleid: role,
          p_action: "undo",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.p_status) {
        toast.success(res.data.message);
        setDeletedMessage({ id: null, timestamp: null });
      } else {
        toast.error(res.data.message || "Failed to undo delete");
      }
    } catch (err) {
      console.error("Undo error:", err);
      toast.error("Something went wrong while undoing.");
    }
  };

  if (!chat)
    return <div className="flex-1 p-4">Select a chat to start messaging</div>;

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-6 space-y-1">
      {messages.map((msg, index) => {
        const isMe = msg.senderId === role || msg.senderId === userId;
        const isLast = index === messages.length - 1;

        return (
          <div
            key={msg.id}
            ref={isLast ? scrollRef : null}
            className={`flex relative ${isMe ? "justify-end" : "items-start space-x-2"}`}
            onMouseEnter={() => setHoveredMsgId(msg.id)}
            onMouseLeave={() => setHoveredMsgId(null)}
          >
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

            <div className={`relative flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              {/* Message bubble */}
              <div
                className={`px-3 py-1 rounded-lg max-w-xs break-words ${isMe ? "bg-[#0D132D] text-white" : "bg-gray-200 text-gray-900"}`}
              >
                {/* FILE PREVIEW */}
                {deletedMessage.id !== msg.id && msg.file && (
                  <div className="mb-2">
                    {(() => {
                      const fileUrl = `${BASE_URL}/${msg.file}`;
                      const fileName = msg.file.split("/").pop();
                      const isImage = msg.file.match(/\.(jpeg|jpg|png|gif|webp|bmp)$/i);
                      const isPDF = msg.file.match(/\.pdf$/i);
                      const isVideo = msg.file.match(/\.(mp4|webm|ogg)$/i);
                      const isDoc = msg.file.match(/\.(doc|docx|xls|xlsx|ppt|pptx)$/i);
                      const isZip = msg.file.match(/\.(zip|rar|7z)$/i);

                      if (isImage) {
                        return (
                          <img
                            src={fileUrl}
                            alt={fileName}
                            className="max-w-[200px] max-h-[200px] rounded-md object-cover"
                          />
                        );
                      } else if (isPDF) {
                        return (
                          <iframe
                            src={fileUrl}
                            title={fileName}
                            className="w-full max-w-[250px] h-[200px] rounded-md border"
                          ></iframe>
                        );
                      } else if (isVideo) {
                        return (
                          <video
                            src={fileUrl}
                            controls
                            className="w-full max-w-[250px] rounded-md"
                          >
                            Your browser does not support the video tag.
                          </video>
                        );
                      } else if (isDoc || isZip) {
                        return (
                          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md text-sm">
                            <span className="text-gray-600">📎 {fileName}</span>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              Download
                            </a>
                          </div>
                        );
                      } else {
                        return (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm underline break-all"
                          >
                            📎 {fileName}
                          </a>
                        );
                      }
                    })()}
                  </div>
                )}

                {/* TEXT or DELETED message */}
                {deletedMessage.id === msg.id ? (
                  <div className="text-sm text-red-600">
                    Message deleted.
                    <button
                      onClick={() => handleUndoMessage(msg.id)}
                      className="underline ml-2"
                    >
                      Undo
                    </button>
                  </div>
                ) : (
                  <div>{msg.content}</div>
                )}
              </div>

              {/* TIMESTAMP */}
              <div className="text-[10px] text-gray-500 mt-1 px-2">
                {formatTime(msg.time)}
              </div>

              {/* HOVER ACTIONS */}
              {hoveredMsgId === msg.id && (
                <div
                  className={`absolute flex gap-2 items-center px-3 py-1 bg-white shadow-md rounded-md z-10 transition-opacity duration-150 ${isMe ? "right-0 -top-8" : "left-0 -top-8"}`}
                >
                  <button
                    onClick={() => setReplyToMessage?.(msg)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Tooltip title="Replay">
                      <RiReplyLine size={18} />
                    </Tooltip>
                  </button>

                  {isMe && (
                    <>
                      <button
                        onClick={() => console.log("Edit", msg.id)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Tooltip title="Edit">
                          <RiEdit2Line size={18} />
                        </Tooltip>
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-1 rounded-full hover:bg-gray-100 text-red-500"
                      >
                        <Tooltip title="Delete">
                          <RiDeleteBinLine size={18} />
                        </Tooltip>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
