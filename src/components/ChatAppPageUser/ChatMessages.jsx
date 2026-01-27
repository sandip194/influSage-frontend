import { useEffect, useState, useRef } from "react";
import {
  RiReplyLine,
  RiEdit2Line,
  RiDeleteBinLine,
  RiCheckDoubleLine,
  RiCheckLine,
  RiDownload2Line,
} from "react-icons/ri";
import { Tooltip } from "antd";
import { Image } from "primereact/image";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../../sockets/socket";
import DOMPurify from "dompurify";
import {
  setMessages,
  addMessage,
  setMessageRead,
  deleteMessage,
  undoDeleteMessage,
} from "../../features/socket/chatSlice";

// ⏱️ Consistent formatTime function
const formatTime = (timestamp) => {
  if (!timestamp) return "Just now";

  const parsed = new Date(timestamp);

  if (isNaN(parsed.getTime())) {
    return "Just now";
  }

  const now = new Date();
  const diffMs = now - parsed;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffMins < 1440) {
    return parsed.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  return parsed.toLocaleDateString();
};

/* 🧹 Unescape escaped HTML */
// const unescapeHtml = (str) => {
//   if (!str) return "";
//   str = str.replace(/\\\\/g, "\\");
//   str = str.replace(/\\"/g, '"');
//   str = str.replace(/\\'/g, "'");
//   str = str.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
//   return str;
// };

