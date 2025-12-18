import { useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminDashboardHeader from "./AdminDashboardHeader";

const AdminDashboardLayout = () => {
  const sidebarRef = useRef();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024); // Sync with sidebar's initial state

  const toggleSidebar = () => {
    sidebarRef.current?.toggleSidebar();
  };

  // Dynamic padding-left for main content
  const mainPaddingLeft = sidebarOpen ? '16rem' : '4rem'; // 256px : 64px

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <AdminSidebar ref={sidebarRef} onStateChange={setSidebarOpen} />

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-opacity-30 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Header */}
      <AdminDashboardHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <main 
        className="pt-16 transition-all duration-300 bg-gray-100"
        style={{ paddingLeft: window.innerWidth >= 768 ? mainPaddingLeft : '0' }}
      >
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;