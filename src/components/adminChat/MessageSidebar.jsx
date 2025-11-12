import React from "react";
import { RiAddLine } from "@remixicon/react";

const MessageSidebar = ({ subjects, activeChat, setActiveChat, openModal }) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          Conversations
        </h2>
        <button
          onClick={openModal}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0D132D] text-white hover:bg-gray-800 transition"
        >
          <RiAddLine className="w-4 h-4" />
        </button>
      </div>

      {/* ===== CONVERSATION LIST ===== */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {subjects.map((chat) => {
          const isActive = activeChat?.id === chat.id;

          return (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`flex items-center justify-between gap-3 px-5 py-3 cursor-pointer border-b border-gray-100 transition-all ${
                isActive
                  ? "bg-[#0D132D] text-white"
                  : "hover:bg-gray-50 text-gray-800"
              }`}
            >
              {/* Avatar + Name + Message */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="min-w-0 flex flex-col">
                  <p
                    className={`font-medium text-[14px] truncate ${
                      isActive ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {chat.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageSidebar;
