import React, { useEffect, useState, useMemo } from "react";
import api from "../../../api/axios";import { Skeleton, Empty } from "antd";
import { useSelector } from "react-redux";
import { RiStarFill } from "@remixicon/react";
import { useNavigate } from "react-router-dom";

const FeedbackCard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000;

    if (diff < 60) return "Just now";
    if (diff < 3600) return Math.floor(diff / 60) + " mins ago";
    if (diff < 86400) return Math.floor(diff / 3600) + " hours ago";

    const days = Math.floor(diff / 86400);
    if (days === 1) return "Yesterday";
    if (days < 7) return days + " days ago";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get("user/dashboard/getfeedback", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(res.data?.Data || []);
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [token]);

  const renderFeedbackCard = (fb) => (
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
      {/* ===== Header ===== */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={fb.campaignpohoto || "/Brocken-Defualt-Img.jpg"}
            alt={fb.campaignname || "Brand"}
            onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
            className="w-12 h-12 rounded-full object-cover border border-gray-200"
          />

          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate ">
              {fb.campaignname || "Unknown Brand"}
            </p>
            <p className="text-xs text-gray-500">
              {formatTime(fb.createddate)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex mb-3 gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <RiStarFill
            key={i}
            size={24}
            className={`${i <= (fb.rating || 0) ? "text-yellow-400" : "text-white"
              } stroke-yellow-700 stroke-[0.6]`}
          />
        ))}
      </div>


      {/* ===== Feedback Text ===== */}
      <div className="flex gap-2 text-sm text-gray-700">
        <p className="text-justify line-clamp-2">
          {fb.text || "-"}
        </p>
      </div>
    </div>
  );


  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          Recent Feedbacks From Brands
        </h2>

        {feedbacks.length > 0 && (
          <button
            onClick={() => navigate("/dashboard/feedbacks")}
            className="cursor-pointer text-[#0D132D] text-sm font-medium hover:underline"
          >
            View All
          </button>
        )}
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : feedbacks.length === 0 ? (
        <Empty description="No feedback available" />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {feedbacks.slice(0, 3).map(renderFeedbackCard)}
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;
