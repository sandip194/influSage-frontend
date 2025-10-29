
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const MessageDropdown = ({ messages = [] }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const navigatePath = role === 1 ? "/dashboard/messages" : "/vendor-dashboard/messages";

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

      {messages.length === 0 ? (
        <div className="flex justify-center py-5">
          <p className="text-gray-500 text-sm">No New Messages</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {messages.map((msg) => (
            <div key={msg.messageid} className="flex items-start gap-3 py-3">
              <img
                src={
                  msg.photopath
                    ? `${BASE_URL}${msg.photopath.startsWith("/") ? "" : "/"}${msg.photopath}`
                    : ""
                }
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
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
                <p className="text-sm text-[#0b0d28] mt-1">{msg.message || "No content"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageDropdown;
