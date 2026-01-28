import React, { useState, useRef, useEffect } from "react";
import {
  RiEmojiStickerLine,
  RiAttachment2,
  RiImageLine,
  RiSendPlaneFill,
  RiMessage3Line,
  RiReplyLine,
  RiArrowLeftLine
} from "@remixicon/react";
import { getSocket } from "../../sockets/socket";
import { addMessage } from "../../features/socket/chatSlice";
import EmojiPicker from "emoji-picker-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Tooltip } from "antd";
import useSocketRegister from "../../sockets/useSocketRegister";

const VendorChatWindow = ({ activeSubject, onCloseSuccess, onBack  }) => {
    useSocketRegister();
  const dispatch = useDispatch();
  const socket = getSocket();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { token, userId } = useSelector((state) => state.auth);
  const [isClosed, setIsClosed] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedPreview, setAttachedPreview] = useState(null);
  const [highlightMsgId , setHighlightMsgId ] = useState(null);
  const [showCloseButton, setShowCloseButton] = useState(true);

  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const chatRef = useRef(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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
  if (!activeSubject?.id || !socket) return;

  socket.emit("joinTicketRoom", activeSubject.id);
  return () => socket.emit("leaveTicketRoom", activeSubject.id);
}, [activeSubject?.id]);

useEffect(() => {
  if (!socket) return;

  const handleReceiveMessage = (msg) => {
    const file = msg.filePath || msg.filepath || msg.file || null;
    let filetype = null;
    if (file) {
      const ext = file.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) filetype = "image";
      else if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) filetype = "video";
      else filetype = "file";
    }

    const formattedMsg = {
      id: msg.usersupportticketmessagesid,
      message: msg.message,
      filepath: file,
      filetype,
      replyId: Number(msg.replyId || msg.replyid) || null,
      replyData: msg.replyData || null,
      sender: msg.senderId == userId ? "user" : "admin",
      time: msg.createddate || new Date().toISOString(),
    };

    setMessages(prev => [...prev, formattedMsg]);
    scrollToBottom();
  };

  socket.off("receiveSupportMessage");
  socket.on("receiveSupportMessage", handleReceiveMessage);
}, []);


