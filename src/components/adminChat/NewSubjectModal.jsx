import React, { useState } from "react";
import { Modal } from "antd";

const NewSubjectModal = ({ isOpen, onClose, onCreate }) => {
  const [selectedSubject, setSelectedSubject] = useState("");

  const handleCreate = () => {
    if (!selectedSubject.trim()) return;
    onCreate(selectedSubject);
    setSelectedSubject("");
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} centered>
      <h3 className="text-lg font-semibold mb-4">Start a New Conversation</h3>
      <label className="block text-sm mb-2 text-gray-700">Select Subject</label>
      <select
        className="border w-full p-2 rounded-lg mb-4 outline-none"
        onChange={(e) => setSelectedSubject(e.target.value)}
        value={selectedSubject}
      >
        <option value="">Select...</option>
        <option>Payment Issue</option>
        <option>Account Help</option>
        <option>Campaign Query</option>
        <option>Other</option>
      </select>
      <button
        onClick={handleCreate}
        className="bg-[#0D132D] text-white px-4 py-2 rounded-lg w-full hover:bg-gray-800"
      >
        Start Chat
      </button>
    </Modal>
  );
};

export default NewSubjectModal;
