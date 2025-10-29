
import React, { useEffect, useState } from "react";
import { Modal, Spin, Tooltip } from "antd";
import axios from "axios";
import { toast } from "react-toastify";

const InviteModal = ({
  visible,
  influencerId,
  userId,
  token,
  onClose,
}) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch campaigns on open
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!visible || !influencerId) return;

      setLoading(true);
      try {
        const res = await axios.get("/vendor/inviteinfluencer/Campaigns", {
          params: { p_userid: userId, p_influencerid: influencerId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setCampaigns(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [visible, influencerId, userId, token]);

  const handleSubmit = async () => {
    if (selected.length === 0) {
      return toast.error("Please select at least one campaign");
    }

    try {
      setSubmitting(true);
      const formatted = selected.map((id) => ({ campaignid: id }));

      const res = await axios.post(
        "/vendor/campaign/invite",
        {
          p_influencerid: influencerId,
          p_campaignidjson: formatted,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message || "Invited successfully");
        onClose();
        setSelected([]);
      } else {
        toast.error(res.data.message || "Failed to invite");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSelect = (campaignId) => {
    setSelected((prev) =>
      prev.includes(campaignId)
        ? prev.filter((id) => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  return (
    <Modal
      title="Invite Influencer to Campaign"
      open={visible}
      onCancel={onClose}
      footer={null}
      className="rounded-xl"
    >
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : campaigns.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No campaigns available
        </p>
      ) : (
        <>
          <div className="max-h-96 overflow-y-auto pr-2 space-y-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => toggleSelect(campaign.id)}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(campaign.id)}
                  readOnly
                  className="w-4 h-4 accent-[#0f122f] mr-4"
                />
                <div className="flex-1 flex items-center gap-3">
                  {/* Campaign Photo */}
                  {campaign.photopath && (
                    <img
                      src={campaign.photopath}
                      alt={campaign.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold text-[#0D132D]">
                      {campaign.name}
                    </h4>
                    {campaign.startdate && campaign.enddate && (
                      <p className="text-xs text-gray-500">
                        {campaign.startdate} → {campaign.enddate}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 mt-4 border-t">
            <button
              onClick={handleSubmit}
              disabled={selected.length === 0 || submitting}
              className="px-5 py-2 bg-[#0f122f] text-white rounded-lg font-medium hover:bg-[#23265a] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting
                ? "Inviting..."
                : `Invite Selected (${selected.length})`}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default InviteModal;
