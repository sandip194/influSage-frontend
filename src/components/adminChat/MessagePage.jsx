import React, { useState } from "react";
import Sidebar from "./MessageSidebar";
import ChatWindow from "./MessageChat";
import NewChatModal from "./NewSubjectModal";

const MessagePage = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, title: "Payment Issue" },
    { id: 2, title: "Campaign Query" },
  ]);
  const [activeSubject, setActiveSubject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add new subject
  const handleCreateSubject = (subjectTitle) => {
    const newSubject = {
      id: Date.now(),
      title: subjectTitle,
      messages: [],
    };
    setSubjects([...subjects, newSubject]);
    setActiveSubject(newSubject);
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        subjects={subjects}
        activeSubject={activeSubject}
        setActiveSubject={setActiveSubject}
        onAddClick={() => setIsModalOpen(true)}
      />

      {/* Chat Window */}
      <div className="flex-1">
        {activeSubject ? (
          <ChatWindow subject={activeSubject} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a conversation or start a new one
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateSubject}
      />
    </div>
  );
};

export default MessagePage;
