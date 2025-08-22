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
import { Link } from "react-router-dom";

import NotificationDropdown from "./NotificationDropdown";
import MessageDropdown from "./MessageDropdown";

const { Search } = Input;

const profileMenu = (
  <Menu
    items={[  
      {
        key: "1",
        icon: <UserOutlined />,
         label: (
          <Link to="/dashboard/profile">
            My Profile
          </Link>
    ),
      },
      {
        key: "2",
        icon: <SettingOutlined />,
        label: (
          <Link to="/dashboard/setting">
            Settings
          </Link>
    ),
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
      </div>
    </div>
  );
};

export default DeshboardHeader;
