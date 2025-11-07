import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MessageDropdown = React.memo(({ messages = [], loading }) => {
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const navigatePath = role === 1 ? "/dashboard/messages" : "/vendor-dashboard/messages";

  const getMessagePreview = (msg) => {
    if (msg.message) return msg.message;
    if (!msg.message && msg.filepath) return "There's a file";
    return "No content";
  };

  return (
    <div className="w-64 sm:w-80 bg-white p-4 shadow-xl rounded-2xl">
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
        <div className="flex justify-center py-5">
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex justify-center py-5">
          <p className="text-gray-500 text-sm">No New Messages</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {messages.map((msg) => (
            <div key={msg.messageid || msg.id} className="flex items-start gap-3 py-3">
              <img
                src={msg.photopath}
                className="w-10 h-10 rounded-full object-cover"
                alt="User"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-bold text-[#0b0d28]">{msg.name}</span>
                  <span className="text-gray-400">
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
