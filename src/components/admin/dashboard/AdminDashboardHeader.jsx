import { Dropdown, Avatar, Badge } from "antd";
import { RiMenu2Line, RiNotification3Line } from "@remixicon/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../features/auth/authSlice";
import React, { useState, useEffect } from "react";

const AdminDashboardHeader = ({ toggleSidebar }) => {
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
    alert("Settings clicked! (dummy menu)"); // replace with real navigation if needed
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

  // const notifications = {
  //   items: [
  //     { key: "1", label: "New user registered" },
  //     { key: "2", label: "Campaign request pending" },
  //     { key: "3", label: "System update available" },
  //   ],
  // };

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:pl-64 fixed top-0 left-0 z-30">
      {/* Mobile Hamburger */}
      <button
        className="md:hidden text-gray-600"
        onClick={toggleSidebar}
      >
        <RiMenu2Line size={24} />
      </button>

      {/* Right-side Controls */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        {/* <Dropdown menu={notifications} placement="bottomRight" arrow> */}
          {/* <div className="cursor-pointer relative">
            <Badge count={3} size="small">
              <RiNotification3Line size={22} className="text-gray-600" />
            </Badge>
          </div> */}
        {/* </Dropdown> */}

        {/* User Avatar + Dropdown */}
        <Dropdown menu={userMenu} placement="bottomRight" arrow>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar
              src={
                profileData?.photopath
                  ? profileData.photopath
                  : "https://api.dicebear.com/5.x/bottts/svg?seed=admin"
              }
              alt={profileData?.firstname }
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
