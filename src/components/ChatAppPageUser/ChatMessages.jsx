import { useEffect, useState, useRef } from "react";
import {
  RiReplyLine,
  RiEdit2Line,
  RiDeleteBinLine,
  RiCheckDoubleLine,
  RiCheckLine,
  RiDownload2Line,
} from "react-icons/ri";
import { Tooltip } from "antd";
import { Image } from "primereact/image";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";


/* ⏱️ same formatter */
const formatTime = () => "Just now";


export default function ChatMessages({ chat }) {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token, userId, role } = useSelector((state) => state.auth);

  const getMessageStatusIcon = () => (
    <RiCheckDoubleLine className="text-blue-500" size={16} />
  );
  const conversationId = chat?.conversationid || chat?.id;

  const fetchMessages = async () => {
    if (!conversationId || !token) return;

    try {
      setLoading(true);

      const res = await axios.get("/chat/messages", {
        params: {
          p_conversationid: conversationId,
          p_roleid: role,
          p_limit: 50,
          p_offset: 0,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const records = res?.data?.data?.records ?? [];

      setMessages(
        records.map((msg) => ({
          id: Number(msg.messageid),
          roleId: Number(msg.roleid),
          content: msg.message || "",
          time: msg.createddate,
          deleted: msg.isdeleted ?? false,
          ishtml: msg.ishtml ?? false,
          readbyvendor: msg.readbyvendor ?? false,
          readbyinfluencer: msg.readbyinfluencer ?? false,
          replyId: msg.replyid,
          file: msg.filepath
            ? (Array.isArray(msg.filepath) ? msg.filepath : [msg.filepath])
            : [],
        }))
      );
    } catch (err) {
      console.error("❌ Failed to load messages", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a conversation to start chatting
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading messages...
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto overflow-x-hidden px-0 pt-8 space-y-3"
    >
      {messages.map((msg, index) => {
        const isMe = Number(msg.roleId) === Number(role);

        const isLast = index === messages.length - 1;

        return (
          <div
            id={`message-${msg.id}`}
            key={msg.id}
            ref={isLast ? bottomRef : null}
            className={`flex relative ${
              isMe ? "justify-end mr-4" : "items-start space-x-2 ml-4"
            }`}
            onMouseEnter={() => setHoveredMsgId(msg.id)}
            onMouseLeave={() => setHoveredMsgId(null)}
          >
            {!isMe && (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                {chat?.img ? (
                  <img
                    src={chat.img}
                    alt={chat.name}
                    onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>{chat?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            )}


            <div className={`relative flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              {/* Message bubble */}
              <div
                className={`px-3 py-1 rounded-lg
                  max-w-[280px] sm:max-w-xs md:max-w-sm
                  break-words whitespace-pre-wrap
                  ${isMe ? "bg-[#0D132D] text-white" : "bg-gray-200 text-gray-900"}`}
              >
                {/* FILE PREVIEW */}
                    {!msg.deleted && Array.isArray(msg.file) && msg.file.length > 0 && (
                    <div className="mb-2 space-y-2">
                        {msg.file.map((fileUrl, idx) => {
                        const fileName = fileUrl.split("/").pop();
                        const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(fileName);
                        const isPDF = /\.pdf$/i.test(fileName);
                        const isVideo = /\.(mp4|webm|ogg)$/i.test(fileName);
                        const isDoc = /\.(doc|docx|xls|xlsx|ppt|pptx|zip|rar|7z)$/i.test(fileName);

                        if (isImage) {
                            return (
                            <div key={idx} className="flex flex-col gap-1">
                                <Image
                                src={fileUrl}
                                preview
                                className="max-w-[220px] rounded-lg"
                                />
                                <a
                                href={fileUrl}
                                download={fileName}
                                className="flex items-center gap-1 text-blue-600 text-xs"
                                >
                                <RiDownload2Line /> Download
                                </a>
                            </div>
                            );
                        }

                        if (isPDF) {
                            return (
                            <div key={idx}>
                                <iframe
                                src={fileUrl}
                                className="w-[220px] h-[180px] rounded border"
                                title={fileName}
                                />
                                <a
                                href={fileUrl}
                                target="_blank"
                                className="text-blue-600 underline text-xs"
                                >
                                {fileName}
                                </a>
                            </div>
                            );
                        }

                        if (isVideo) {
                            return (
                            <video
                                key={idx}
                                src={fileUrl}
                                controls
                                className="w-[220px] rounded"
                            />
                            );
                        }

                        if (isDoc) {
                            return (
                            <a
                                key={idx}
                                href={fileUrl}
                                download
                                className="text-blue-600 underline text-xs"
                            >
                                {fileName}
                            </a>
                            );
                        }

                        return null;
                        })}
                    </div>
                    )}
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(msg.content),
                  }}
                />
              </div>

              {/* Time + status */}
              <div className="text-[10px] text-gray-500 px-2 flex items-center gap-1 justify-end">
                <span>{formatTime(msg.time)}</span>
                <span>{getMessageStatusIcon()}</span>
              </div>

              {/* Hover actions */}
              {hoveredMsgId === msg.id && (
                <div
                  className={`absolute flex gap-2 items-center px-3 py-1 bg-white shadow-md rounded-md z-10 ${
                    isMe ? "right-0 -top-8" : "left-0 -top-8"
                  }`}
                >
                  <button className="p-1 rounded-full cursor-pointer hover:bg-gray-100">
                    <Tooltip title="Reply">
                      <RiReplyLine size={18} />
                    </Tooltip>
                  </button>

                  {isMe && (
                    <>
                      <button className="p-1 rounded-full cursor-pointer hover:bg-gray-100">
                        <Tooltip title="Edit">
                          <RiEdit2Line size={18} />
                        </Tooltip>
                      </button>

                      <button className="p-1 rounded-full cursor-pointer hover:bg-gray-100 text-red-500">
                        <Tooltip title="Delete">
                          <RiDeleteBinLine size={18} />
                        </Tooltip>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
