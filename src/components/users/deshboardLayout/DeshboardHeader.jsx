import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  BellOutlined,
  MessageOutlined,
  SearchOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
  MenuOutlined,
} from "@ant-design/icons";
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
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/auth/authSlice";

import NotificationDropdown from "./NotificationDropdown";
import MessageDropdown from "./MessageDropdown";

const { Text } = Typography;

const DeshboardHeader = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, role, name } = useSelector((state) => state.auth);

  const [notificationDropdownVisible, setNotificationDropdownVisible] = useState(false);
  const [messageDropdownVisible, setMessageDropdownVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [initialNotificationsFetched, setInitialNotificationsFetched] = useState(false);

  const [unreadMessages, setUnreadMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [initialMessagesFetched, setInitialMessagesFetched] = useState(false);

  const basePath = role === 1 ? "/dashboard" : "/vendor-dashboard";

  // ✅ Memoized logout handler
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  // 📨 Fetch unread messages
  const fetchUnreadMessages = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`/chat/unread-messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newData = res.data?.data || [];

      setUnreadMessages((prev) => {
        const prevStr = JSON.stringify(prev);
        const newStr = JSON.stringify(newData);
        return prevStr !== newStr ? newData : prev;
      });

      if (!initialMessagesFetched) setInitialMessagesFetched(true);
    } catch (err) {
      console.error("Error fetching unread messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  }, [token, initialMessagesFetched]);

  // ⏱️ Poll messages every 3s
  useEffect(() => {
    if (!token) return;
    setLoadingMessages(true);
    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 3000);
    return () => clearInterval(interval);
  }, [token, fetchUnreadMessages]);

  const memoizedMessages = useMemo(() => unreadMessages, [unreadMessages]);

  // 🔔 Fetch only unread notifications (polling)
  const fetchUnreadNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get("/new/getallnotification", {
        params: { limitedData: null },
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = res.data?.data || [];
      data = data.filter((item) => item.isread === false);

      const formatted = data.map((item) => ({
        id: item.notificationid,
        title: item.title,
        message: item.description,
        isRead: item.isread,
        time: new Date(item.createddate).toLocaleString(),
      }));

      setUnreadNotifications((prev) => {
        const prevStr = JSON.stringify(prev);
        const newStr = JSON.stringify(formatted);
        return prevStr !== newStr ? formatted : prev;
      });

      setHasUnreadNotifications(formatted.length > 0);
      if (!initialNotificationsFetched) setInitialNotificationsFetched(true);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
    }
  }, [token, initialNotificationsFetched]);

  // 📜 Fetch all notifications (modal)
  const fetchAllNotifications = useCallback(async () => {
    if (!token) return;
    setLoadingNotifications(true);
    try {
      const res = await axios.get("/new/getallnotification", {
        params: { limitedData: false },
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

      setAllNotifications(formatted);
    } catch (error) {
      console.error("Error fetching all notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }, [token]);

  // ⏱️ Poll unread notifications every 3s
  useEffect(() => {
    if (!token) return;
    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 3000);
    return () => clearInterval(interval);
  }, [token, fetchUnreadNotifications]);

  // 🧭 Fetch all notifications when modal opens
  useEffect(() => {
    if (modalOpen) fetchAllNotifications();
  }, [modalOpen, fetchAllNotifications]);

  const memoizedNotifications = useMemo(() => unreadNotifications, [unreadNotifications]);

  // ⚙️ Profile menu
  const profileMenu = useMemo(
    () => ({
      items: [
        {
          key: "1",
          icon: <UserOutlined />,
          label: "My Profile",
          onClick: () => navigate(`${basePath}/my-profile`),
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
    }),
    [basePath, handleLogout, navigate]
  );

  // 🧾 Modal content
  const modalContent = useMemo(
    () =>
      allNotifications.length === 0 ? (
        <Empty description="No Notifications" />
      ) : (
        <List
          dataSource={allNotifications}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={
                  <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                    <BellOutlined style={{ fontSize: "18px" }} />
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
      ),
    [allNotifications]
  );

  return (
    <div className="w-full flex justify-between items-center p-4 bg-white shadow-sm border-b border-gray-200">
      {/* Sidebar toggle + search */}
      <div className="flex items-center gap-4 w-full max-w-sm">
        <button
          className="md:hidden p-2 rounded-sm bg-gray-100 hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <MenuOutlined className="text-lg" />
        </button>

        <div className="hidden sm:block flex-1">
          <Input size="large" prefix={<SearchOutlined />} placeholder="Search" />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* 📨 Message Dropdown */}
        <Dropdown
          open={messageDropdownVisible}
          onOpenChange={(open) => {
            setMessageDropdownVisible(open);
            if (open && !initialMessagesFetched) setLoadingMessages(true);
          }}
          placement="bottomRight"
          overlay={
            <MessageDropdown
              messages={memoizedMessages}
              loading={!initialMessagesFetched || loadingMessages}
            />
          }
          trigger={["click"]}
          arrow
        >
          <Badge dot={memoizedMessages.length > 0} color="red" offset={[-3, 3]}>
            <Button shape="circle" icon={<MessageOutlined />} />
          </Badge>
        </Dropdown>

        {/* 🔔 Notification Dropdown */}
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
              notifications={memoizedNotifications}
              loading={!initialNotificationsFetched || loadingNotifications}
            />
          }
        >
          <Badge dot={hasUnreadNotifications} color="red" offset={[-3, 3]}>
            <Button shape="circle" icon={<BellOutlined />} />
          </Badge>
        </Dropdown>

        {/* 👤 Profile */}
        <Dropdown menu={profileMenu} trigger={["click"]} arrow>
          <div className="flex items-center gap-2 cursor-pointer border border-gray-200 px-3 py-1 rounded-full">
            <Avatar src="https://api.dicebear.com/5.x/bottts/svg?seed=12345" />
            <span className="hidden sm:inline text-sm font-medium">{name}</span>
            <DownOutlined className="text-xs" />
          </div>
        </Dropdown>
      </div>

      {/* 📜 Notifications Modal */}
      <Modal
        title="All Notifications"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={800}
        bodyStyle={{ maxHeight: "90vh", overflowY: "auto" }}
        centered
      >
        {loadingNotifications && allNotifications.length === 0 ? (
          <div className="flex justify-center py-5">
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        ) : (
          modalContent
        )}
      </Modal>
    </div>
  );
};

export default DeshboardHeader;
