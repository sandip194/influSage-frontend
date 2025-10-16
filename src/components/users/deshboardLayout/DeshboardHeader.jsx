import React, { useState } from 'react';
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
  Modal,
  List,
  Typography,
  Empty,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../features/auth/authSlice';

import NotificationDropdown from './NotificationDropdown';
import MessageDropdown from './MessageDropdown';

const { Text } = Typography;

const DeshboardHeader = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notificationDropdownVisible, setNotificationDropdownVisible] = useState(false);
  const [messageDropdownVisible, setMessageDropdownVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]); // Store notifications for Modal

  const { role, name } = useSelector((state) => state.auth);
  const basePath = role === 1 ? '/dashboard' : '/vendor-dashboard';

  const handleOpenModal = (notifData) => {
    setNotifications(notifData); // Store the fetched data
    setNotificationDropdownVisible(false); // Close dropdown
    setModalOpen(true); // Open Modal
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const profileMenu = {
    items: [
      {
        key: "1",
        icon: <UserOutlined />,
        label: <Link to={`${basePath}/my-profile`}>My Profile</Link>,
      },
      {
        key: "2",
        icon: <SettingOutlined />,
        label: <Link to={`${basePath}/settings`}>Settings</Link>,
      },
      {
        key: "3",
        icon: <LogoutOutlined />,
        label: "Logout",
        danger: true,
        onClick: handleLogout,
      },
    ],
  };

  // Modal content (similar to previous drawer, but scrollable)
  const modalContent = (
    <>
      {notifications.length === 0 ? (
        <Empty description="No Notifications" />
      ) : (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={
                  <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                    <BellOutlined style={{ fontSize: '18px' }} />
                  </div>
                }
                title={<Text strong>{item.title}</Text>}
                description={
                  <>
                    <p className="text-sm mb-1">{item.message}</p>
                    <Text type="secondary" className="text-xs">
                      {item.time}
                    </Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </>
  );

  return (
    <div className="w-full flex justify-between items-center p-4 bg-white shadow-sm border-b border-gray-200">
      {/* Left side: Hamburger + Search */}
      <div className="flex items-center gap-4 w-full max-w-sm">
        <button
          className="md:hidden p-2 rounded-sm bg-gray-100 hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <MenuOutlined className="text-lg" />
        </button>

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
        {/* Message Dropdown */}
        <Dropdown
          open={messageDropdownVisible}
          onOpenChange={(open) => setMessageDropdownVisible(open)}
          placement="bottomRight"
          overlay={<MessageDropdown closeDropdown={() => setMessageDropdownVisible(false)} />}
          trigger={['click']}
          arrow
        >
          <Badge color="#141843" count={4} offset={[0, 0]}>
            <Button shape="circle" icon={<MessageOutlined />} />
          </Badge>
        </Dropdown>

        {/* Notification Dropdown */}
        <Dropdown
          open={notificationDropdownVisible}
          onOpenChange={(open) => setNotificationDropdownVisible(open)}
          placement="bottomRight"
          trigger={['click']}
          arrow
          overlay={
            <NotificationDropdown
              closeDropdown={() => setNotificationDropdownVisible(false)}
              onViewAll={handleOpenModal} // Callback to open Modal with data
            />
          }
        >
          <Badge color="#141843" count={4} offset={[0, 0]}>
            <Button shape="circle" icon={<BellOutlined />} />
          </Badge>
        </Dropdown>

        {/* Profile Dropdown */}
        <Dropdown menu={profileMenu} trigger={['click']} arrow>
          <div className="flex items-center gap-2 cursor-pointer border border-gray-200 px-3 py-1 rounded-full">
            <Avatar src="https://api.dicebear.com/5.x/bottts/svg?seed=12345" />
            <span className="hidden sm:inline text-sm font-medium">{name}</span>
            <DownOutlined className="text-xs" />
          </div>
        </Dropdown>
      </div>

      {/* Scrollable Modal (renders independently) */}
      <Modal
        title="All Notifications"
        open={modalOpen}
        onCancel={handleCloseModal}
        footer={null} // No default footer
        width={1000} // Adjust as needed
        bodyStyle={{ maxHeight: '90vh', overflowY: 'auto' }} // Scrollable body
        centered // Optional: Center the modal
      >
        {modalContent}
      </Modal>
    </div>
  );
};

export default DeshboardHeader;
