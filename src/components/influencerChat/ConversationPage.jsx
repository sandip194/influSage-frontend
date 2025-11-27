import React, { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

const ConversationPage = () => {
  const [activeSubject, setActiveSubject] = useState(null);
  const sidebarRef = useRef(null);

  const refreshTicketList = () => {
    if (sidebarRef.current) sidebarRef.current.refresh();
  };

  return (
    <div className="h-[85vh] flex overflow-hidden gap-0 p-0 m-0">

      {/* Sidebar */}
      <div
        className={`w-full md:w-[410px] md:border-r border-gray-200 ${
          activeSubject ? "hidden md:block" : "block"
        }`}
      >
        <Sidebar setActiveSubject={setActiveSubject} ref={sidebarRef} />
      </div>

      {/* Chat window */}
      <div
        className={`flex-1 w-full ${
          activeSubject ? "block" : "hidden md:block"
        }`}
      >
        <ChatWindow
          activeSubject={activeSubject}
          onBack={() => setActiveSubject(null)}
          onCloseSuccess={() => {
            refreshTicketList();
            setActiveSubject(null);
          }}
        />
      </div>

    </div>
  );
};

export default ConversationPage;
