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
  setActiveConversation,
} from "../../features/socket/chatSlice";

export default function ChatAppPageUser() {
  useSocketRegister();
  const dispatch = useDispatch();
  const { token, role, userId } = useSelector((state) => state.auth);
  const roleId = Number(role);
  const socket = getSocket();


  const activeChat = useSelector((state) => state.chat.activeChat);
  const [selectedReplyMessage, setSelectedReplyMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isRecipientOnline, setIsRecipientOnline] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const conversationId = activeChat?.conversationid || activeChat?.id;

  // Emit via socket
  const showChatUI = activeChat && socket;

  /* 🧹 Unescape escaped HTML */
  const unescapeHtml = (str) => {
    if (!str) return "";
    str = str.replace(/\\\\/g, "\\");
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\'/g, "'");
    str = str.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
    return str;
  };

  useEffect(() => {
    console.log("user refresh")
    if (!socket || !conversationId) return;

    console.log("👥 joinRoom:", conversationId);
    socket.emit("joinRoom", String(conversationId));

    return () => {
      socket.emit("leaveRoom", String(conversationId));
    };
  }, [socket, conversationId]);

  const fetchMessages = async () => {
    if (!conversationId || !token) return;

    try {
      const res = await axios.get("/chat/messages", {
        params: {
          p_conversationid: conversationId,
          p_roleid: roleId,
          p_limit: 50,
          p_offset: 0,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const records = res?.data?.data?.records || [];

      const formatted = records
        .map((msg) => {
          const raw = (msg.message || "").replace(/^"|"$/g, "");
          const unescaped = unescapeHtml(raw);
          const isHtml = /<\/?[a-z][\s\S]*>/i.test(unescaped);

          return {
            id: Number(msg.messageid),
            roleId: Number(msg.roleid),
            content: unescaped,
            time: msg.createddate,
            deleted: msg.isdeleted ?? false,
            ishtml: isHtml,
            readbyvendor: msg.readbyvendor ?? false,
            readbyinfluencer: msg.readbyinfluencer ?? false,
            replyId: msg.replyid ?? null,
            file: msg.filepath
              ? Array.isArray(msg.filepath)
                ? msg.filepath
                : [msg.filepath]
              : [],
          };
        })
        .sort((a, b) => new Date(a.time) - new Date(b.time));

      dispatch(setMessages(formatted));
    } catch (err) {
      console.error("❌ Failed to fetch messages", err);
    }
  };

  const handleSendMessage = async ({
    text,
    file = null,
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
          readbyvendor: roleId === 2 ? true : false,
          readbyinfluencer: roleId === 1 ? true : false,
          status: "pending",
          isTemp: true,
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
      if (file) {
        formData.append("file", file);
      }


      const res = await axios.post("/chat/insertmessage", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });



      const realId = res.data?.messageid;
      console.log(res.data.messageid)

      // 🔄 Update Redux with real DB ID
      dispatch(
        updateMessage({
          tempId,
          newId: Number(realId),
        })
      );

      const receiverId =
        Number(roleId) === 1
          ? Number(activeChat.vendorId || activeChat.vendorid)
          : Number(activeChat.influencerId || activeChat.influencerid);

      console.log("🎯 SOCKET SEND:", { receiverId });

      socket.emit("sendMessage", {
        conversationid: Number(conversationId),
        userid: Number(userId),
        roleid: Number(roleId),
        receiverId,
        message: text,
        messageid: Number(realId),
        tempId,
        replyid: replyId || null,
        readbyinfluencer: Number(roleId) === 1,
        readbyvendor: Number(roleId) === 2,
        createddate: new Date().toISOString(),
      });

      // setShouldRefresh(true);
      setEditingMessage(null);
    } catch (err) {
      console.error("❌ Message send/edit failed", err);
    }
  };

  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleReceiveMessage = (msg) => {
      console.log("New MSG Recived", msg)
      if (String(msg.conversationid) !== String(conversationId)) return;

      if (Number(msg.userid) === Number(userId)) {
        // dispatch(updateMessage({
        //   tempId: msg.tempId,
        //   newId: msg.messageid,
        // }));
        return;
      }
      dispatch(addMessage({
        id: msg.messageid || msg.tempId,
        roleId: Number(msg.roleid),
        content: msg.message,
        time: msg.createddate,
        deleted: false,
        file: msg.filepaths || [],
        replyId: msg.replyid ?? null,
        readbyinfluencer: msg.readbyinfluencer || false,
        readbyvendor: msg.readbyvendor || false
      }));
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [socket, conversationId]);

  useEffect(() => {
    if (!shouldRefresh) return;

    fetchMessages();
    setShouldRefresh(false);
  }, [shouldRefresh]);

  useEffect(() => {
    if (!activeChat) return;

    dispatch(setMessages([]));
    fetchMessages();
  }, [activeChat]);

  return (
    <div className="h-[80vh] flex overflow-hidden">
      {/* ================= Sidebar ================= */}
      {roleId === 1 && (
        <div
          className={`md:w-1/4 w-full h-full border-gray-200 flex-shrink-0 me-2 ${activeChat ? "hidden md:block" : "block"
            }`}
        >
          <Sidebar
            onSelectChat={(chat) => {
              dispatch(setActiveChat(chat));
              dispatch(setActiveConversation(chat.conversationid || chat.id));
            }}
            activeConversationId={conversationId}
          />
        </div>
      )}

      {roleId === 2 && (
        <div
          className={`md:w-1/2 w-full h-full border-gray-200 flex-shrink-0 me-2 ${activeChat ? "hidden md:block" : "block"
            }`}
        >
          <SidebarVendor
            onSelectChat={(chat) => {
              dispatch(setActiveChat(chat));
              dispatch(setActiveConversation(chat.conversationid || chat.id));
            }}
            activeConversationId={conversationId}
          />
        </div>
      )}

      {/* ================= Main Chat Area ================= */}
      {showChatUI && (
        <div
          className={`flex-1 h-full flex flex-col ${activeChat ? "flex" : "hidden md:flex"
            }`}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white rounded-2xl border-b border-gray-200">
            <ChatHeader
              chat={activeChat}
              onOnlineStatusChange={setIsRecipientOnline}
              onBack={() => {
                dispatch(setActiveChat(null));
                dispatch(setActiveConversation(null));
              }}
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
