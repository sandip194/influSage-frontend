import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiReplyLine, RiEdit2Line, RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";
import { Tooltip } from "antd";
import { Image } from 'primereact/image';
import { getSocket } from "../../sockets/socket";
import {
  setMessages,
  addMessage,
  deleteMessage,
  undoDeleteMessage,
  setMessageRead,
} from "../../features/socket/chatSlice";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffMins < 1440)
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  return date.toLocaleDateString();
};

export default function ChatMessagesVendor({ chat, messages, setReplyToMessage, setEditingMessage }) {
  const dispatch = useDispatch();
  const socket = getSocket();
  // const [messages, setMessages] = useState([]);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [deletedMessage, setDeletedMessage] = useState({});
  const scrollRef = useRef(null);

  const { token, userId, role } = useSelector((state) => state.auth) || {};
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getMessageStatusIcon = (msg) => {
  const isMe = msg.roleId === role; 
  if (!isMe) return null;

  if (role === 2) {
    return msg.readbyinfluencer ? "✔✔" : "✔";
  }

  if (role === 1) {
    return msg.readbyvendor ? "✔✔" : "✔";
  }

  return "✔";
};


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
          senderId: msg.userid,
          roleId: msg.roleid,
          content: (msg.message || "").replace(/^"|"$/g, ""),
          file: Array.isArray(msg.filepath)
            ? msg.filepath.join(",")
            : msg.filepath || "",
          time: msg.createddate,
          replyId: msg.replyid || null,
          deleted: msg.deleted || false,
        }));

        dispatch(setMessages(formattedMessages));
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  fetchMessages(); 

}, [chat?.conversationid, token, role]); 


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  // Handle delete message
  const handleDeleteMessage = async (messageId) => {
    dispatch(deleteMessage(messageId));
    socket.emit("deleteMessage", {
      messageId,
      conversationId: chat.id,
    });
    try {
      const res = await axios.put(
        `/chat/undodeletemessage`,
        { p_messageid: messageId, p_roleid: role, p_action: "delete" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.p_status) {
        toast.success(res.data.message);

        setDeletedMessage((prev) => ({
          ...prev,
          [messageId]: Date.now(),
        }));
      } else {
        toast.error(res.data.message || "Failed to delete message");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong while deleting.");
    }
  };

  const handleUndoMessage = async (messageId) => {
      dispatch(undoDeleteMessage(messageId));
    socket.emit("undoDeleteMessage", {
      messageId,
      conversationId: chat.id,
    });
    if (!deletedMessage[messageId]) {
      toast.error("No deleted message to undo.");
      return;
    }

    const elapsedMinutes =
      (Date.now() - deletedMessage[messageId]) / (1000 * 60);

    if (elapsedMinutes > 15) {
      toast.error("Undo time expired (15 minutes).");
      return;
    }

    try {
      const res = await axios.put(
        `/chat/undodeletemessage`,
        { p_messageid: messageId, p_roleid: role, p_action: "undo" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.p_status) {
        toast.success(res.data.message);

        setDeletedMessage((prev) => {
          const updated = { ...prev };
          delete updated[messageId];
          return updated;
        });
      } else {
        toast.error(res.data.message || "Failed to undo delete");
      }
    } catch (err) {
      console.error("Undo error:", err);
      toast.error("Something went wrong while undoing.");
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("deleteMessage", (messageId) => {
      dispatch(deleteMessage(messageId)); 
    });

    socket.on("undoDeleteMessage", (messageId) => {
      dispatch(undoDeleteMessage(messageId)); 
    });

    return () => {
      socket.off("deleteMessage");
      socket.off("undoDeleteMessage");
    };
  }, [socket, dispatch]);

  if (!chat)
    return <div className="flex-1 p-4">Select a chat to start messaging</div>;

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-1 pt-10  ">
      {messages.map((msg, index) => {
       const isMe = msg.roleId === role;
        const isLast = index === messages.length - 1;

        return (
          <div
            key={msg.id}
            ref={isLast ? scrollRef : null}
            className={`flex ${isMe ? "justify-end" : "items-start space-x-2"}`}
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

            <div
              onMouseEnter={() => setHoveredMsgId(msg.id)}
              onMouseLeave={() => setHoveredMsgId(null)}
              className={`relative flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`px-3 py-1 rounded-lg max-w-xs break-words ${isMe ? "bg-[#0D132D] text-white" : "bg-gray-200 text-gray-900"}`}
                style={{ wordBreak: "break-word" }}
              >
                {msg.file && (
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
                          <Image
                            src={fileUrl}
                            alt={fileName}
                            className="max-w-[200px] max-h-[200px] rounded-md object-cover"
                            preview
                          />
                        );
                      }else if (isPDF) {
                      return (
                        <div className="flex flex-col items-center gap-2">
                          <iframe
                            src={fileUrl}
                            title={fileName}
                            className="w-full max-w-[250px] h-[200px] rounded-md border"
                          ></iframe>

                          <a
                            href={fileUrl}
                            download={fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-sm mt-2"
                          >
                            {fileName}
                          </a>
                        </div>
                      );
                }
                else if (isVideo) {
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
                          <div className="flex items-center gap-2 text-sm">
                            <a
                              href={fileUrl}
                              download={fileName}
                              className="text-blue-500 underline"
                            >
                              {fileName}
                            </a>
                          </div>
                        );
                      } else {
                        return (
                          <a
                            href={fileUrl}
                            rel="noopener noreferrer"
                            className="text-white text-sm underline break-all"
                          >
                            {fileName}
                          </a>
                        );
                      }
                    })()}
                  </div>
                )}



                {/* Reply Preview */}
                {msg.replyId && (
                    <div
                      className={`mb-1 px-2 py-1 rounded-md border-l-4 text-xs max-w-[220px] ${
                        isMe
                          ? "bg-gray-700 border-blue-400 text-gray-200"
                          : "bg-gray-300 border-green-500 text-gray-800"
                      }`}
                    >
                      {(() => {
                        const repliedMsg = messages.find((m) => m.id === msg.replyId);

                        if (!repliedMsg)
                          return (
                            <span className="italic text-gray-500">Message deleted</span>
                          );

                        const fileUrl = repliedMsg.file
                          ? `${BASE_URL}/${repliedMsg.file}`
                          : null;

                        return (
                          <div className="flex flex-col">
                            <span className="font-semibold text-[11px] text-blue-600">
                              {repliedMsg.senderId === role || repliedMsg.senderId === userId
                                ? "You"
                                : chat?.name || "Unknown"}
                            </span>
                            {/* Quoted text */}
                            {repliedMsg.content && <span className="truncate">{repliedMsg.content}</span>}

                            {/* Quoted file attachment */}
                            {fileUrl && (
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 text-[10px] underline mt-1"
                              >
                                {repliedMsg.file.split("/").pop()}
                              </a>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

               {deletedMessage[msg.id] ? (
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
                <div className="text-[10px] text-gray-500 mt-1 px-2 flex items-center gap-1 justify-end">
                  <span>{formatTime(msg.time)}</span>
                  <span className="text-blue-500">{getMessageStatusIcon(msg)}</span>
                </div>

              {hoveredMsgId === msg.id && (
                <div
                  className={`absolute flex gap-2 items-center px-3 py-1 bg-white shadow-md rounded-md z-10 transition-opacity duration-150 ${isMe ? "right-0 -top-8" : "left-0 -top-8"
                    }`}
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
                         onClick={() => {
                            setEditingMessage(msg); 
                            setReplyToMessage?.(null);
                          }}
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
