import React, { useState, useRef } from "react";
import {
  RiEmojiStickerLine,
  RiAttachment2,
  RiImageLine,
  RiLogoutBoxRLine,
} from "@remixicon/react";
import EmojiPicker from "emoji-picker-react";

const ChatWindow = ({ activeSubject }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleCloseConversation = () => {
    setMessages([]);
    setMessage("");
  };

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        type: "text",
        content: message,
        sender: "user",
      },
    ]);

    setMessage("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);

    setMessages([
      ...messages,
      {
        type: "image",
        content: imgURL,
        sender: "user",
      },
    ]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessages([
      ...messages,
      {
        type: "file",
        content: file.name,
        sender: "user",
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* HEADER */}
      <div className="p-6 border-b border-gray-400 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0D132D]">{activeSubject}</h1>

        <button
          onClick={handleCloseConversation}
          className="flex items-center gap-2 border border-gray-100 bg-white text-gray-700 
               px-4 py-1.5 rounded-full text-sm"
        >
          <RiLogoutBoxRLine className="text-lg" />
          Close
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto p-8 space-y-6"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-[65%]">
              {msg.type === "text" && (
                <p
                  className={`px-4 py-2 rounded-2xl text-sm shadow-md ${
                    msg.sender === "user"
                      ? "bg-[#0D132D] text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {msg.content}
                </p>
              )}

              {msg.type === "image" && (
                <img
                  src={msg.content}
                  alt="Uploaded"
                  className="max-w-[200px] rounded-xl shadow-md"
                />
              )}

              {msg.type === "file" && (
                <div
                  className={`px-4 py-2 rounded-xl text-sm shadow-md border ${
                    msg.sender === "user"
                      ? "bg-[#0D132D] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  📄 {msg.content}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showEmojiPicker && (
        <div className="absolute bottom-24 right-10 bg-white shadow-xl rounded-lg z-50">
          <EmojiPicker
            onEmojiClick={(emojiObject, event) => handleEmojiClick(emojiObject)}
          />
        </div>
      )}

      <div className="p-4 flex items-center gap-4 relative">
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          className="hidden"
          onChange={handleImageUpload}
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Input */}
        <div className="flex items-center bg-white rounded-full px-5 py-2 w-full">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="flex items-center gap-4 text-gray-500">
            <RiEmojiStickerLine
              className="text-xl cursor-pointer hover:text-gray-700"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />

            <RiImageLine
              className="text-xl cursor-pointer hover:text-gray-700"
              onClick={() => imageInputRef.current.click()}
            />

            <RiAttachment2
              className="text-xl cursor-pointer hover:text-gray-700"
              onClick={() => fileInputRef.current.click()}
            />
          </div>
        </div>

        <button
          onClick={handleSend}
          className="bg-[#0D132D] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#131A3A] transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
