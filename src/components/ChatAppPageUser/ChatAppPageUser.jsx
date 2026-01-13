import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Sidebar from "./Sidebar";
import SidebarVendor from "./SidebarVendor";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

import useSocketRegister from "../../sockets/useSocketRegister";

import { getSocket } from "../../sockets/socket";
import {
  addMessage,
  updateMessage,
  setActiveChat,
  setMessages,
} from "../../features/socket/chatSlice";

export default function ChatAppPageUser() {
  useSocketRegister();
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.auth);
  const roleId = Number(role);
  const socket = getSocket();
  const messages = useSelector((state) => state.chat.messages);

  const activeChat = useSelector((state) => state.chat.activeChat);
  const [selectedReplyMessage, setSelectedReplyMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isRecipientOnline, setIsRecipientOnline] = useState(false);
  const conversationId = activeChat?.conversationid || activeChat?.id;

  // Emit via socket
  const showChatUI = activeChat && socket;

  useEffect(() => {
    if (!socket || !conversationId) return;

    console.log("👥 joinRoom:", conversationId);
    socket.emit("joinRoom", String(conversationId));

    return () => {
      socket.emit("leaveRoom", String(conversationId));
    };
  }, [socket, conversationId]);

  const handleSendMessage = async ({
    text,
    files = [],
    replyId = null,
    editingMessageId = null,
  }) => {
    if (!conversationId) return;

    const isEdit = Boolean(editingMessageId);
    const tempId = Date.now().toString();

    // 🔵 Optimistic UI update
    if (isEdit) {
      dispatch(
        updateMessage({
          id: editingMessageId,
          content: text,
          file: files,
          edited: true,
          isPending: true,
        })
      );
    } else {
      dispatch(
        addMessage({
          id: tempId,
          tempId,
          roleId,
          content: text,
          time: new Date().toISOString(),
          deleted: false,
          file: [],
          replyId,
        })
      );
    }

    try {
      const formData = new FormData();
      formData.append("p_conversationid", conversationId);
      formData.append("p_roleid", roleId);
      formData.append("p_messages", text);
      formData.append("p_replyid", replyId || "");
      formData.append("p_messageid", editingMessageId || ""); // 🔥 edit key
      formData.append("tempId", tempId);

      files.forEach((file) => formData.append("files", file));

      await axios.post("/chat/insertmessage", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setEditingMessage(null);
    } catch (err) {
      console.error("❌ Message send/edit failed", err);
    }
  };

  useEffect(() => {
    if (!socket) return;

   const handleReceiveMessage = (msg) => {
      if (msg.tempId) {
        const existsByTemp = messages.some(
          (m) => m.tempId === msg.tempId
        );

        if (existsByTemp) {
          dispatch(
            updateMessage({
              tempId: msg.tempId,
              newId: msg.messageid,
              content: msg.message,
              file: msg.filepaths || [],
              replyId: msg.replyid ?? null,
              isPending: false,
            })
          );
          return;
        }
      }

      const existsById = messages.some(
        (m) => String(m.id) === String(msg.messageid)
      );
      if (existsById) return;

      dispatch(
        addMessage({
          id: msg.messageid,
          tempId: msg.tempId || null,
          roleId: Number(msg.roleid),
          content: msg.message,
          time: msg.createddate,
          deleted: msg.is_deleted,
          file: msg.filepaths || [],
          replyId: msg.replyid ?? null,
          readbyvendor: msg.readbyvendor,
          readbyinfluencer: msg.readbyinfluencer,
        })
      );
    };
    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, dispatch, messages]);

  return (
    <div className="h-[80vh] flex overflow-hidden">
      {/* ================= Sidebar ================= */}
      {roleId === 1 && (
        <div
          className={`md:w-1/4 w-full h-full border-gray-200 flex-shrink-0 me-2 ${
            activeChat ? "hidden md:block" : "block"
          }`}
        >
          <Sidebar
            onSelectChat={(chat) => {
              dispatch(setActiveChat(chat));
            }}
          />
        </div>
      )}

      {roleId === 2 && (
        <div
          className={`md:w-1/2 w-full h-full border-gray-200 flex-shrink-0 me-2 ${
            activeChat ? "hidden md:block" : "block"
          }`}
        >
          <SidebarVendor
            onSelectChat={(chat) => {
              dispatch(setActiveChat(chat));
            }}
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
            <ChatMessages
              chat={activeChat}
              isRecipientOnline={isRecipientOnline}
              setReplyToMessage={setSelectedReplyMessage}
              setEditingMessage={setEditingMessage}
              editingMessage={editingMessage}
            />
          </div>

          {/* Input */}
          <ChatInput
            canstartchat={activeChat?.canstartchat}
            onSend={(data) =>
              handleSendMessage({
                ...data,
                editingMessageId: editingMessage?.id || null,
              })
            }
            replyTo={selectedReplyMessage}
            onCancelReply={() => setSelectedReplyMessage(null)}
            editingMessage={editingMessage}
          />
        </div>
      )}
    </div>
  );
}
