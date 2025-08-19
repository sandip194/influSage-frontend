import React from "react";
import DeshboardHeader from "../../../components/users/deshboardLayout/DeshboardHeader";
import Sidebar from "../../../components/users/vendorDashboardLayout/Sidebar";
import { Outlet } from "react-router-dom";

const VenderDashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-auto">
        {/* Header */}
        <DeshboardHeader />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default VenderDashboardLayout


