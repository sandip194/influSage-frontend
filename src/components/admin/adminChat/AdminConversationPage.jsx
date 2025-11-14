import React, { useState } from "react";
import AdminChatWindow from "./AdminChatWindow";
import AdminSidebar from "./AdminSidebar";

const AdminConversationPage = () => {
  const [activeSubject, setActiveSubject] = useState("");

  return (
    <div className="h-[85vh] flex overflow-hidden gap-0 p-0 m-0">

      <div className="w-[410px]">
        <AdminSidebar setActiveSubject={setActiveSubject} />
      </div>

      <div className="flex-1">
        <AdminChatWindow activeSubject={activeSubject} />
      </div>
    </div>
  );
};

export default AdminConversationPage;
