import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  RiFolderOpenLine,
  RiHome2Line,
  RiSettings3Line,
  RiUser3Line,
<<<<<<< HEAD
  RiLogoutBoxRLine,
  RiArrowLeftDoubleLine,  
=======
  RiCloseLine,
  RiShutDownLine,
  RiCustomerService2Line ,
>>>>>>> 28ab2904687f422f8ddf87fc8dec310719d29073
} from "@remixicon/react";
import { useDispatch } from "react-redux";
import { Tooltip } from 'antd';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { logout } from "../../../features/auth/authSlice";

const navItems = [
<<<<<<< HEAD
  { name: "Dashboard", icon: <RiHome2Line className="w-5" />, path: "/admin-dashboard" },
  { name: "User Requests", icon: <RiUser3Line className="w-5" />, path: "/admin-dashboard/influencers" },
  { name: "Campaign Requests", icon: <RiFolderOpenLine className="w-5" />, path: "/admin-dashboard/campaigns" },
  { name: "Settings", icon: <RiSettings3Line className="w-5" />, path: "/admin-dashboard/settings" },
=======
  { name: "Dashboard", icon: <RiHome2Line />, path: "/admin-dashboard" },
  { name: "User Requests", icon: <RiUser3Line />, path: "/admin-dashboard/influencers" },
  { name: "Campaign Requests", icon: <RiFolderOpenLine />, path: "/admin-dashboard/campaigns" },
  { name: "Settings", icon: <RiSettings3Line />, path: "/admin-dashboard/settings" },
  { name: "Support", icon: <RiCustomerService2Line />, path: "/admin-dashboard/support" },
>>>>>>> 28ab2904687f422f8ddf87fc8dec310719d29073
];

const AdminSidebar = forwardRef(({ onStateChange }, ref) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onStateChange(newIsOpen); // Notify parent of state change
  };

  useImperativeHandle(ref, () => ({
    toggleSidebar,
    isOpen,
  }));

  const handleResize = () => {
    const width = window.innerWidth;
    if (width < 768) {
      setIsMobile(true);
      setIsOpen(false);
      onStateChange(false);
    } else if (width <= 1024) {
      setIsMobile(false);
      setIsOpen(false);
      onStateChange(false);
    } else {
      setIsMobile(false);
      setIsOpen(true);
      onStateChange(true);
    }
  };

  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Overlay (only for mobile when open) */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-[#00000069] bg-opacity-20 z-30"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-white text-[#0D132D] flex flex-col transition-all duration-300 shadow-sm z-40
          ${isMobile
            ? `fixed top-0 left-0 h-full ${isOpen ? "w-64 px-4 py-1" : "w-0"}`
            : `fixed top-0 left-0 h-screen ${isOpen ? "w-64 px-3 py-1" : "w-16 px-2 py-1"}`
          }
        `}
      >
        {/* Header */}
        <div className={`flex items-center ${isOpen ? "justify-between" : "justify-center"} py-3 h-16 border-b border-gray-100`}>
          {isOpen && (
            <div className="px-3">
              <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
            </div>
          )}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="bg-gray-100 text-[#0D132D] rounded-lg p-1 cursor-pointer"
            >
              <RiArrowLeftDoubleLine
                className={`transform transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`}
              />
            </button>
          )}

          {isMobile && isOpen && (
            <button
              onClick={toggleSidebar}
              className="px-2 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 mt-3 overflow-y-auto">
          {/* Admin Section */}
          
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => isMobile && toggleSidebar()}
              className={`flex items-center ${isOpen ? "justify-start" : "justify-center"}
                mb-1 gap-4 px-2 py-2 cursor-pointer rounded-2xl hover:text-white hover:bg-[#0D132D] 
                ${pathname === item.path ? "bg-[#0D132D] text-white" : "text-[#0D132D]"}`}
            >
              <Tooltip 
                title={item.name} 
                placement="right" 
                disabled={isOpen} 
                destroyTooltipOnHide={true} // Ensures tooltip is destroyed when hidden, preventing persistence
              >
                <span className="text-base">{item.icon}</span>
              </Tooltip>
              {isOpen && <span className="text-sm">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout button at the bottom */}
        {!(isMobile && !isOpen) && (
          <div className="logout-btn mb-2">
            <Tooltip title="Logout" placement="right" disabled={isOpen} destroyTooltipOnHide={true}>
              <button
                onClick={handleLogout}
                className={`flex items-center cursor-pointer ${
                  isOpen ? "justify-between px-6" : "justify-center"
                } w-full py-2 border border-red-300 rounded-full text-red-600 font-semibold hover:text-white hover:bg-red-600 text-sm gap-2`}
              >
                <RiLogoutBoxRLine className="text-lg" />
                {isOpen && <span>Logout</span>}
              </button>
            </Tooltip>
          </div>
        )}
      </aside>
    </>
  );
});

export default AdminSidebar;
