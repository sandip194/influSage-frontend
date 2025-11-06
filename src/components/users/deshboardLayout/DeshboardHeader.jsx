import React, { useState, useEffect } from 'react';
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
  Button,
  Modal,
  List,
  Typography,
  Empty,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const { token, role, name } = useSelector((state) => state.auth);
  const basePath = role === 1 ? '/dashboard' : '/vendor-dashboard';

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    if (!token) return;

    const fetchUnreadMessages = async () => {
      try {
        const res = await axios.get(`/chat/unread-messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnreadMessages(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching unread messages:", err);
      }
    };

    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 3000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const getAllNotification = async () => {
    if (!token) return;
    try {
      setLoadingNotifications(true);
      const res = await axios.get("new/getallnotification", {
        params: { limitedData },
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data || [];
      const formatted = data.map((item) => ({
        id: item.notificationid,
        title: item.title,
        message: item.description,
        isRead: item.isread,
        time: new Date(item.createddate).toLocaleString(),
      }));

      setNotifications(formatted);
      setHasUnreadNotifications(formatted.some((n) => !n.isRead));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

    getAllNotification();
    const interval = setInterval(getAllNotification, 3000);
    return () => clearInterval(interval);
  }, [token]);

  const profileMenu = {
    items: [
      {
        key: "1",
        icon: <UserOutlined />,
        label: "My Profile",
        onClick: () => navigate(`/my-profile`),
      },
      {
        key: "2",
        icon: <SettingOutlined />,
        label: "Settings",
        onClick: () => navigate(`setting`),
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

  const modalContent = notifications.length === 0 ? (
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
  );

  return (
    <div className="w-full flex justify-between items-center p-4 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center gap-4 w-full max-w-sm">
        <button
          className="md:hidden p-2 rounded-sm bg-gray-100 hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <MenuOutlined className="text-lg" />
        </button>

        <div className="hidden sm:block flex-1">
          <Input size="large" prefix={<SearchOutlined />} placeholder=" Search" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Dropdown
          open={messageDropdownVisible}
          onOpenChange={(open) => {
            setMessageDropdownVisible(open);
            if (open) setUnreadMessages([]); // mark as read visually
          }}
          placement="bottomRight"
          overlay={<MessageDropdown messages={unreadMessages} />}
          trigger={["click"]}
          arrow
        >
          <Badge dot={unreadMessages.length > 0} color="red" offset={[-3, 3]}>
            <Button shape="circle" icon={<MessageOutlined />} />
          </Badge>
        </Dropdown>

        <Dropdown
          open={notificationDropdownVisible}
          onOpenChange={(open) => {
            setNotificationDropdownVisible(open);
            if (open) setHasUnreadNotifications(false);
          }}
          placement="bottomRight"
          trigger={["click"]}
          arrow
          overlay={
            <NotificationDropdown
              closeDropdown={() => setNotificationDropdownVisible(false)}
              onViewAll={() => setModalOpen(true)}
              onUnreadChange={setHasUnreadNotifications}
              notifications={notifications}
              loading={loadingNotifications}
            />
          }
        >
          <Badge dot={hasUnreadNotifications} color="red" offset={[-3, 3]}>
            <Button shape="circle" icon={<BellOutlined />} />
          </Badge>
        </Dropdown>

        {/* 👤 Profile */}
        <Dropdown menu={profileMenu} trigger={['click']} arrow>
          <div className="flex items-center gap-2 cursor-pointer border border-gray-200 px-3 py-1 rounded-full">
            <Avatar src="https://api.dicebear.com/5.x/bottts/svg?seed=12345" />
            <span className="hidden sm:inline text-sm font-medium">{name}</span>
            <DownOutlined className="text-xs" />
          </div>
        </Dropdown>
      </div>

      <Modal
        title="All Notifications"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={800}
        bodyStyle={{ maxHeight: '90vh', overflowY: 'auto' }}
        centered
      >
        {modalContent}
      </Modal>
    </div>
  );
};

export default DeshboardHeader;
