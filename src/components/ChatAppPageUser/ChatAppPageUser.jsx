import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Sidebar from "./Sidebar";
import SidebarVendor from "./SidebarVendor";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

import useSocketRegister from "../../sockets/useSocketRegister";

import { getSocket } from "../../sockets/socket"; // Already connected globally
import {
  addMessage,
  updateMessage,
  setActiveChat,
} from "../../features/socket/chatSlice";

export default function ChatAppPageUser() {
  useSocketRegister();
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.auth);
  const roleId = Number(role);
  const socket = getSocket();

  const activeChat = useSelector((state) => state.chat.activeChat);
  const [selectedReplyMessage, setSelectedReplyMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isRecipientOnline, setIsRecipientOnline] = useState(false);
  const [showChatUI, setShowChatUI] = useState(true);

  // 👥 Join/leave chat room when activeChat changes
  useEffect(() => {
    if (!socket || !activeChat?.id) return;

    socket.emit("joinRoom", activeChat.id);
    return () => {
      socket.emit("leaveRoom", activeChat.id);
    };
  }, [activeChat?.id]);

  return (
    <div className="h-[80vh] flex overflow-hidden">
      {/* ================= Sidebar ================= */}
      {roleId === 1 && (
        <div
          className={`md:w-1/4 w-full h-full border-gray-200 flex-shrink-0 me-2 ${
            activeChat ? "hidden md:block" : "block"
          }`}
        >
          <Sidebar onSelectChat={(chat) => dispatch(setActiveChat(chat))} />
        </div>
      )}

      {roleId === 2 && (
        <div
          className={`md:w-1/2 w-full h-full border-gray-200 flex-shrink-0 me-2 ${
            activeChat ? "hidden md:block" : "block"
          }`}
        >
          <SidebarVendor
            onSelectChat={(chat) => dispatch(setActiveChat(chat))}
          />
        </div>
      )}

      {/* ================= Main Chat Area ================= */}
      {showChatUI && (
        <div
          className={`flex-1 h-full flex flex-col ${
            activeChat ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white rounded-2xl border-b border-gray-200">
            <ChatHeader
              chat={activeChat}
              onOnlineStatusChange={setIsRecipientOnline}
              onBack={() => dispatch(setActiveChat(null))}
            />
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto bg-white p-0"
            style={{
              backgroundImage:
                'url("https://www.transparenttextures.com/patterns/food.png")',
              backgroundRepeat: "repeat",
              backgroundSize: "auto",
              backgroundPosition: "center",
              backgroundBlendMode: "luminosity",
              opacity: 0.9,
            }}
          >
            <ChatMessages chat={activeChat} />
          </div>

          {/* Input */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100">
            <ChatInput
              canstartchat={activeChat?.canstartchat}
            //   onSend={(data) =>
            //     editingMessage
            //       ? handleEditMessage({
            //           ...editingMessage,
            //           ...data,
            //           replyId: selectedReplyMessage?.id,
            //         })
            //       : handleSendMessage({
            //           ...data,
            //           replyId: selectedReplyMessage?.id,
            //         })
            //   }
              replyTo={selectedReplyMessage}
              onCancelReply={() => setSelectedReplyMessage(null)}
              editingMessage={editingMessage}
            //   onEditComplete={handleEditMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
