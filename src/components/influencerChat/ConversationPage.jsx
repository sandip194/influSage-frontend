import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

const ConversationPage = () => {
  const [activeSubject, setActiveSubject] = useState("");

  return (
    <div className="h-[85vh] flex overflow-hidden gap-0 p-0 m-0">

      <div className="w-[410px]">
        <Sidebar setActiveSubject={setActiveSubject} />
      </div>

      <div className="flex-1">
        <ChatWindow activeSubject={activeSubject} />
      </div>
    </div>
  );
};

export default ConversationPage;
