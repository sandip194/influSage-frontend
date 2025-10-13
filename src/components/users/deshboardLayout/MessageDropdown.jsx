import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const MessageDropdown = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, id: userId, role } = useSelector((state) => state.auth) || {};
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const navigaetPath = role === 1 ? "/dashboard/messages" : "/vendor-dashboard/messages"

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/chat/unread-messages`, {
          headers: { Authorization: `Bearer ${token}` } 
        });

        if (res.data?.data) {
          setMessages(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch unread messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadMessages();
  }, []);

  return (
    <div
      className="w-60 sm:w-80 bg-white shadow-lg rounded-3xl p-4 mt-5"
      style={{ left: "-71px", position: "absolute" }}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg text-[#0b0d28]">Messages</h2>
        <button 
        className="text-sm text-[#0b0d28] font-medium hover:underline cursor-pointer"
        onClick={() => navigate(navigaetPath)}
          >
          View All
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-500 text-sm">No unread messages</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {messages.map((msg) => (
            <div key={msg.messageid} className="flex items-start gap-3 py-3">
              <img
                src={
                  msg.photopath
                    ? `${BASE_URL}${ msg.photopath.startsWith("/") ? "" : "/" }${msg.photopath}`
                    : ""
                }
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-bold text-[#0b0d28]">
                    {msg.firstname}
                  </span>
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
                <p className="text-sm text-[#0b0d28] mt-1">
                  {msg.message || "No content"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageDropdown;
