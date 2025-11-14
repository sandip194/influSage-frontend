import React, { useState } from "react";
import VendorSidebar from "./VendorSidebar";
import VendorChatWindow from "./VendorChatWindow";

const VendorConversationPage = () => {
  const [activeSubject, setActiveSubject] = useState("");

  return (
    <div className="h-[85vh] flex overflow-hidden gap-0 p-0 m-0">

      <div className="w-[410px]">
        <VendorSidebar setActiveSubject={setActiveSubject} />
      </div>

      <div className="flex-1">
        <VendorChatWindow activeSubject={activeSubject} />
      </div>
    </div>
  );
};

export default VendorConversationPage;
