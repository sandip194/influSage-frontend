import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => (
  <div className="dashboard-layout flex">
    <aside className="w-64 bg-gray-200">Sidebar</aside>
    <main className="flex-1 p-4">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
