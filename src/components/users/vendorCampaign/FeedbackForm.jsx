import React, { useEffect, useState } from "react";
import { Modal, Select } from "antd";
import { RiStarFill, RiStarLine } from "@remixicon/react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const VendorFeedbackModal = ({ campaignId, onClose }) => {
  const [influencers, setInfluencers] = useState([]);
  const [selectedInf, setSelectedInf] = useState(null);

  const [loadingInfluencers, setLoadingInfluencers] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const [errors, setErrors] = useState({
    influencer: "",
    rating: "",
    feedback: ""
  });
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchInfluencers = async () => {
      setLoadingInfluencers(true);
      try {
        const res = await axios.get("/vendor/feedback/influencer-list", {
          params: { campaign_id: campaignId },
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data || [];

        if (Array.isArray(data) && data[0]?.message) {
          setInfluencers([]);
        } else {
          setInfluencers(
            data.map((inf) => ({
              id: inf.userid,
              name: `${inf.firstname} ${inf.lastname}`,
              photopath: inf.userphotopath,
            }))
          );
        }
      } catch (err) {
        toast.error("Unable to load influencers.");
      } finally {
        setLoadingInfluencers(false);
      }
    };

    fetchInfluencers();
  }, [campaignId, token]);

  const validate = () => {
    const newErrors = {};

    if (!selectedInf) newErrors.influencer = "Please select an influencer.";

    if (!feedback.trim()) {
      newErrors.feedback = "Feedback cannot be empty.";
    } else if (feedback.trim().length < 10) {
      newErrors.feedback = "Feedback must be at least 10 characters.";
    } else if (feedback.trim().length > 300) {
      newErrors.feedback = "Feedback cannot exceed 300 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
  if (!validate()) return;

  try {
    const res = await axios.post(
      "/vendor/feedback",
      {
        p_campaignid: campaignId,
        influencerid: selectedInf.id,
        p_rating: rating,
        p_text: feedback,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // SUCCESS
    if (res.data.status === true) {
      toast.success(res.data.message);
      onClose();
      return;
    }

    // DB VALIDATION / DUPLICATE / ANY FAIL
    toast.error(res.data.message);
    
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to submit feedback.");
  }
};


  return (
    <Modal open={true} onCancel={onClose} footer={null} centered width={550}>
      <div className="px-3 py-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-5">
          Provide Feedback
        </h2>

        {/* Influencer */}
        <label className="block font-medium text-gray-700 mb-2">
          Select Influencer
        </label>

        <Select
          className={`w-full mb-2 custom-select ${
            errors.influencer ? "border-red-500" : ""
          }`}
          placeholder="Select Influencer"
          loading={loadingInfluencers}
          value={selectedInf?.id}
          onChange={(id) => {
            const inf = influencers.find((i) => i.id === id);
            setSelectedInf(inf);
            setErrors((prev) => ({ ...prev, influencer: "" }));
          }}
        >
          {influencers.map((inf) => (
            <Select.Option key={inf.id} value={inf.id}>
              <div className="flex items-center gap-2">
                <img
                  src={inf.photopath}
                  alt={inf.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-medium text-gray-800">{inf.name}</span>
              </div>
            </Select.Option>
          ))}
        </Select>

        {errors.influencer && (
          <p className="text-red-500 text-sm mb-3">{errors.influencer}</p>
        )}

        {selectedInf && (
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center gap-4 mb-6 shadow-sm mt-3">

            <img
              src={selectedInf.photopath}
              alt={selectedInf.name}
              className="w-12 h-12 rounded-full object-cover border"
            />

            <h3 className="font-semibold text-gray-900 text-lg">
              {selectedInf.name}
            </h3>

          </div>
        )}

        {/* Rating */}
        <p className="font-medium text-gray-800 mb-2 mt-4">Overall Rating</p>

        <div className="flex items-center gap-1 mb-2 cursor-pointer">
          {[1, 2, 3, 4, 5].map((star) =>
            star <= rating ? (
              <RiStarFill
                key={star}
                size={30}
                className="text-yellow-400"
                onClick={() => {
                  setRating(star);
                }}
              />
            ) : (
              <RiStarLine
                key={star}
                size={30}
                className="text-yellow-400"
                onClick={() => {
                  setRating(star);
                }}
              />
            )
          )}
        </div>

        {errors.rating && (
          <p className="text-red-500 text-sm mb-3">{errors.rating}</p>
        )}

        {/* Feedback */}
        <p className="font-medium text-gray-800 mb-2">Detailed Feedback</p>

        <textarea
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value);
            setErrors((prev) => ({ ...prev, feedback: "" }));
          }}
          placeholder="Share your experience..."
          className={`w-full h-32 border rounded-lg p-3 text-sm outline-none focus:ring-2 ${
            errors.feedback
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-[#0f122f]"
          }`}
        />

        {errors.feedback && (
          <p className="text-red-500 text-sm mt-2">{errors.feedback}</p>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-full bg-[#0f122f] text-white hover:bg-[#1a1d4f] transition"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VendorFeedbackModal;
