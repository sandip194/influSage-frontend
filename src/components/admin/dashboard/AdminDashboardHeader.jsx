import { Dropdown, Avatar } from "antd";
import { RiMenu2Line } from "@remixicon/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../features/auth/authSlice";
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboardHeader = ({ toggleSidebar, sidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) return;
      try {
        const res = await axios.get("/user-profile-info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.userData) {
          setProfileData(res.data.userData);
        }
      } catch (error) {
        console.error("Error fetching profile info:", error);
      }
    };

    fetchProfileData();
  }, [token]);

  const handleSettings = () => {
    navigate("/admin-dashboard/settings");
  };

  const userMenu = {
    items: [
      {
        key: "1",
        label: "Settings",
        onClick: handleSettings,
      },
      {
        key: "2",
        label: "Logout",
        danger: true,
        onClick: handleLogout,
      },
    ],
  };

  // Dynamic padding-left for header (to avoid overlap with sidebar)
  const headerPaddingLeft = window.innerWidth >= 768 ? (sidebarOpen ? '16rem' : '4rem') : '1rem'; // 1rem for mobile (from px-4)

  return (
    <header 
      className="w-full py-3 h-16 bg-white border-b border-gray-200 flex items-center justify-between fixed top-0 left-0 z-30"
      style={{ paddingLeft: headerPaddingLeft, paddingRight: '1rem' }} // Override left padding dynamically
    >
      {/* Mobile Hamburger */}
      <button
        className="md:hidden text-gray-600"
        onClick={toggleSidebar}
      >
        <RiMenu2Line size={24} />
      </button>

      {/* Right-side Controls */}
      <div className="flex items-center gap-4 ml-auto">
        {/* User Avatar + Dropdown */}
        <Dropdown menu={userMenu} placement="bottomRight" arrow>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar
              src={
                profileData?.photopath
                  ? profileData.photopath
                  : "https://api.dicebear.com/5.x/bottts/svg?seed=admin"
              }
              alt={profileData?.firstname}
            />
            <span className="hidden sm:inline text-sm font-medium text-gray-700">
              {`${profileData?.firstname || ""} ${profileData?.lastname || ""}`.trim()}
            </span>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default AdminDashboardHeader;