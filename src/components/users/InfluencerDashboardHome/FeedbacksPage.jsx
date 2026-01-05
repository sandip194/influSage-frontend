import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton, Empty } from "antd";
import { useSelector } from "react-redux";
import { RiStarFill } from "@remixicon/react";

const FeedbacksPage = () => {
  const { token } = useSelector((state) => state.auth);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000;

    if (diff < 3600) return "Just now";
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;

    const days = Math.floor(diff / 86400);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get("user/dashboard/getfeedback", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(res.data?.Data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [token]);

  return (
    <div className="bg-white p-6 rounded-2xl w-full">
      <h1 className="text-2xl font-bold text-[#0D132D] mb-6">
        All Feedbacks
      </h1>

      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : feedbacks.length === 0 ? (
        <Empty description="No feedback available" />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map((fb) => (
            <div
              key={fb.feedbackid}
              className="
                bg-[#335CFF0D]
                border border-[#335CFF26]
                rounded-2xl
                p-5
                shadow-sm
                hover:shadow-md
                transition
                flex flex-col
                h-full
              "
            >
              {/* ===== Top ===== */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={fb.campaignpohoto || "/placeholder.jpg"}
                    className="w-10 h-10 rounded-full object-cover border"
                    alt=""
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0D132D] truncate">
                      {fb.campaignname || "Unknown Brand"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(fb.createddate)}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-0.5 shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <RiStarFill
                      key={i}
                      size={14}
                      className={
                        i < fb.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>

              {/* ===== Feedback ===== */}
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
                {fb.text || "No feedback provided."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbacksPage;
