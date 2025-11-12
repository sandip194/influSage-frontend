import React, { useState } from "react";
import {
  RiImageLine,
  RiSendPlane2Line,
  RiSettings3Line,
  RiMore2Fill,
} from "@remixicon/react";

const MessageChat = ({ activeChat }) => {
  const [messages, setMessages] = useState([
    { from: "admin", text: "Hi! How are you?", time: "12:25 PM" },
    { from: "influencer", text: "Nice to meet you. Let's talk about the project", time: "12:26 PM" },
    {
      from: "admin",
      text: "Here’s the screenshot attached for it",
      image: "https://images.unsplash.com/photo-1581092795360-f62f53f7edb3?w=300",
      time: "12:29 PM",
    },
    { from: "influencer", text: "Thanks for sharing the details", time: "12:32 PM" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { from: "influencer", text: newMessage, time: "12:35 PM" }]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white border-b">
        <div className="flex items-center gap-3">
          <img
            src={`https://ui-avatars.com/api/?name=${activeChat.title}`}
            alt={activeChat.title}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-800">{activeChat.title}</h3>
            <p className="text-xs text-gray-400">Last Seen: 4 mins ago</p>
          </div>
        </div>
        <div className="flex gap-3 text-gray-500">
          <RiSettings3Line className="w-5 h-5 cursor-pointer hover:text-[#0D132D]" />
          <RiMore2Fill className="w-5 h-5 cursor-pointer hover:text-[#0D132D]" />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F9FAFB]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.from === "influencer" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl ${
                msg.from === "influencer"
                  ? "bg-[#0D132D] text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt=""
                  className="w-48 h-32 object-cover rounded-lg mb-2"
                />
              )}
              <p className="text-sm">{msg.text}</p>
              <p className="text-[10px] text-gray-400 mt-1 text-right">
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="px-6 py-3 bg-white border-t flex items-center gap-3">
        <RiImageLine className="text-gray-500 w-5 h-5 cursor-pointer hover:text-[#0D132D]" />
        <input
          type="text"
          placeholder="Write your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="bg-[#0D132D] text-white p-2 rounded-full hover:bg-gray-800"
        >
          <RiSendPlane2Line className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageChat;