export default function ChatMessages({
  chat,
  isRecipientOnline,
  setReplyToMessage,
  setEditingMessage,
  editingMessage,
}) {
  const dispatch = useDispatch();
  const socket = getSocket();
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const messages = useSelector((state) => state.chat.messages);
  const [deletedMessage, setDeletedMessage] = useState({});
  const hasMarkedReadRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const emittedReadRef = useRef(new Set())
  const { token, userId, role } = useSelector((state) => state.auth);

  const getMessageStatusIcon = (msg) => {
    const isMe = Number(msg.roleId) === Number(role);
    if (!isMe) return null;

    const otherRead =
      role === 1 ? msg.readbyvendor : msg.readbyinfluencer;

    if (otherRead) {
      return <RiCheckDoubleLine className="text-blue-500" size={16} />;
    }

    if (isRecipientOnline) {
      return <RiCheckDoubleLine className="text-gray-400" size={16} />;
    }

    return <RiCheckLine className="text-gray-400" size={16} />;
  };


  const conversationId = chat?.conversationid || chat?.id;

  const handleDeleteMessage = async (messageId) => {
    dispatch(deleteMessage(messageId));
    socket.emit("deleteMessage", {
      messageId,
      conversationId: chat.id,
    });
    try {
      const res = await axios.put(
        `/chat/undodeletemessage`,
        {
          p_messageid: messageId,
          p_roleid: role,
          p_action: "delete",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.p_status) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to delete message");
      }
    } catch (err) {
      console.error("Delete error:", err);
      // toast.error(res.data.message);
    }
  };

  const handleUndoMessage = async (messageId) => {

    const elapsedMinutes =
      (Date.now() - deletedMessage[messageId]) / (1000 * 60);
    if (elapsedMinutes > 15) {
      toast.error("Undo time expired (15 minutes).");
      return;
    }

    dispatch(undoDeleteMessage(messageId));
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


  useEffect(() => {

    if (!socket || !conversationId || !messages.length) {
      console.log("🔍 useEffect skipped - missing deps", socket, conversationId, messages);
      return;
    }

    messages.forEach((msg) => {

      const isSender = Number(msg.roleId) === Number(role);
      if (!isSender) {
        const alreadyRead =
          role === 2
            ? msg.readbyvendor
            : msg.readbyinfluencer;


        // console.log("emit msg to messageRead (workaround)", msg);
        // console.log("alreadyRead", alreadyRead, "emittedReadRef", emittedReadRef.current.has(msg.id))
        if (!alreadyRead && !emittedReadRef.current.has(msg.id)) {
          console.log("msg sent to socket for Message Read :- ", msg)
          socket.emit("messageRead", {
            messageId: msg.id,
            conversationId,
            role,
          });

          emittedReadRef.current.add(msg.id);
        }
      }

      // if (Number(msg.roleId) !== Number(role)) {
      //   const alreadyRead =
      //     Number(role) === 2
      //       ? msg.readbyvendor
      //       : msg.readbyinfluencer;

      //   console.log("emit msg to messageRead (workaround)", msg);
      //   console.log("alreadyRead", alreadyRead, "emittedReadRef", emittedReadRef.current.has(msg.id))
      //   if (!alreadyRead && !emittedReadRef.current.has(msg.id)) {

      //     socket.emit("messageRead", {
      //       messageId: Number(msg.id),
      //       conversationId: conversationId,
      //       role: Number(role),
      //     });

      //     emittedReadRef.current.add(msg.id);
      //   }
      // }

    });
  }, [messages, socket, role, conversationId]);

  useEffect(() => {
    emittedReadRef.current.clear();
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scrollToMessage = (msgId) => {
    const msgElement = document.getElementById(`message-${msgId}`);
    if (msgElement) {
      msgElement.scrollIntoView({ behavior: "smooth", block: "center" });
      msgElement.classList.add("bg-blue-50");

      setTimeout(() => {
        msgElement.classList.remove("bg-blue-50");
      }, 2000);
    }
  };

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("deleteMessage", ({ messageId }) => {
      dispatch(deleteMessage(messageId));
    });

    socket.on("undoDeleteMessage", ({ messageId }) => {
      dispatch(undoDeleteMessage(messageId));
    });
    socket.on("updateMessageStatus", (payload) => {
      console.log("🟢 READ UPDATE", payload);
      dispatch(setMessageRead(payload));
    });

    return () => {
      socket.off("newMessage");
      socket.off("deleteMessage");
      socket.off("undoDeleteMessage");
      socket.off("updateMessageStatus");
      // socket.off("editMessage");
    };
  }, [socket, dispatch]);

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a conversation to start chatting
      </div>
    );
  }

  if (loading) {
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
      className="flex-1 overflow-y-auto overflow-x-hidden px-0 pt-8 space-y-3"
    >
      {messages.map((msg, index) => {
        const isMe = Number(msg.roleId) === Number(role);

        const isLast = index === messages.length - 1;

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
                    onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
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
                    max-w-[280px] sm:max-w-xs md:max-w-sm
                    break-words whitespace-pre-wrap
                    ${isMe
                    ? "bg-[#0D132D] text-white"
                    : "bg-gray-200 text-gray-900"
                  }`}
              >
                {msg.replyId && (
                  <div
                    onClick={() => scrollToMessage(msg.replyId)}
                    className={`mb-1 px-3 py-2 rounded-lg text-xs cursor-pointer max-w-[250px]
          ${isMe
                        ? "bg-gray-700 border-l-4 border-blue-400 text-gray-100"
                        : "bg-gray-100 border-l-4 border-green-500 text-gray-800"
                      }`}
                  >
                    {(() => {
                      const repliedMsg = messages.find(
                        (m) => String(m.id) === String(msg.replyId)
                      );

                      if (!repliedMsg || repliedMsg.deleted) {
                        return (
                          <div className="italic text-gray-500">
                            This message has been deleted
                          </div>
                        );
                      }

                      const fileUrl =
                        Array.isArray(repliedMsg.file) &&
                          repliedMsg.file.length > 0
                          ? repliedMsg.file[0]
                          : null;

                      return (
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-[11px] text-blue-600">
                            {Number(repliedMsg.roleId) === Number(role)
                              ? "You"
                              : chat?.name}
                          </span>

                          {repliedMsg.ishtml ? (
                            <span className="italic text-[11px]">
                              Campaign Invitation
                            </span>
                          ) : repliedMsg.content ? (
                            <span className="truncate max-w-[230px]">
                              {repliedMsg.content}
                            </span>
                          ) : null}

                          {fileUrl &&
                            (() => {
                              const fileName = fileUrl.split("/").pop();
                              const isImage =
                                /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

                              if (!isImage) {
                                return (
                                  <span className="text-blue-500 text-[10px] underline truncate">
                                    {fileName}
                                  </span>
                                );
                              }

                              return (
                                <div className="w-12 h-12 rounded overflow-hidden">
                                  <Image
                                    src={fileUrl}
                                    preview
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              );
                            })()}
                        </div>
                      );
                    })()}
                  </div>
                )}
                {/* FILE PREVIEW */}
                {!msg.deleted &&
                  Array.isArray(msg.file) &&
                  msg.file.length > 0 && (
                    <div className="mb-2 space-y-2">
                      {msg.file.map((fileUrl, idx) => {
                        const fileName = fileUrl.split("/").pop();
                        const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(
                          fileName
                        );
                        const isPDF = /\.pdf$/i.test(fileName);
                        const isVideo = /\.(mp4|webm|ogg)$/i.test(fileName);
                        const isDoc =
                          /\.(doc|docx|xls|xlsx|ppt|pptx|zip|rar|7z)$/i.test(
                            fileName
                          );

                        if (isImage) {
                          return (
                            <div key={idx} className="flex flex-col gap-1">
                              <Image
                                src={fileUrl}
                                preview
                                className="max-w-[220px] rounded-lg"
                              />
                              <a
                                href={fileUrl}
                                download={fileName}
                                className="flex items-center gap-1 text-blue-600 text-xs"
                              >
                                <RiDownload2Line /> Download
                              </a>
                            </div>
                          );
                        }

                        if (isPDF) {
                          return (
                            <div key={idx}>
                              <iframe
                                src={fileUrl}
                                className="w-[220px] h-[180px] rounded border"
                                title={fileName}
                              />
                              <a
                                href={fileUrl}
                                target="_blank"
                                className="text-blue-600 underline text-xs"
                              >
                                {fileName}
                              </a>
                            </div>
                          );
                        }

                        if (isVideo) {
                          return (
                            <video
                              key={idx}
                              src={fileUrl}
                              controls
                              className="w-[220px] rounded"
                            />
                          );
                        }

                        if (isDoc) {
                          return (
                            <a
                              key={idx}
                              href={fileUrl}
                              download
                              className="text-blue-600 underline text-xs"
                            >
                              {fileName}
                            </a>
                          );
                        }

                        return null;
                      })}
                    </div>
                  )}

                {msg.deleted ? (
                  <div className="text-sm text-red-600">
                    This message has been deleted
                    {isMe && (
                      <button
                        onClick={() => {
                          console.log("Undo clicked for msg.id:", msg.id);
                          handleUndoMessage(msg.id);
                        }}
                        className="underline ml-2 cursor-pointer"
                      >
                        Undo
                      </button>

                    )}
                  </div>
                ) : (
                  <div
                    className={`text-sm break-words ${msg.ishtml ? "bg-white text-gray-900 p-2 rounded-md" : ""
                      }`}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        (msg.content || msg.message || msg.text || "").replace(
                          /\n/g,
                          "<br>"
                        )
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

              {/* Hover actions */}
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

                  {isMe &&
                    !msg.deleted &&
                    (
                      (Number(role) === 1 && !msg.readbyvendor) ||
                      (Number(role) === 2 && !msg.readbyinfluencer)
                    ) && (
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
