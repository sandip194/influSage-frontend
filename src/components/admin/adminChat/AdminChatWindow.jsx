import React, { useState, useRef, useEffect } from "react";
import {
  RiEmojiStickerLine,
  RiAttachment2,
  RiImageLine,
  RiSendPlaneFill,
  RiMessage3Line
} from "@remixicon/react";
import EmojiPicker from "emoji-picker-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AdminChatWindow = ({ activeSubject }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [isResolved, setIsResolved] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!activeSubject || !message.trim()) return;
    const newMsg = { type: "text", content: message, sender: "user" };
    setMessage("");
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleKeyPress = (e) => e.key === "Enter" && handleSend();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imgURL = URL.createObjectURL(file);
    setMessages((prev) => [...prev, { type: "image", content: imgURL, sender: "user" }]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMessages((prev) => [...prev, { type: "file", content: file.name, sender: "user" }]);
  };

  const handleResolve = async () => {
    if (!activeSubject || isResolved) return;
    try {
      setIsResolved(true);
      await axios.post(
        "/chat/support/ticket/create-or-update-status",
        { p_usersupportticketid: activeSubject.id, p_objectiveid: null, p_statusname: "Resolved" },
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

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeSubject?.id) return;

      try {
        const res = await axios.get(
          `/chat/support/user-admin/open-chat/${activeSubject.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              p_limit: 200,
              p_offset: 0,
            },
          }
        );

        const data = res.data?.data || {};

      const sorted = (data.records || []).sort(
        (a, b) => new Date(a.createddate) - new Date(b.createddate)
      );

       setMessages(
        sorted.map((m) => {
          let filetype = null;
          if (m.filepath) {
            const ext = m.filepath.split(".").pop().toLowerCase();
            if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) filetype = "image";
            else if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) filetype = "video";
            else filetype = "file";
          }

          return {
            message: m.message,
            filepath: m.filepath || null,
            filetype,
            sender: m.senderrole?.toLowerCase() === "admin" ? "admin" : "user",
            time: m.createddate,
          };
        })
      );
      } catch (err) {
        console.error("Error fetching chat messages:", err);
      }
    };

    fetchMessages();
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
          <h2 className="text-2xl font-bold text-gray-800">Start a conversation</h2>
          <p className="text-gray-500 max-w-lg mt-2 leading-relaxed">
            Select a subject from the left panel to begin chatting.
            <br />You can send messages, images, emojis, and files.
          </p>
        </motion.div>
      )}

      <motion.div
        initial={false}
        animate={{ marginTop: activeSubject ? "0px" : "50vh" }}
        transition={{ type: "spring", stiffness: 45, damping: 12 }}
        className={`px-6 ${activeSubject ? "absolute bottom-0 w-full" : "w-full"}`}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`flex items-center bg-gray-300 rounded-full px-4 my-4 py-2 shadow-lg ${!activeSubject && "opacity-60"}`}
        >
          <input
            type="text"
            placeholder={activeSubject ? "Type your message..." : "Select a subject to start chat..."}
            disabled={!activeSubject}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
          />

          <div className="flex items-center gap-3 text-gray-600">
            <RiEmojiStickerLine
              className={`text-xl ${activeSubject ? "cursor-pointer" : "opacity-40"}`}
              onClick={() => activeSubject && setShowEmojiPicker(!showEmojiPicker)}
            />
            <RiImageLine
              className={`text-xl ${activeSubject ? "cursor-pointer" : "opacity-40"}`}
              onClick={() => activeSubject && imageInputRef.current.click()}
            />
            <RiAttachment2
              className={`text-xl ${activeSubject ? "cursor-pointer" : "opacity-40"}`}
              onClick={() => activeSubject && fileInputRef.current.click()}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={!activeSubject}
            onClick={handleSend}
            className={`ml-3 bg-[#0D132D] text-white p-2 rounded-full shadow-md ${
              !activeSubject ? "opacity-40 cursor-not-allowed" : "hover:bg-[#1B2448]"
            }`}
          >
            <RiSendPlaneFill className="text-lg" />
          </motion.button>
        </motion.div>
      </motion.div>

      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />

      {/* messages */}
      {activeSubject && (
        <motion.div className="flex flex-col h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="p-4 flex justify-between items-center border-b border-gray-500">
            <h1 className="text-2xl font-bold text-[#0D132D]">{activeSubject?.name}</h1>
            <button
              onClick={handleResolve}
              disabled={isResolved}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                isResolved ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {isResolved ? "Resolved" : "Resolve"}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 p-4 pb-28">
            {messages.map((msg, idx) => (
              <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[65%] shadow-md text-sm break-words whitespace-pre-wrap ${
                    msg.sender === "user" ? "bg-[#0D132D] text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {/* text */}
                  {!msg.filepath && msg.message && <span>{msg.message}</span>}

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
                      <span className="underline font-medium truncate">{msg.filepath.split("/").pop()}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* emoji picker */}
      {showEmojiPicker && (
        <motion.div className="absolute bottom-24 right-10 z-40" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <EmojiPicker onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)} />
        </motion.div>
      )}

      {/* fullscreen image preview */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setPreviewImage(null)}>
          <button className="absolute top-6 right-8 text-white text-3xl font-bold hover:text-gray-300">×</button>
          <img
            src={previewImage}
            className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* fullscreen video preview */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setPreviewVideo(null)}>
          <button className="absolute top-6 right-8 text-white text-3xl font-bold hover:text-gray-300">×</button>
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
