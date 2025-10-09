import React from 'react';
import {
  BellOutlined,
  MessageOutlined,
  SearchOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import {
  Dropdown,
  Input,
  Avatar,
  Badge,
  Menu,
  Button,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../features/auth/authSlice';

import NotificationDropdown from './NotificationDropdown';
import MessageDropdown from './MessageDropdown';

const DeshboardHeader = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);

  const basePath = role === 1 ? '/dashboard' : '/vendor-dashboard';

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const profileMenu = (
    <Menu
      items={[
        {
          key: "1",
          icon: <UserOutlined />,
          label: <Link to={`${basePath}/my-profile`}>My Profile</Link>,
        },
        {
          key: "2",
          icon: <SettingOutlined />,
          label:  <Link to={`${basePath}/settings`}>Settings</Link>,
        },
        {
          key: "3",
          icon: <LogoutOutlined />,
          label: "Logout",
          danger: true,
          onClick: handleLogout,
        },
      ]}
    />
  );

  const notificationMenu = <NotificationDropdown />;
  const messageMenu = <MessageDropdown />;

  return (
    <div className="w-full flex justify-between items-center p-4 bg-white shadow-sm border-b border-gray-200">

      {/* Left side: Hamburger + Search */}
      <div className="flex items-center gap-4 w-full max-w-sm">
        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-sm bg-gray-100 hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <MenuOutlined className="text-lg" />
        </button>

        {/* Search (hidden on mobile) */}
        <div className="hidden sm:block flex-1">
          <Input
            size="large"
            prefix={<SearchOutlined />}
            placeholder=" Search"
          />
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4">
        <Dropdown overlay={messageMenu} placement="bottomRight" trigger={["click"]}>
          <Badge color="#141843" count={4} offset={[0, 0]}>
            <Button shape="circle" icon={<MessageOutlined />} />
          </Badge>
        </Dropdown>

        <Dropdown overlay={notificationMenu} placement="bottomRight" trigger={["click"]}>
          <Badge color="#141843" count={9} offset={[0, 0]}>
            <Button shape="circle" icon={<BellOutlined />} />
          </Badge>
        </Dropdown>

        {/* Profile Dropdown */}
        <Dropdown overlay={profileMenu} trigger={["click"]}>
          <div className="flex items-center gap-2 cursor-pointer border border-gray-200 px-3 py-1 rounded-full">
            <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" />
            <span className="hidden sm:inline text-sm font-medium">Sean Smith</span>
            <DownOutlined className="text-xs" />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default DeshboardHeader;
