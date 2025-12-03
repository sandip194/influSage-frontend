import React, { useState } from "react";
import { Modal } from "antd";
import { RiStarFill, RiStarLine } from "@remixicon/react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const VendorFeedbackModal = ({ influencer, onClose }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const { token } = useSelector((state) => state.auth);

  const handleSubmit = async () => {
    if (!rating) return toast.error("Please select rating");
    if (!feedback.trim()) return toast.error("Feedback cannot be empty");

    try {
      const res = await axios.post(
        "/vendor/feedback",
        {
          influencerId: influencer?.influencerid,
          rating,
          feedback,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        toast.success("Feedback submitted successfully!");
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting feedback");
    }
  };

  return (
    <Modal open={true} onCancel={onClose} footer={null} centered width={550}>
      <div className="px-2 py-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Provide Influencer Feedback
        </h2>

        {/* Select Influencer Card */}
        <div className="p-4 rounded-xl border border-gray-100 bg-white flex items-center gap-3 mb-5">
          <img
            src={influencer.userphoto}
            alt=""
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {influencer.firstname} {influencer.lastname}
            </h3>
            <p className="text-sm text-gray-500">@{influencer.username}</p>
          </div>
        </div>

        {/* Rating */}
        <p className="font-medium text-gray-900 mb-2">Overall Rating</p>
        <div className="flex items-center gap-1 mb-5 cursor-pointer">
          {[1, 2, 3, 4, 5].map((star) =>
            star <= rating ? (
              <RiStarFill
                key={star}
                size={26}
                className="text-yellow-500"
                onClick={() => setRating(star)}
              />
            ) : (
              <RiStarLine
                key={star}
                size={26}
                className="text-yellow-500"
                onClick={() => setRating(star)}
              />
            )
          )}
        </div>

        {/* Detailed Feedback */}
        <p className="font-medium text-gray-900 mb-2">Detailed Feedback</p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your experience working with this influencer..."
          className="w-full h-28 border border-gray-300 rounded-lg p-3 text-sm outline-none"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-full bg-[#0f122f] text-white hover:bg-opacity-90"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VendorFeedbackModal;
