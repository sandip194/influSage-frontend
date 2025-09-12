import React, { useRef } from 'react';
import DeshboardHeader from '../../../components/users/deshboardLayout/DeshboardHeader';
import Sidebar from '../../../components/users/vendorDashboardLayout/Sidebar';
import { Outlet } from 'react-router-dom';

const VenderDashboardLayout = () => {
  const sidebarRef = useRef();

  const toggleSidebar = () => {
    if (sidebarRef.current) {
      sidebarRef.current.toggleSidebar(); // call Sidebar's toggle
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar ref={sidebarRef} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-auto">
        <DeshboardHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VenderDashboardLayout;
