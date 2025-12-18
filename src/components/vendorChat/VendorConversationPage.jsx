import React, { useState, useRef } from "react";
import VendorSidebar from "./VendorSidebar";
import VendorChatWindow from "./VendorChatWindow";

const VendorConversationPage = () => {
  const [activeSubject, setActiveSubject] = useState(null);
  const sidebarRef = useRef(null);

  const refreshTicketList = () => {
    if (sidebarRef.current) sidebarRef.current.refresh();
  };

  return (
    <div className="h-[85vh] flex overflow-hidden gap-0 p-0 m-0">

      <div
        className={`w-full md:w-[410px] ${
          activeSubject ? "hidden md:block" : "block"
        }`}
      >
        <VendorSidebar setActiveSubject={setActiveSubject} ref={sidebarRef} />
      </div>

      <div
        className={`flex-1 w-full bg-gray-50 ${
          activeSubject ? "block" : "hidden md:block"
        }`}
      >
        <VendorChatWindow
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

export default VendorConversationPage;
