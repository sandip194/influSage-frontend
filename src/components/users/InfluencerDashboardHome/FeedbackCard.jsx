import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Modal, Skeleton, Empty } from "antd";
import { useSelector } from "react-redux";
import { RiStarFill, RiChatQuoteLine } from "@remixicon/react";

const FeedbackCard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
        const res = await axios.get("user/dashboard/getfeedback", {
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
      hover:shadow-md transition
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
          <p className="text-sm font-semibold text-gray-900 truncate">
            {fb.campaignname || "Unknown Brand"}
          </p>
          <p className="text-xs text-gray-500">
            {formatTime(fb.createddate)}
          </p>
        </div>
      </div>
    </div>
<div className="flex mb-3 gap-1">
        {fb.rating > 0 && (
        <div className="flex items-center gap-1 shrink-0">
          {Array.from({ length: fb.rating }).map((_, i) => (
            <RiStarFill
              key={i}
              size={20}
              className="text-yellow-400"
              style={{ stroke: "black", strokeWidth: 0.6 }}
            />
          ))}
        </div>
      )}
      </div>
    {/* ===== Feedback Text ===== */}
    <div className="flex gap-2 text-sm text-gray-700">
      <RiChatQuoteLine className="shrink-0 text-gray-400 mt-0.5" />
      <p className="line-clamp-3 text-justify">
        {fb.text || "No feedback provided."}
      </p>
    </div>
  </div>
);

  const feedbackCards = useMemo(
    () => feedbacks.slice(0, 3).map(renderFeedbackCard),
    [feedbacks]
  );

  const allFeedbackCards = useMemo(
    () => feedbacks.map(renderFeedbackCard),
    [feedbacks]
  );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl w-full">
      {/* Header - Always Visible */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <h2 className="text-xl font-bold text-gray-900">
          Recent Feedbacks From Brands
        </h2>

        {feedbacks.length > 0 && (
          <button
            onClick={() => setShowModal(true)}
            className="text-sm cursor-pointer text-gray-700 hover:underline"
          >
            View All
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : feedbacks.length === 0 ? (
        <Empty
          description="No feedback available"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {feedbackCards}
        </div>
      )}

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        centered
        width={800}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto", padding: "10px" }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Feedbacks</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">{allFeedbackCards}</div>
      </Modal>
    </div>
  );
};

export default FeedbackCard;
