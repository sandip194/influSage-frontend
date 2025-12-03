// AnalyticsHistoryModal.jsx
import React from "react";
import { Modal } from "antd";

const AnalyticsHistoryModal = ({ visible, onClose, history }) => {
  const safeHistory = history || []; // <-- IMPORTANT FIX

  return (
    <Modal
      title="Analytics History"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      className="rounded-2xl"
    >
      <div className="flex flex-col space-y-3">
        {safeHistory?.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No history available</p>
        ) : (
          safeHistory.map((h, idx) => (
            <div
              key={idx}
              className="flex justify-between bg-gray-100 px-4 py-2 rounded-2xl"
            >
              <span>{h.time}</span>
              <span>Views: {h.views} • Likes: {h.likes}</span>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default AnalyticsHistoryModal;
