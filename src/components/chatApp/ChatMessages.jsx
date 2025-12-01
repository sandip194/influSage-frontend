import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RiReplyLine,
  RiEdit2Line,
  RiDeleteBinLine,
  RiCheckDoubleLine,
  RiCheckLine,
  RiDownload2Line,
} from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";
import { Tooltip } from "antd";
import { Image } from "primereact/image";
import { getSocket } from "../../sockets/socket";
import {
  setMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  undoDeleteMessage,
} from "../../features/socket/chatSlice";
import DOMPurify from "dompurify";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// ⏱️ Consistent formatTime function
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

/* 🧹 Unescape escaped HTML */
const unescapeHtml = (str) => {
  if (!str) return "";
  str = str.replace(/\\\\/g, "\\");
  str = str.replace(/\\"/g, '"');
  str = str.replace(/\\'/g, "'");
  str = str.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
  return str;
};

export default function ChatMessages({
  chat,
  isRecipientOnline,
  messages,
  setReplyToMessage,
  setEditingMessage,
  editingMessage,
}) {
  const dispatch = useDispatch();
  const socket = getSocket();
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [deletedMessage, setDeletedMessage] = useState({});
  const scrollRef = useRef(null);

  const scrollContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const lastMessageId = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const { token, userId, role } = useSelector((state) => state.auth) || {};
  // const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getMessageStatusIcon = (msg) => {
    const isMe = msg.roleId === role;
    if (!isMe) return null;

    const isRead = role === 2 ? msg.readbyinfluencer : msg.readbyvendor;

    if (isRead) {
      return <RiCheckDoubleLine className="text-blue-500 text-xs" size={17} />;
    }

    if (isRecipientOnline) {
      return <RiCheckDoubleLine className="text-gray-500 text-xs" size={17} />;
    }

    return <RiCheckLine className="text-gray-500 text-xs" size={17} />;
  };

  useEffect(() => {
    if (isLoading || messages.length === 0) return;

    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleDeleteMessage = async (messageId) => {
    dispatch(deleteMessage(messageId)); // <-- ADD THIS
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

    dispatch(undoDeleteMessage(messageId)); // <-- ADD THIS
    socket.emit("undoDeleteMessage", {
      messageId,
      conversationId: chat.id,
    });

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

  const scrollToMessage = (msgId) => {
    const msgElement = document.getElementById(`message-${msgId}`);
    if (msgElement) {
      msgElement.scrollIntoView({ behavior: "smooth", block: "center" });

      // Temporary highlight
      msgElement.classList.add("bg-blue-50");

      setTimeout(() => {
        msgElement.classList.remove("bg-blue-50");
      }, 2000);
    }
  };

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (msg) => {
      dispatch(addMessage(msg));
    });

    socket.on("deleteMessage", (messageId) => {
      dispatch(deleteMessage(messageId));
    });

    socket.on("undoDeleteMessage", (messageId) => {
      dispatch(undoDeleteMessage(messageId));
    });

    socket.on("editMessage", (updatedMessage) => {
      dispatch(updateMessage(updatedMessage));
    });

    socket.on(
      "updateMessageStatus",
      ({ messageId, readbyvendor, readbyinfluencer }) => {
        dispatch({
          type: "chat/setMessageRead",
          payload: { messageId, readbyvendor, readbyinfluencer },
        });
      }
    );

    return () => {
      socket.off("newMessage");
      socket.off("deleteMessage");
      socket.off("undoDeleteMessage");
      socket.off("updateMessageStatus");
      socket.off("editMessage");
    };
  }, [socket, dispatch]);

  // ⏱️ Move fetchMessages outside the effect so it can be reused
  const fetchMessages = async () => {
    if (!chat?.id || !token) return;

    try {
      const res = await axios.get(`/chat/messages`, {
        params: {
          p_conversationid: chat.id,
          p_roleid: role,
          p_offset: 0,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.data?.records) {
        const formattedMessages = res.data.data.records
          .map((msg) => {
            const raw = (msg.message || "").replace(/^"|"$/g, "");
            const unescaped = unescapeHtml(raw);
            const isHtml = /<\/?[a-z][\s\S]*>/i.test(unescaped);

            return {
              id: msg.messageid,
              senderId: msg.userid ?? null,
              roleId: msg.roleid,
              content: unescaped,
              file: Array.isArray(msg.filepath)
                ? msg.filepath.join(",")
                : msg.filepath || "",
              time: msg.createddate,
              replyId: msg.replyid || null,
              deleted: msg.isdeleted || false,
              readbyvendor: msg.readbyvendor ?? false,
              readbyinfluencer: msg.readbyinfluencer ?? false,
              ishtml: isHtml,
            };
          })
          .sort((a, b) => new Date(a.time) - new Date(b.time));
        dispatch(setMessages(formattedMessages));
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    if (!chat?.id || !token || !role) return;

    const loadMessagesOnce = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchMessages(),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
      setIsLoading(false);
    };

    loadMessagesOnce();
 }, [chat?.id, chat?.date, token, role]);

  useEffect(() => {
    if (!socket || !messages.length) return;

    messages.forEach((msg) => {
      const isMe = msg.roleId === role;

      const isUnread = !isMe && !msg.readbyvendor && !msg.readbyinfluencer;

      if (isUnread) {
        socket.emit("messageSeen", {
          messageId: msg.id,
          conversationId: chat.id,
          roleId: role,
        });
      }
    });
  }, [messages, socket, userId, chat?.id, role]);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       editingMessage &&
  //       scrollRef.current &&
  //       !scrollRef.current.contains(event.target)
  //     ) {
  //       setEditingMessage(null);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [editingMessage, setEditingMessage]);

  useEffect(() => {
    setEditingMessage(null);
  }, [chat?.id]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setEditingMessage(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;

      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setIsNearBottom(distanceFromBottom < 100); // 100px threshold
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isLoading, messages]);

  if (chat && isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center flex-1 h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading messages...</span>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto overflow-x-hidden px-0 pt-6 space-y-1"
    >
      {messages.map((msg, index) => {
        const isMe = msg.roleId === role;

        const isLast = index === messages.length - 1;
        // console.log("Message:", msg.content, "senderId:", msg.senderId, "userId:", userId, "isMe:", isMe);

        return (
          <div
            id={`message-${msg.id}`}
            key={msg.id}
            ref={isLast ? bottomRef : null}
            className={`flex relative ${isMe ? "justify-end mr-4" : "items-start space-x-2 ml-4"
              } ${editingMessage?.id === msg.id ? "bg-blue-50 " : ""}`}
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

            <div
              className={`relative flex flex-col ${isMe ? "items-end" : "items-start"
                }`}
            >
              {/* Message bubble */}
              <div
                className={`px-3 py-1 rounded-lg 
                  max-w-[90%] sm:max-w-xs md:max-w-sm 
                  break-all overflow-hidden whitespace-pre-wrap 
                  ${isMe
                    ? "bg-[#0D132D] text-white"
                    : "bg-gray-200 text-gray-900"
                  }`}
              >
                {/* FILE PREVIEW */}
                {!msg.deleted && msg.file && (
                  <div className="mb-2">
                    {(() => {
                      const files = Array.isArray(msg.file)
                        ? msg.file
                        : [msg.file];

                      return files.map((fileItem, idx) => {
                        let fileUrl = "";
                        let fileName = "";

                        if (typeof fileItem === "string") {
                          fileUrl = `${fileItem}`;
                          fileName = fileItem.split("/").pop();
                        } else if (
                          typeof fileItem === "object" &&
                          fileItem.url
                        ) {
                          fileUrl = `${fileItem.url}`;
                          fileName =
                            fileItem.name || fileItem.url.split("/").pop();
                        } else {
                          return null;
                        }

                        const isImage = fileName.match(
                          /\.(jpeg|jpg|png|gif|webp|bmp)$/i
                        );
                        const isPDF = fileName.match(/\.pdf$/i);
                        const isVideo = fileName.match(/\.(mp4|webm|ogg)$/i);
                        const isDoc = fileName.match(
                          /\.(doc|docx|xls|xlsx|ppt|pptx)$/i
                        );
                        const isZip = fileName.match(/\.(zip|rar|7z)$/i);

                        if (isImage) {
                          const handleDownload = async () => {
                            try {
                              const response = await fetch(fileUrl, {
                                mode: "cors",
                              });
                              const blob = await response.blob();
                              const blobUrl = window.URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = blobUrl;
                              link.download = fileName;
                              document.body.appendChild(link);
                              link.click();
                              link.remove();
                              window.URL.revokeObjectURL(blobUrl);
                            } catch (error) {
                              console.error("Download failed:", error);
                            }
                          };
                          return (
                            <div
                              key={idx}
                              className="flex flex-col items-center gap-2"
                            >
                              <Image
                                key={idx}
                                src={fileUrl}
                                alt={fileName}
                                className="max-w-[200px] max-h-[200px] rounded-md object-cover"
                                preview
                              />
                              <button
                                onClick={handleDownload}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-1"
                              >
                                <RiDownload2Line size={16} />
                                Download
                              </button>
                            </div>
                          );
                        } else if (isPDF) {
                          return (
                            <div
                              key={idx}
                              className="flex flex-col items-center gap-2"
                            >
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
                        } else if (isVideo) {
                          return (
                            <video
                              key={idx}
                              src={fileUrl}
                              controls
                              className="w-full max-w-[250px] rounded-md"
                            >
                              Your browser does not support the video tag.
                            </video>
                          );
                        } else if (isDoc || isZip) {
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm"
                            >
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
                              key={idx}
                              href={fileUrl}
                              rel="noopener noreferrer"
                              className="text-white text-sm underline break-all"
                            >
                              {fileName}
                            </a>
                          );
                        }
                      });
                    })()}
                  </div>
                )}

                {/* Reply Preview */}
                {msg.replyId && (
                  <div
                    onClick={() => scrollToMessage(msg.replyId)}
                    className={`mb-1 px-3 py-2 rounded-lg text-xs cursor-pointer max-w-[250px] transition-all duration-200 
                      ${isMe
                        ? "bg-gray-700 border-l-4 border-blue-400 text-gray-100"
                        : "bg-gray-100 border-l-4 border-green-500 text-gray-800"
                      }`}
                  >
                    {(() => {
                      const repliedMsg = messages.find(
                        (m) => m.id === msg.replyId
                      );

                      if (!repliedMsg || repliedMsg.deleted) {
                        return (
                          <div className="italic text-gray-500">
                            This message has been deleted
                          </div>
                        );
                      }

                      const fileUrl = repliedMsg.file
                        ? `${repliedMsg.file}`
                        : null;

                      return (
                        <div className="flex flex-col gap-1">
                          {/* Sender */}
                          <span className="font-semibold text-[11px] text-blue-600">
                            {repliedMsg.senderId === role ||
                              repliedMsg.senderId === userId
                              ? "You"
                              : chat?.name || "Unknown"}
                          </span>

                          {/* Quoted Text */}
                          {repliedMsg.content ? (
                            <span className="truncate max-w-[230px]">
                              {repliedMsg.content}
                            </span>
                          ) : fileUrl ? (
                            <span className="text-gray-500 italic">
                              Attachment
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">
                              No text content
                            </span>
                          )}

                          {/* Quoted File */}
                          {fileUrl && (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 text-[10px] underline mt-1 break-all"
                            >
                              {repliedMsg.file.split("/").pop()}
                            </a>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
                {msg.deleted ? (
                  <div className="text-sm text-red-600">
                    This message has been deleted
                    {isMe && (
                      <button
                        onClick={() => handleUndoMessage(msg.id)}
                        className="underline ml-2"
                      >
                        Undo
                      </button>
                    )}
                  </div>
                ) :(
                  <div
                    className={`text-sm break-words ${msg.ishtml ? "bg-white text-gray-900 p-2 rounded-md" : ""}`}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        msg.ishtml ? msg.content : (msg.content || "").replace(/\n/g, "<br>")
                      ),
                    }}
                  />
                )}
              </div>

              {/* TIMESTAMP */}
              <div className="text-[10px] text-gray-500 mt-1 px-2 flex items-center gap-1 justify-end">
                <span>{formatTime(msg.time)}</span>
                <span className="text-blue-500">
                  {getMessageStatusIcon(msg)}
                </span>
              </div>

              {/* HOVER ACTIONS */}
              {hoveredMsgId === msg.id && (
                <div
                  className={`absolute flex gap-2 items-center px-3 py-1 bg-white shadow-md rounded-md z-10 transition-opacity duration-150 ${isMe ? "right-0 -top-8" : "left-0 -top-8"
                    }`}
                >
                  {!msg.deleted && (
                    <button
                      onClick={() => {
                        setReplyToMessage?.(msg);
                        setEditingMessage?.(null);
                      }}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Tooltip title="Reply">
                        <RiReplyLine size={18} />
                      </Tooltip>
                    </button>
                  )}

                  {isMe && !msg.readbyvendor && !msg.deleted && (
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


