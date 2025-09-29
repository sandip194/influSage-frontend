import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

import { getSocket } from "../../sockets/socket";
import {
  addMessage,
  updateMessageStatus,
  setActiveChat,
} from "../../features/socket/chatSlice";

export default function ChatAppPage() {
  const dispatch = useDispatch();
  const { token, id: userId, role } = useSelector((state) => state.auth);
  const socket = getSocket();

  const activeChat = useSelector((state) => state.chat.activeChat);
  const messages = useSelector((state) => state.chat.messages);

  // Emit via socket
  const showChatUI = activeChat && socket;


  // 👥 Join/leave chat room when activeChat changes
  useEffect(() => {
  if (!socket || !activeChat?.id) return;

  socket.emit("joinRoom", activeChat.id);
  return () => {
    socket.emit("leaveRoom", activeChat.id);
  };
}, [activeChat?.id]);


  // 📥 Receive messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      dispatch(addMessage(msg));
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, dispatch]);

  // ✉️ Handle sending messages
  const handleSendMessage = async ({ text, file }) => {
    if (!activeChat) return;

    const newMsg = {
      id: Date.now(), // temporary ID
      senderId: role,
      content: text,
      conversationId: activeChat.id,
      file: file || null,
      status: "sending",
    };

    // Optimistically add message to Redux
    dispatch(addMessage(newMsg));


    socket?.emit("sendMessage", newMsg);

    // Save to backend
    try {
      const formData = new FormData();
      formData.append("p_conversationid", activeChat.id);
      formData.append("p_roleid", role);
      formData.append("p_messages", text);
      if (file) formData.append("file", file);

      const res = await axios.post(`/chat/insertmessage`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.p_status) {
        dispatch(
          updateMessageStatus({
            tempId: newMsg.id,
            newId: res.data.message_id,
            fileUrl: res.data.filepath || null,
          })
        );
      }
    } catch (err) {
      console.error("Send failed", err);
      // Optional: dispatch an error update to show "failed" in UI
    }
  };

  return (
    <div className="h-[85vh] flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`md:w-1/4 w-full h-full border-gray-200 flex-shrink-0 me-2 ${activeChat ? "hidden md:block" : "block"
          }`}
      >
        <Sidebar onSelectChat={(chat) =>
          dispatch(
            setActiveChat(chat)
          )} />
      </div>

      {/* Main chat area */}

      {showChatUI && (
        <div
          className={`flex-1 h-full flex flex-col ${activeChat ? "flex" : "hidden md:flex"
            }`}
        >
          <div className="sticky top-0 z-10 bg-white rounded-2xl border-b border-gray-200">
            <ChatHeader chat={activeChat} onBack={() => dispatch(setActiveChat(null))} />
          </div>

          <div
            className="flex-1 overflow-y-auto bg-white p-4"
            style={{
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/food.png")',
              backgroundRepeat: "repeat",
              backgroundSize: "auto",
              backgroundPosition: "center",
              backgroundBlendMode: "luminosity",
              opacity: 0.9,
            }}
          >
            <ChatMessages
              chat={{ ...activeChat, myRoleId: role, myUserId: userId }}
              messages={messages}
            />
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-100">
            <ChatInput onSend={handleSendMessage} />
          </div>
        </div>
      )}


    </div>
  );
}
