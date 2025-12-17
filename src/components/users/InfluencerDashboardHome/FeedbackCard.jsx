import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Modal, Skeleton, Empty } from "antd";
import { useSelector } from "react-redux";

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
      className="rounded-2xl p-4 flex flex-col justify-between h-full bg-white 
                 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
    >
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`ri-star-${i < fb.rating ? "fill" : "line"} text-lg ${
              i < fb.rating ? "text-yellow-500" : "text-gray-400"
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-gray-700 mb-4 text-justify">{fb.text || "No feedback"}</p>

      <div className="flex items-center gap-3 mt-auto">
        <img
          src={fb.campaignpohoto || "https://via.placeholder.com/40"}
          alt={fb.campaignname || "Brand"}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
        />
        <div>
          <p className="text-sm sm:text-base font-bold text-gray-800">
            {fb.campaignname || "Unknown Brand"}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            {formatTime(fb.createddate)}
          </p>
        </div>
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
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
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
        <Empty description="No feedback available" />
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
