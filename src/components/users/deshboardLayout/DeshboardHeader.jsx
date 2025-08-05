<<<<<<< HEAD
import React, { useState } from "react";
import {
  BellOutlined,
  MessageOutlined,
  SearchOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  Dropdown,
  Input,
  Avatar,
  Badge,
  Menu,
  Space,
  Button,
} from "antd";
import NotificationDropdown from "./NotificationDropdown";
import MessageDropdown from "./MessageDropdown";

const { Search } = Input;

const profileMenu = (
  <Menu
    items={[
      {
        key: "1",
        icon: <UserOutlined />,
        label: "My Profile",
      },
      {
        key: "2",
        icon: <SettingOutlined />,
        label: "Settings",
      },
      {
        key: "3",
        icon: <LogoutOutlined />,
        label: "Logout",
        danger: true,
      },
    ]}
  />
);

const notificationMenu = (
  <NotificationDropdown/>
);

const messageMenu = (
  <MessageDropdown/>
);

const DeshboardHeader = () => {
  return (
    <div className="w-full flex justify-between items-center p-4 bg-white shadow-sm border-b-1 border-gray-200">
      {/* Left: Search (hidden on small screens) */}
      <div className="hidden sm:block w-full max-w-sm">
        <Input
          size="large"
          prefix={<SearchOutlined />}
          placeholder=" Search"
        />
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-4">
        {/* Message Dropdown */}
        <Dropdown
          
          overlay={messageMenu}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Badge color="#141843" count={4} offset={[0, 0]}>
            <Button shape="circle" icon={<MessageOutlined />} />
          </Badge>
        </Dropdown>

        {/* Notification Dropdown */}
        <Dropdown
          overlay={notificationMenu}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Badge color="#141843" count={9} offset={[0, 0]}>
            <Button shape="circle" icon={<BellOutlined />} />
          </Badge>
        </Dropdown>

        {/* Profile Dropdown */}
        <Dropdown overlay={profileMenu} trigger={["click"]}>
          <div className="flex items-center gap-2 cursor-pointer border border-gray-200 px-3 py-1 rounded-full">
            <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" />
            <span className="hidden sm:inline text-sm font-medium">
              Sean Smith
            </span>

            <DownOutlined className="text-xs" />
          </div>
        </Dropdown>
=======
import React from "react";
import { FaSearch, FaCommentDots, FaBell, FaChevronDown } from "react-icons/fa";

const DeshboardHeader = () => {
  return (
    <div className="w-full flex justify-between items-center p-3 bg-white border-b border-gray-200">
      {/* Left: Search */}
      <div className="flex items-center w-full max-w-sm rounded-full border border-gray-200 px-4 py-2">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
        />
      </div>

      {/* Right: Icons & Profile */}
      <div className="flex items-center gap-4 ml-4">
        {/* Chat Icon */}
        <div className="relative flex items-center justify-center w-10 h-10 border border-gray-200 rounded-full">
          <FaCommentDots className="text-black text-lg" />
          <span className="absolute -top-1 -right-1 bg-[#0b0d28] text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
            09
          </span>
        </div>

        {/* Bell Icon */}
        <div className="relative flex items-center justify-center w-10 h-10 border border-gray-200 rounded-full">
          <FaBell className="text-black text-lg" />
          <span className="absolute -top-1 -right-1 bg-[#0b0d28] text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
            09
          </span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 cursor-pointer">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-black">Sean Smith</span>
          <FaChevronDown className="text-sm text-gray-600" />
        </div>
>>>>>>> beea83cd3a90d9af67dc7d3cb750dfde7d150ec3
      </div>
    </div>
  );
};

export default DeshboardHeader;
