import React, { useState, useRef } from "react";
import {
  RiEmojiStickerLine,
  RiAttachment2,
  RiImageLine,
  RiSendPlaneFill,
  RiMessage3Line
} from "@remixicon/react";
import EmojiPicker from "emoji-picker-react";
import { motion } from "framer-motion";

const AdminChatWindow = ({ activeSubject }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!activeSubject) return;
    if (!message.trim()) return;

    const newMsg = { type: "text", content: message, sender: "user" };
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    setMessages((prev) => [...prev, { type: "image", content: imgURL, sender: "user" }]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessages((prev) => [
      ...prev,
      { type: "file", content: file.name, sender: "user" },
    ]);
  };

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
            Select a subject from the left panel to begin chatting.<br />
            Once selected, you can send messages, images, emojis, and files.
          </p>
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
        className={`px-6 ${activeSubject ? "absolute bottom-4 w-full" : "w-full"}`}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className={`flex items-center bg-gray-300 rounded-full px-4 my-4 py-2 shadow-lg relative
          ${!activeSubject ? "opacity-60" : "opacity-100"}`}
        >
          {/* Input */}
          <input
            type="text"
            disabled={!activeSubject}
            placeholder={
              activeSubject ? "Type your message..." : "Select a subject to start chat..."
            }
            value={message}
            onKeyDown={handleKeyPress}
            onChange={(e) => setMessage(e.target.value)}
            className={`flex-1 bg-transparent outline-none text-gray-700 text-sm
              ${!activeSubject ? "cursor-not-allowed select-none" : ""}`}
          />

          {/* Icons */}
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

          {/* Send Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={!activeSubject}
            onClick={handleSend}
            className={`ml-3 bg-[#0D132D] text-white p-2 rounded-full shadow-md transition 
            ${!activeSubject ? "opacity-40 cursor-not-allowed" : "hover:bg-[#1B2448] cursor-pointer"}`}
          >
            <RiSendPlaneFill className="text-lg" />
          </motion.button>
        </motion.div>
      </motion.div>

      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={imageInputRef}
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
          <div className="p-4 flex justify-between items-center border-b border-gray-500 ">
            <h1 className="text-2xl font-bold text-[#0D132D]">{activeSubject}</h1>
            <button
              className="flex items-center gap-2 border border-gray-300 bg-gray-200 px-3 py-1.5 rounded-full text-sm"
            >
              Resolve
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`px-4 py-2 rounded-2xl max-w-[65%] shadow-md text-sm 
                  ${msg.sender === "user" ? "bg-[#0D132D] text-white" : "bg-gray-100 text-gray-900"}`}
                >
                  {/* Render message type */}
                  {msg.type === "text" && msg.content}
                  {msg.type === "image" && (
                    <img src={msg.content} className="max-w-[180px] rounded-lg" />
                  )}
                  {msg.type === "file" && (
                    <span className="underline">📄 {msg.content}</span>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {showEmojiPicker && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-24 right-10 z-40"
        >
          <EmojiPicker onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)} />
        </motion.div>
      )}
    </div>
  );
};

export default AdminChatWindow;
