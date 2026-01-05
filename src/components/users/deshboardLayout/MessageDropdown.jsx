import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiPaperclip } from "react-icons/fi";
import { Empty, Skeleton } from "antd";


const MessageDropdown = React.memo(({ messages = [], loading }) => {
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const navigatePath = role === 1 ? "/dashboard/messages" : "/vendor-dashboard/messages";

  const getMessagePreview = (msg) => {
    if (msg.message) return msg.message;

    if (!msg.message && msg.filepath) {
      // Extract file extension
      const ext = msg.filepath.split(".").pop().toLowerCase();

      // Pick icon based on file type
      let icon = "ri-file-3-line";
      let label = "File";

      if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
        icon = "ri-image-2-line";
        label = "Photo";
      } else if (["mp4", "mov", "avi", "mkv"].includes(ext)) {
        icon = "ri-video-line";
        label = "Video";
      } else if (["mp3", "wav", "ogg"].includes(ext)) {
        icon = "ri-music-2-line";
        label = "Audio";
      } else if (["pdf"].includes(ext)) {
        icon = "ri-file-pdf-2-line";
        label = "PDF Document";
      } else if (["doc", "docx", "txt"].includes(ext)) {
        icon = "ri-file-text-line";
        label = "Document";
      }

      return (
        <span className="flex items-center gap-1 text-[#0b0d28]">
          <i className={`${icon} text-gray-700 text-lg`}></i>
          <span>{label}</span>
        </span>
      );
    }

    return "No content";
  };



  return (
    <div className="w-80 sm:w-80 bg-white p-4 shadow-xl rounded-2xl">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg text-[#0b0d28]">Messages</h2>
        <button
          className="text-sm text-[#0b0d28] font-medium hover:underline cursor-pointer"
          onClick={() => navigate(navigatePath)}
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 items-start">
              <Skeleton.Avatar active size="large" shape="circle" />
              <Skeleton active title={false} paragraph={{ rows: 2, width: ['80%', '60%'] }} />
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="flex justify-center py-5">
          <Empty
            description="No Unread Messages"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {messages.map((msg) => (
            <div key={msg.messageid || msg.id} className="flex items-start gap-3 py-3">
              <img
                src={msg.photopath}
                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                className="w-10 h-10 rounded-full object-cover"
                alt="User"
              />
              <div className="min-w-0">
                <div className="flex items-start gap-3 text-sm">
                  <span className="font-bold text-[#0b0d28]">{msg.name}</span>
                  <span className="text-gray-400 text-xs w-20">
                    {msg.createddate
                      ? new Date(msg.createddate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      : ""}
                  </span>
                </div>
                <p className="text-sm text-[#0b0d28] mt-1 truncate" title={msg.message || ""}>
                  {getMessagePreview(msg)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default MessageDropdown;
