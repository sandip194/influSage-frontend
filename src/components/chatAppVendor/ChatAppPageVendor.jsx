import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Sidebar from "./SidebarVendor";
import ChatHeaderVendor from "./ChatHeaderVendor";
import ChatMessages from "./ChatMessagesVendor";
import ChatInput from "./ChatInputVendor";
import { useLocation } from "react-router-dom";

import { getSocket } from "../../sockets/socket"; // Already connected globally
import {
  addMessage,
  updateMessage,
  setActiveChat,
} from "../../features/socket/chatSlice";

export default function ChatAppPageVendor() {
  const dispatch = useDispatch();
  const { token, id: userId, role } = useSelector((state) => state.auth);
  const socket = getSocket();
  const location = useLocation();
  const [chatToSelect, setChatToSelect] = useState(null);

  const activeChat = useSelector((state) => state.chat.activeChat);
  const messages = useSelector((state) => state.chat.messages);
  const [editingMessage, setEditingMessage] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // key to trigger message reload
  const [isRecipientOnline, setIsRecipientOnline] = useState(false);

  const showChatUI = activeChat && socket;
  const [selectedReplyMessage, setSelectedReplyMessage] = useState(null);

  const joinedRoomRef = useRef(null);

  useEffect(() => {
    if (!socket || !activeChat?.conversationid) return;

    if (joinedRoomRef.current !== activeChat.conversationid) {
      socket.emit("joinRoom", activeChat.conversationid);
      joinedRoomRef.current = activeChat.conversationid;
    }

    return () => {
      if (joinedRoomRef.current) {
        socket.emit("leaveRoom", joinedRoomRef.current);
        joinedRoomRef.current = null;
      }
    };
  }, [activeChat?.conversationid, socket]);


  // 📥 Receive messages
  useEffect(() => {
    if (!socket) return;

   const handleReceiveMessage = (msg) => {
    if (Number(msg.userid) === Number(userId)) {
      return;
    }

    const normalized = {
      id: msg.messageid || msg.id,
      senderId: msg.userid,
      roleId: Number(msg.roleid),
      content: msg.message,
      file: msg.filepaths?.[0] || "",
      replyId: msg.replyid || null,
      time: msg.time || new Date().toISOString(),
    };

    dispatch(addMessage(normalized));
  };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, dispatch]);

  // ✉️ Send message
  const handleSendMessage = async ({ text, file, replyId }) => {
    // console.log("📨 Sending message with replyId:", replyId); 
    if (!activeChat) return;
    // console.log("Active Chat:", activeChat);

    const tempMsg = {
      id: Date.now(),
      senderId: userId,     // ✅ Correct user ID
      roleId: role,         // ✅ Must include this!
      content: text,
      conversationId: activeChat.conversationid,
      file: file || null,
      replyId: replyId || null,
      status: "sending",
      time: new Date().toISOString(),
    };


    dispatch(addMessage(tempMsg));
    socket?.emit("sendMessage", tempMsg);

    try {
      const formData = new FormData();
      formData.append("p_conversationid", activeChat.conversationid);
      formData.append("p_roleid", role);
      formData.append("p_messages", text);
      formData.append("campaignid", activeChat.campaignId);
      formData.append("campaignName", activeChat.campaignName);
      formData.append("influencerId", activeChat.influencerid);
      const firstName = activeChat.name?.split(" ")[0]?.trim() || activeChat.name || "";
      formData.append("influencerName", firstName);
      if (file) formData.append("file", file);
      if (replyId) formData.append("p_replyid", replyId);

      const res = await axios.post(`/chat/insertmessage`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.p_status) {
        dispatch(
          updateMessage({
            tempId: tempMsg.id,
            newId: res.data.message_id,
            fileUrl: res.data.filepath || null,
          })
        );
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Sending failed", err);
    }
  };

  const handleEditMessage = async ({ id, content, file, replyId }) => {
    if (!activeChat?.conversationid || !id) {
      console.error("Missing conversation id or message id", { activeChat, id });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("p_conversationid", activeChat.conversationid);
      formData.append("p_roleid", role);
      formData.append("p_messages", content);
      formData.append("p_messageid", id);
      if (file) formData.append("file", file);
      if (replyId) formData.append("p_replyid", replyId);

      const res = await axios.post(`/chat/insertmessage`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (res.data?.p_status) {
        const updatedMessage = {
          id,
          senderId: userId,
          content,
          file: file || res.data.filepath || null,
          conversationId: activeChat.conversationId,
          replyId: replyId || null,
        };

        socket.emit("editMessage", updatedMessage);
        dispatch(updateMessage(updatedMessage));
        setEditingMessage(null);
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const fetchMessages = async () => {
    if (!activeChat?.conversationid) return;
    try {
      const res = await axios.get(`/chat/messages/${activeChat.conversationid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.messages) {
        res.data.messages.forEach((msg) => dispatch(addMessage(msg)));
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };


  useEffect(() => {
    if (location.state?.influencerId) {
      const { influencerId, influencerName, influencerPhoto, conversationId } = location.state;

      const chatData = {
        id: conversationId || influencerId,
        conversationid: conversationId,
        name: influencerName,
        img: influencerPhoto,
        vendorId: userId,
        influencerId,
      };

      dispatch(setActiveChat(chatData));

      if (conversationId) {
        fetchMessages();
      }
    }
  }, [location.state, dispatch, userId]);

  return (
    <div className="h-[85vh] flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`md:w-1/2 w-full h-full border-gray-200 flex-shrink-0 me-2 ${activeChat ? "hidden md:block" : "block"
          }`}
      >
        <Sidebar
          onSelectChat={(chat) =>
            dispatch(
              setActiveChat(chat)
            )}
          selectChatFromOutside={chatToSelect}
        />
      </div>

      {/* Main Chat Area */}
      {showChatUI && (
        <div
          className={`flex-1 h-full flex flex-col ${activeChat ? "flex" : "hidden md:flex"
            }`}
        >
          <div className="sticky top-0 z-10 bg-white rounded-2xl border-b border-gray-200">
            <ChatHeaderVendor
              chat={activeChat}
              onOnlineStatusChange={setIsRecipientOnline}
              onBack={() => dispatch(setActiveChat(null))}
            />
          </div>

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
              key={refreshKey}
              chat={{ ...activeChat, myRoleId: role, myUserId: userId }}
              messages={messages}
              setReplyToMessage={setSelectedReplyMessage}
              editingMessage={editingMessage}
              setEditingMessage={setEditingMessage}
              isRecipientOnline={isRecipientOnline}
            />
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-100">
            <ChatInput
              canstartchat={activeChat?.canstartchat}
              onSend={(data) =>
                editingMessage
                  ? handleEditMessage({ ...editingMessage, ...data, replyId: selectedReplyMessage?.id })
                  : handleSendMessage({ ...data, replyId: selectedReplyMessage?.id })
              }
              replyTo={selectedReplyMessage}
              onCancelReply={() => setSelectedReplyMessage(null)}
              editingMessage={editingMessage}
              onEditComplete={handleEditMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
