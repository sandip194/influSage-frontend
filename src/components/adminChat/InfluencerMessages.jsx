import React, { useState } from "react";
import MessageSidebar from "./MessageSidebar";
import MessageChat from "./MessageChat";
import NewSubjectModal from "./NewSubjectModal";

const InfluencerMessages = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, title: "Payment Issue", lastMsg: "Hi, I need help with payment", time: "05:00 PM" },
    { id: 2, title: "Campaign Query", lastMsg: "Can you share details?", time: "05:10 PM" },
  ]);
  const [activeChat, setActiveChat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddSubject = (subjectTitle) => {
    if (!subjectTitle.trim()) return;
    const newSubject = {
      id: Date.now(),
      title: subjectTitle,
      lastMsg: "",
      time: "Now",
    };
    setSubjects([...subjects, newSubject]);
    setActiveChat(newSubject);
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#f9fafb]">
      <MessageSidebar
        subjects={subjects}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        openModal={() => setIsModalOpen(true)}
      />

      <div className="flex-1">
        {activeChat ? (
          <MessageChat activeChat={activeChat} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select or start a new conversation
          </div>
        )}
      </div>

      <NewSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleAddSubject}
      />
    </div>
  );
};

export default InfluencerMessages;