const handleSend = async () => {
  if (!activeSubject) return;
   if (isMobile && (!activeSubject || isClosed)) {
    handleBlockedAction();
    return;
  }
  if (!message.trim() && !attachedFile) return;

  try {
    // 1️⃣ Send message
    const formData = new FormData();
    formData.append("p_usersupportticketid", activeSubject.id);
    formData.append("p_messages", message || "");
    formData.append("p_replyid", replyToMessage?.id || "");

    if (attachedFile) formData.append("file", attachedFile);

    await axios.post(
      "/chat/support/user-admin/send-message",
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // 2️⃣ Fetch latest messages
    const resp = await axios.get(
      `/chat/support/user-admin/open-chat/${activeSubject.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { p_limit: 200, p_offset: 0 },
      }
    );

    const records = resp.data?.data?.records || [];

    // 3️⃣ Sort messages
    const sorted = records.sort(
      (a, b) => new Date(a.createddate) - new Date(b.createddate)
    );

    // 4️⃣ Format messages
    const formatted = sorted.map((m) => {
      let filetype = null;

      if (m.filepath) {
        const ext = m.filepath.split(".").pop().toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) filetype = "image";
        else if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) filetype = "video";
        else filetype = "file";
      }

      const isSystemMsg = m.message?.includes(
        "Your support request has been submitted. Our team will review it shortly."
      );

      return {
        id: m.usersupportticketmessagesid,
        replyId: m.replyid || null,
        message: m.message,
        filepath: m.filepath || null,
        filetype,
        sender: isSystemMsg ? "admin" : (m.roleid === 4 ? "admin" : "user"),
        time: m.createddate,
      };
    });

    // 5️⃣ Update UI
    setMessages(formatted);

    // 6️⃣ Reset input
    setMessage("");
    setAttachedFile(null);
    setAttachedPreview(null);
    setReplyToMessage(null);

  } catch (err) {
    console.error("Send message error", err);
    toast.error("Message not sent");
  }
};

  const handleKeyPress = (e) => {
    if (!isMobile && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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

  const handleClose = async () => {
    if (!activeSubject) return;
    try {
    const res = await axios.post(
      "/chat/support/ticket/create-or-update-status",
      {
        p_usersupportticketid: activeSubject.id,
        p_objectiveid: null,
        p_statusname: "Closed",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const successMessage =
      res?.data?.message ||
      res?.data?.p_message ||
      "Ticket closed successfully";

    toast.success(successMessage);

    setIsClosed(true);

    if (onCloseSuccess) onCloseSuccess();

    setMessages([]);
    setMessage("");
  } catch (err) {
    console.error("Error closing ticket:", err);

    const errorMessage =
      err?.response?.data?.message ||
      "Failed to close ticket";

    toast.error(errorMessage);
  }
};
useEffect(() => {
  const status = activeSubject?.status?.toLowerCase();
  setIsClosed(status === "open" || status === "closed");
  setShowCloseButton(status !== "closed");
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

const loadMessages = async (offsetParam = offset) => {
  if (!activeSubject?.id) return;
if (offsetParam !== 0 && (loadingMore || !hasMore)) return;
  setLoadingMore(true);

  try {
    const res = await axios.get(
      `/chat/support/user-admin/open-chat/${activeSubject.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          p_limit: 100,
          p_offset: offsetParam + 1,
        },
      }
    );

    const data = res.data?.data || {};
    const newRecords = data.records || [];

    if (newRecords.length < 100) {
      setHasMore(false);
    }

    const sorted = newRecords.sort(
      (a, b) => new Date(a.createddate) - new Date(b.createddate)
    );

    const formatted = sorted.map((m) => {
      let isSystemMsg =
        m.message?.includes("Your support request has been submitted. Our team will review it shortly.");

      let filetype = null;
      if (m.filepath) {
        const ext = m.filepath.split(".").pop().toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) filetype = "image";
        else if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) filetype = "video";
        else filetype = "file";
      }

      return {
        id: m.usersupportticketmessagesid,
        replyId: m.replyid || null,
        message: m.message,
        filepath: m.filepath || null,
        filetype,
        sender: isSystemMsg ? "admin" : (m.userid == userId ? "user" : "admin"),
        time: m.createddate,
      };
    });

   if (offset === 0) {
  setMessages(formatted);
  setTimeout(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, 50);
}
 else {
      setMessages((prev) => [...formatted, ...prev]);
    }

    setOffset((prev) => prev + 1);
  } finally {
    setLoadingMore(false);
  }
};
const scrollToBottom = () => {
  setTimeout(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, 80);
};
useEffect(() => {
  if (messages.length > 0) scrollToBottom();
}, [messages]);

