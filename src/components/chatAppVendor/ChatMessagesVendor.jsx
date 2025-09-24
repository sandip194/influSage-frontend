import { useState, useEffect } from "react";
import { RiReplyLine, RiEdit2Line, RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import axios from "axios";

export default function ChatMessagesVendor({ chat }) {
  const [messages, setMessages] = useState([]);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const { id: userId, token, role } = useSelector((state) => state.auth) || {};

  useEffect(() => {
    console.log("hello")
    if (!chat?.id || !token) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/chat/messages`, {
          params: {
            p_conversationid: chat.id,
            p_roleid: role,
            p_limit: 50,
            p_offset: 0
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.data?.records) {
          const formattedMessages = res.data.data.records.map((msg) => ({
            id: msg.messageid,
            sender: msg.roleid,
            content: msg.message.replace(/^"|"$/g, ""),
            file: msg.filepath,
            time: msg.createddate
          }));

          setMessages(formattedMessages);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [chat, token, role]);

  const handleActionClick = (action, messageId) => {
    console.log(action, messageId);
  };

  if (!chat) return <div className="flex-1 p-4">Select a chat to start messaging</div>;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
      {messages.map((msg) => {
        const isMe = userId && msg.sender === userId;

        return (
          <div
            key={msg.id}
            className={`flex relative ${isMe ? "justify-end" : "items-start space-x-2"}`}
            onMouseEnter={() => setHoveredMsgId(msg.id)}
            onMouseLeave={() => setHoveredMsgId(null)}
          >
            {!isMe && (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                {chat?.img ? (
                  <img src={chat.img} alt={chat.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span>{chat?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            )}

            <div className={`p-3 rounded-lg max-w-xs ${isMe ? "bg-[#0D132D] text-white" : "bg-gray-200 text-gray-900"}`}>
              {msg.content}

              {hoveredMsgId === msg.id && (
                <div className={`absolute ${isMe ? "right-0" : "left-12"} -top-8 flex space-x-2 bg-white shadow-md rounded-md px-2 py-1 z-10`}>
                  <button onClick={() => handleActionClick("reply", msg.id)} className="text-gray-500 hover:text-gray-700 transition">
                    <RiReplyLine className="text-xl" title="Reply" />
                  </button>
                  <button onClick={() => handleActionClick("edit", msg.id)} className="text-gray-500 hover:text-gray-700 transition">
                    <RiEdit2Line className="text-xl" title="Edit" />
                  </button>
                  <button onClick={() => handleActionClick("delete", msg.id)} className="text-gray-500 hover:text-gray-700 transition">
                    <RiDeleteBin6Line className="text-xl" title="Delete" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
