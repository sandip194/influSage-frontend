import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RiReplyLine, RiEdit2Line, RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";

export default function ChatMessagesVendor({ chat, setReplyToMessage }) {
  const [messages, setMessages] = useState([]);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [deletedMessage, setDeletedMessage] = useState({
    id: null,
    timestamp: null,
  });
  const scrollRef = useRef(null);

  const { token, id: userId, role } = useSelector((state) => state.auth) || {};
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!chat?.conversationid || !token) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/chat/messages`, {
          params: {
            p_conversationid: chat.conversationid,
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
            deleted: msg.deleted || false, // Track deletion status
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

  // DELETE message API call
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

  // UNDO message API call with 15 min expiry check
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

  if (!chat) return <div className="flex-1 p-4">Select a chat to start messaging</div>;

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
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
              {/* Show file only if the message is not deleted */}
              {deletedMessage.id !== msg.id && msg.file && (
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

              {/* Show "Message deleted" and undo button if the message is deleted */}
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
                <>
                  {/* Text Content */}
                  {msg.content && <div>{msg.content}</div>}
                </>
              )}
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
                      onClick={() => handleDeleteMessage(msg.id)}
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