useEffect(() => {
  if (!activeSubject?.id) return;

  setMessages([]);
  setOffset(0);
  setHasMore(true);
  loadMessages(0);
}, [activeSubject]);

  return (
    <div className="flex flex-col h-full relative overflow-hidden rounded-md">
      {!activeSubject && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-[28%] w-full flex flex-col items-center text-center px-6 z-0"
        >
          <div className="mb-4 flex items-center justify-center">
            <RiMessage3Line className="w-15 h-15 text-gray-700" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Start a conversation
          </h2>

          <p className="text-gray-500 max-w-lg mt-2 leading-relaxed">
            Select a subject from the left panel to begin chatting.
            <br />
            Once selected, you can send messages, images, emojis, and files.
          </p>
        </motion.div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      {activeSubject && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex flex-col h-full"
        >
          <div className="p-4 flex justify-between items-center border-b border-gray-500">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100"
                >
                  <RiArrowLeftLine className="w-5 h-5 text-gray-700" />
                </button>
              )}

              <h1 className="text-lg sm:text-2xl font-bold text-[#0D132D]">
                {activeSubject.name}
              </h1>
            </div>

            {showCloseButton ? (
              <button
                onClick={handleClose}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-gray-200 text-gray-800 border border-gray-300 hover:bg-gray-300"
              >
                Close
              </button>
            ) : (
              <span className="px-3 py-1.5 rounded-full text-sm bg-red-600 text-white border border-red-600">
                Closed
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 p-4 pb-28"
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
              const repliedMsg =
                msg.replyData ||
                (msg.replyId
                  ? messages.find((m) => m.id === msg.replyId)
                  : null);

              return (
                <motion.div
                  key={msg.id}
                  id={msg.id}
                  onMouseEnter={() => setHoveredMsgId(msg.id)}
                  onMouseLeave={() => setHoveredMsgId(null)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                   className={`relative flex transition-all duration-300 ${
                              msg.sender === "user" ? "justify-end" : "justify-start"
                            } ${highlightMsgId === msg.id ? "bg-blue-100 rounded-xl p-1" : ""}`}
                          >
                  <div className="flex flex-col max-w-[78%] sm:max-w-[65%]">
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-md text-sm break-words whitespace-pre-wrap ${
                        msg.sender === "user" ? "bg-[#0D132D] text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {/* reply preview */}
                      {repliedMsg && (
                        <div
                          onClick={() => {
                            const el = document.getElementById(repliedMsg.id);
                            if (el) {
                              el.scrollIntoView({ behavior: "smooth", block: "center" });
                              setHighlightMsgId(repliedMsg.id);
                              setTimeout(() => setHighlightMsgId(null), 1200);
                            }
                          }}
                          className={`mb-2 p-2 rounded-md border-l-4 cursor-pointer flex items-center justify-between gap-2
                            ${msg.sender === "user"
                              ? "bg-white/20 border-blue-400 text-blue-100"
                              : "bg-gray-200 border-blue-500 text-gray-700"
                            }`}
                        >
                          {/* LEFT → text */}
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-xs font-semibold">
                              {repliedMsg.sender === msg.sender ? "You" : "Replied"}
                            </span>

                            <span className="text-xs truncate">
                              {repliedMsg.message
                                ? repliedMsg.message
                                : repliedMsg.filetype === "image"
                                ? "📷 Photo"
                                : repliedMsg.filetype === "video"
                                ? "🎬 Video"
                                : repliedMsg.filetype === "file"
                                ? "📎 File"
                                : ""}
                            </span>
                          </div>

                          {/* RIGHT → thumbnail */}
                          {repliedMsg.filetype === "image" && (
                            <img
                              src={repliedMsg.filepath}
                              className="w-11 h-11 rounded-md object-cover flex-shrink-0"
                              alt=""
                              onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                            />
                          )}

                          {repliedMsg.filetype === "video" && (
                            <div className="w-11 h-11 bg-black/40 rounded-md flex items-center justify-center text-white text-xs flex-shrink-0">
                              🎬
                            </div>
                          )}

                          {repliedMsg.filetype === "file" && (
                            <div className="w-11 h-11 bg-gray-300 rounded-md flex items-center justify-center text-xs flex-shrink-0">
                              📎
                            </div>
                          )}
                        </div>
                      )}


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
                            msg.sender === "user" ? "right-0" : "left-0"
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
                          onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
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
                          className="flex items-center gap-2 text-blue-400 px-3 mt-2 cursor-pointer"
                          onClick={() => window.open(msg.filepath, "_blank")}
                        >
                          <span className="underline font-medium truncate">
                            {msg.filepath.split("/").pop()}
                          </span>
                        </div>
                      )}

                      {msg.message && (
                        <p className="mt-1 whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>
                      )}
                    </div>

                    {/* Message time */}
                    <p
                      className={`text-[10px] mt-1 ${
                        msg.sender === "user" ? "text-gray-500 self-end" : "text-gray-500 self-start"
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
        animate={{
          marginTop: activeSubject ? "0px" : "50vh",
        }}
        transition={{
          type: "spring",
          stiffness: 45,
          damping: 12,
          mass: 1.5,
        }}
        className="px-6 sticky bottom-0 w-full bg-white border-t border-gray-300"
      >
        {replyToMessage && (
          <div className="mb-2 p-2 rounded-md border-l-4 border-blue-600 bg-gray-200 flex items-center justify-between gap-3">
            
            {/* LEFT → TEXT */}
            <div className="flex flex-col flex-1 min-w-0 text-xs text-gray-700">
              <span className="font-semibold">Replying to:</span>

              <span className="truncate font-medium">
                {replyToMessage.message
                  ? replyToMessage.message
                  : replyToMessage.filetype === "image"
                  ? "📷 Photo"
                  : replyToMessage.filetype === "video"
                  ? "🎬 Video"
                  : replyToMessage.filetype === "file"
                  ? "📎 " + replyToMessage.filepath?.split("/").pop()
                  : ""}
              </span>
            </div>

            {/* RIGHT → THUMBNAIL */}
            {replyToMessage.filetype === "image" && (
              <img
                src={replyToMessage.filepath}
                className="w-12 h-12 rounded-md object-cover"
                alt=""
                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
              />
            )}

            {replyToMessage.filetype === "video" && (
              <div className="w-12 h-12 bg-black/40 rounded-md flex items-center justify-center text-white text-xs">
                🎬
              </div>
            )}

            {replyToMessage.filetype === "file" && (
              <div className="w-12 h-12 bg-gray-300 rounded-md flex items-center justify-center text-xs">
                📎
              </div>
            )}

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
                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
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
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`flex items-center gap-2 sm:gap-3
            bg-gray-300 rounded-full
            px-2 sm:px-4 py-2
            my-2 sm:my-3
            shadow-lg relative
            ${!activeSubject ? "opacity-60" : "opacity-100"}
          `}
        >
          <textarea
            disabled={
              !activeSubject ||
              activeSubject.status?.toLowerCase() === "open" ||
              activeSubject.status?.toLowerCase() === "closed"
            }
            placeholder="Type your message..."
            value={message}
            onKeyDown={handleKeyPress}
            onChange={(e) => setMessage(e.target.value)}
            rows={1}
            className="flex-1 bg-transparent outline-none resize-none py-2 min-h-[40px] text-gray-600 text-sm sm:text-base rounded-full px-4 leading-normal max-h-20 overflow-y-auto no-scrollbar"
          />

          {/* Icons */}
          <div className="flex items-center gap-2 sm:gap-3 text-gray-600 shrink-0">
            <RiEmojiStickerLine
              className={`text-lg sm:text-xl ${isMobile && 
                !activeSubject || isClosed ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => {
                if (!activeSubject || isClosed) return;
                setShowEmojiPicker(!showEmojiPicker);
              }}
            />

            <RiImageLine
              className={`text-lg sm:text-xl ${isMobile && 
                !activeSubject || isClosed ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => {
                if (!activeSubject || isClosed) return;
                imageInputRef.current.click();
              }}
            />

            <RiAttachment2
              className={`text-lg sm:text-xl ${isMobile && 
                !activeSubject || isClosed ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => {
                if (!activeSubject || isClosed) return;
                fileInputRef.current.click();
              }}
            />
          </div>

          {/* Send button */}
          <motion.button
            disabled={!activeSubject || isClosed}
            onClick={handleSend}
            className={`bg-[#0D132D] text-white p-2 sm:p-2.5 rounded-full shadow-md transition
              ${isClosed ? "opacity-40 cursor-not-allowed" : "hover:bg-[#1B2448] cursor-pointer"}
            `}
          >
            <RiSendPlaneFill className="text-lg sm:text-xl" />
          </motion.button>
        </motion.div>
      </motion.div>
      {/* emoji picker */}
      {showEmojiPicker && (
        <motion.div
          className="absolute bottom-28 right-2 sm:right-10"
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
            onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
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

export default VendorChatWindow;
