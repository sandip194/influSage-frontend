import React, { useState, useRef, useEffect } from "react";
import {
  RiEmojiStickerLine,
  RiAttachment2,
  RiImageLine,
  RiSendPlaneFill,
  RiMessage3Line,
  RiReplyLine,
} from "@remixicon/react";
import { getSocket } from "../../../sockets/socket";
import { addMessage } from "../../../features/socket/chatSlice";
import EmojiPicker from "emoji-picker-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Tooltip } from "antd";

const AdminChatWindow = ({ activeSubject }) => {
  const dispatch = useDispatch();
  const socket = getSocket();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [isResolved, setIsResolved] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedPreview, setAttachedPreview] = useState(null);
  const [highlightMsgId, setHighlightMsgId] = useState(null);
  const chatRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

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
  useEffect(() => {
    if (!socket || !activeSubject?.id) return;

    socket.emit("joinTicketRoom", activeSubject.id);
    return () => {
      socket.emit("leaveTicketRoom", activeSubject.id);
    };
  }, [socket, activeSubject?.id]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      const file = msg.filePath || msg.filepath || msg.file || null;

      let filetype = null;
      if (file) {
        const ext = file.split(".").pop().toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
          filetype = "image";
        else if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext))
          filetype = "video";
        else filetype = "file";
      }

      const formattedMsg = {
        id: msg.usersupportticketmessagesid,
        message: msg.message,
        filepath: file,
        filetype,
        replyId: msg.replyid || null,
        sender: msg.roleid === 4 ? "admin" : "user",
        time: msg.time,
      };

      setMessages((prev) => [...prev, formattedMsg]);
      dispatch(addMessage(formattedMsg));
    };

    socket.on("receiveSupportMessage", handleReceiveMessage);
    return () => socket.off("receiveSupportMessage", handleReceiveMessage);
  }, [socket]);

  const handleSend = async () => {
    if (!activeSubject) return;
    if (!message.trim() && !attachedFile) return;

    try {
      const formData = new FormData();
      formData.append("p_usersupportticketid", activeSubject.id);
      formData.append("p_messages", message || "");
      formData.append("p_replyid", replyToMessage?.id || "");
      if (attachedFile) formData.append("file", attachedFile);

      const res = await axios.post(
        "/chat/support/user-admin/send-message",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const resp = await axios.get(
        `/chat/support/user-admin/open-chat/${activeSubject.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { p_limit: 200, p_offset: 0 },
        }
      );

      const sorted = (resp.data?.data?.records || []).sort(
        (a, b) => new Date(a.createddate) - new Date(b.createddate)
      );

      const formatted = sorted.map((m) => {
        let filetype = null;
        if (m.filepath) {
          const ext = m.filepath.split(".").pop().toLowerCase();
          if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
            filetype = "image";
          else if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext))
            filetype = "video";
          else filetype = "file";
        }

        return {
          id: m.usersupportticketmessagesid,
          replyId: m.replyid || null,
          message: m.message,
          filepath: m.filepath || null,
          filetype,
          sender: m.roleid === 4 ? "admin" : "user",
          time: m.createddate,
        };
      });

      setMessages(formatted);

      if (socket) {
        const lastMsg = formatted[formatted.length - 1];
        socket.emit("sendSupportMessage", {
          ticketId: activeSubject.id,
          id: lastMsg.id,
          replyId: lastMsg.replyId,
          message: lastMsg.message,
          filepath: lastMsg.filepath,
          roleid: 4,
        });
      }

      setMessage("");
      setAttachedFile(null);
      setAttachedPreview(null);
      setReplyToMessage(null);
    } catch (err) {
      console.error("Send message error", err);
      toast.error("Message not sent");
    }
  };

  const handleKeyPress = (e) => e.key === "Enter" && handleSend();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachedFile(file);
    setAttachedPreview(URL.createObjectURL(file));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachedFile(file);
    setAttachedPreview(URL.createObjectURL(file));
  };

  const handleResolve = async () => {
    if (!activeSubject || isResolved) return;
    try {
      setIsResolved(true);
      await axios.post(
        "/chat/support/ticket/create-or-update-status",
        {
          p_usersupportticketid: activeSubject.id,
          p_objectiveid: null,
          p_statusname: "Resolved",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Ticket resolved successfully");
    } catch {
      setIsResolved(false);
    }
  };

  useEffect(() => {
    setIsResolved(activeSubject?.statusname === "Resolved");
  }, [activeSubject]);
const handleScroll = () => {
  if (!chatRef.current) return;

  if (chatRef.current.scrollTop === 0 && hasMore && !loadingMore) {
    const prevHeight = chatRef.current.scrollHeight;
    loadMessages().then(() => {
      setTimeout(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight - prevHeight;
      }, 50);
    });
  }
};

  const loadMessages = async () => {
  if (!activeSubject?.id || loadingMore || !hasMore) return;
  setLoadingMore(true);

  try {
    const res = await axios.get(
      `/chat/support/user-admin/open-chat/${activeSubject.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          p_limit: 10,
          p_offset: offset + 1,
        },
      }
    );

    const newRecords = res.data?.data?.records || [];

    if (newRecords.length < 10) {
      setHasMore(false);
    }

    const sorted = newRecords.sort(
      (a, b) => new Date(a.createddate) - new Date(b.createddate)
    );

    const formatted = sorted.map((m) => ({
      id: m.usersupportticketmessagesid,
      replyId: m.replyid,
      message: m.message,
      filepath: m.filepath,
      filetype: m.filetype,
      sender: m.roleid === 4 ? "admin" : "user",
      time: m.createddate,
    }));

   if (offset === 0) {
  setMessages(formatted);

  setTimeout(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, 50);
}

    setOffset((prev) => prev + 1);
  } finally {
    setLoadingMore(false);
  }
};
useEffect(() => {
  if (!activeSubject?.id) return;
  setMessages([]);
  setOffset(0);
  setHasMore(true);
  loadMessages();
}, [activeSubject]);


  return (
    <div className="flex flex-col h-full relative overflow-hidden rounded-md">
      {!activeSubject && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute top-[28%] w-full flex flex-col items-center text-center px-6"
        >
          <RiMessage3Line className="w-15 h-15 text-gray-700 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">
            Start a conversation
          </h2>
          <p className="text-gray-500 max-w-lg mt-2 leading-relaxed">
            Select a subject from the left panel to begin chatting.
            <br />
            You can send messages, images, emojis, and files.
          </p>
        </motion.div>
      )}

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* messages */}
      {activeSubject && (
        <motion.div
          className="flex flex-col h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="p-4 flex justify-between items-center border-b border-gray-500">
            <h1 className="text-2xl font-bold text-[#0D132D]">
              {activeSubject?.name}
            </h1>
            {activeSubject?.isclaimedbyadmin && (
              <button
                onClick={handleResolve}
                disabled={isResolved}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                  isResolved
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {isResolved ? "Resolved" : "Resolve"}
              </button>
            )}
          </div>

           <div
              className="flex-1 overflow-y-auto space-y-4 p-4 pb-28"
              ref={chatRef}
              onScroll={handleScroll}
            >
              {loadingMore && (
                <div className="flex justify-center py-2">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

                      {messages.map((msg) => {
                        if (!msg.message && !msg.filepath) return null;
          
                        return (
                          <motion.div
                            key={msg.id}
                            id={msg.id}
                            onMouseEnter={() => setHoveredMsgId(msg.id)}
                            onMouseLeave={() => setHoveredMsgId(null)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                             className={`relative flex transition-all duration-300 ${
                              msg.sender === "admin" ? "justify-end" : "justify-start"
                            } ${highlightMsgId === msg.id ? "bg-blue-200/60 rounded-xl p-1" : ""}`}
                          >
                            <div className="flex flex-col max-w-[65%]">
                              <div
                                className={`px-4 py-2 rounded-2xl shadow-md text-sm break-words whitespace-pre-wrap ${
                                  msg.sender === "admin" ? "bg-[#0D132D] text-white" : "bg-gray-100 text-gray-900"
                                }`}
                              >
                                {/* reply preview */}
                                {msg.replyId && (
                                  <div
                                    onClick={() => {
                                      const el = document.getElementById(msg.replyId);
                                      if (el) {
                                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                                        setHighlightMsgId(msg.replyId);
                                        setTimeout(() => setHighlightMsgId(null), 1200);
                                      }
                                    }}
                                    className={`mb-2 px-2 py-1 rounded-md border-l-4 text-xs cursor-pointer ${
                                      msg.sender === "admin"
                                        ? "bg-white/20 border-blue-400 text-blue-100"
                                        : "bg-gray-200 border-blue-500 text-gray-700"
                                    }`}
                                  >
                                    {(() => {
                                      const repliedMsg = messages.find((m) => m.id === msg.replyId);
                                      let previewText = repliedMsg?.message;
                                      if (!previewText) {
                                        if (repliedMsg?.filetype === "image") previewText = "📷 Image";
                                        else if (repliedMsg?.filetype === "video") previewText = "🎬 Video";
                                        else if (repliedMsg?.filetype === "file")
                                          previewText = "📎 " + repliedMsg?.filepath?.split("/").pop();
                                      }
                                      return (
                                        <>
                                          {repliedMsg?.sender === "admin" && (
                                            <span className="font-semibold block">You</span>
                                          )}
                                          <span className="block truncate">{previewText}</span>
                                        </>
                                      );
                                    })()}
                                  </div>
                                )}
          
                                {/* message text */}
                                {!msg.filepath && msg.message && <span>{msg.message}</span>}
          
                                {/* reply button */}
                                {hoveredMsgId === msg.id && (
                                  <button
                                    onClick={() =>
                                      setReplyToMessage({
                                        id: msg.id,
                                        message: msg.message,
                                        filepath: msg.filepath,
                                        filetype: msg.filetype,
                                        sender: msg.sender,
                                      })
                                    }
                                    className={`absolute -top-6 p-1 bg-white shadow hover:bg-gray-100 transition ${
                                      msg.sender === "admin" ? "right-0" : "left-0"
                                    }`}
                                  >
                                    <Tooltip title="Reply">
                                      <RiReplyLine size={18} className="text-gray-700" />
                                    </Tooltip>
                                  </button>
                                )}
          
                                {/* image */}
                                {msg.filetype === "image" && (
                                  <img
                                    src={msg.filepath}
                                    className="w-full max-w-[220px] rounded-lg mt-2 cursor-pointer hover:opacity-90 transition"
                                    onClick={() => setPreviewImage(msg.filepath)}
                                  />
                                )}
          
                                {/* video */}
                                {msg.filetype === "video" && (
                                  <video
                                    controls
                                    className="w-full max-w-[240px] rounded-lg mt-2 cursor-pointer"
                                    onClick={() => setPreviewVideo(msg.filepath)}
                                  >
                                    <source src={msg.filepath} type="video/mp4" />
                                  </video>
                                )}
          
                                {/* file */}
                                {msg.filetype === "file" && (
                                  <div
                                    className="flex items-center gap-2 text-white px-3 mt-2 cursor-pointer"
                                    onClick={() => window.open(msg.filepath, "_blank")}
                                  >
                                    <span className="underline font-medium truncate">
                                      {msg.filepath.split("/").pop()}
                                    </span>
                                  </div>
                                )}
                              </div>
          
                              {/* Message time */}
                              <p
                                className={`text-[10px] mt-1 ${
                                  msg.sender === "admin" ? "text-gray-500 self-end" : "text-gray-500 self-start"
                                }`}
                              >
                                {formatTime(msg.time)}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
        </motion.div>
      )}
      <motion.div
        initial={false}
        animate={{ marginTop: activeSubject ? "0px" : "50vh" }}
        transition={{ type: "spring", stiffness: 45, damping: 12 }}
        className="px-6 sticky bottom-0 w-full bg-white border-t border-gray-300"
      >
        {replyToMessage && (
          <div className="bg-gray-200 border-l-4 border-blue-600 px-3 py-2 rounded-md mb-2 flex justify-between items-center">
            <div className="text-xs text-gray-700">
              {(() => {
                let previewText = replyToMessage?.message;

                if (!previewText) {
                  if (replyToMessage?.filetype === "image")
                    previewText = "📷 Image";
                  else if (replyToMessage?.filetype === "video")
                    previewText = "🎬 Video";
                  else if (replyToMessage?.filetype === "file")
                    previewText =
                      "📎 " + replyToMessage?.filepath?.split("/").pop();
                }

                return (
                  <>
                    Replying to:{" "}
                    <span className="font-semibold">
                      {previewText?.slice(0, 40)}
                    </span>
                  </>
                );
              })()}
            </div>

            <button
              onClick={() => setReplyToMessage(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        )}

        {attachedPreview && (
          <div className="mb-3 flex items-center gap-3 bg-gray-200 p-2 rounded-md">
            {attachedFile.type.startsWith("image") ? (
              <img
                src={attachedPreview}
                className="w-20 h-20 rounded-md object-cover cursor-pointer"
                onClick={() => setPreviewImage(attachedPreview)}
              />
            ) : (
              <div className="flex-1 text-sm font-medium truncate">
                📎 {attachedFile.name}
              </div>
            )}

            <button
              onClick={() => {
                setAttachedPreview(null);
                setAttachedFile(null);
              }}
              className="text-gray-600 hover:text-red-600 text-lg font-bold"
            >
              ✕
            </button>
          </div>
        )}

        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`flex items-center bg-gray-300 rounded-full px-4 2 py-2 shadow-lg ${
            !activeSubject && "opacity-60"
          }`}
        >
          <input
            type="text"
            placeholder={
              activeSubject
                ? "Type your message..."
                : "Select a subject to start chat..."
            }
            disabled={!activeSubject}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
          />

          <div className="flex items-center gap-3 text-gray-600">
            <RiEmojiStickerLine
              className={`text-xl ${
                activeSubject ? "cursor-pointer" : "opacity-40"
              }`}
              onClick={() =>
                activeSubject && setShowEmojiPicker(!showEmojiPicker)
              }
            />
            <RiImageLine
              className={`text-xl ${
                activeSubject ? "cursor-pointer" : "opacity-40"
              }`}
              onClick={() => activeSubject && imageInputRef.current.click()}
            />
            <RiAttachment2
              className={`text-xl ${
                activeSubject ? "cursor-pointer" : "opacity-40"
              }`}
              onClick={() => activeSubject && fileInputRef.current.click()}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={!activeSubject}
            onClick={handleSend}
            className={`ml-3 bg-[#0D132D] text-white p-2 rounded-full shadow-md ${
              !activeSubject
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-[#1B2448]"
            }`}
          >
            <RiSendPlaneFill className="text-lg" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* emoji picker */}
      {showEmojiPicker && (
        <motion.div
          className="absolute bottom-24 right-10 z-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <EmojiPicker
            onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)}
          />
        </motion.div>
      )}

      {/* fullscreen image preview */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <button className="absolute top-6 right-8 text-white text-3xl font-bold hover:text-gray-300">
            ×
          </button>
          <img
            src={previewImage}
            className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* fullscreen video preview */}
      {previewVideo && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreviewVideo(null)}
        >
          <button className="absolute top-6 right-8 text-white text-3xl font-bold hover:text-gray-300">
            ×
          </button>
          <video
            src={previewVideo}
            controls
            autoPlay
            className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default AdminChatWindow;
