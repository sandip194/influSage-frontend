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
import { getSocket } from "../../../sockets/socket";



import NotificationDropdown from "./NotificationDropdown";
import MessageDropdown from "./MessageDropdown";

const { Text } = Typography;

const DeshboardHeader = ({ toggleSidebar }) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, role, userId } = useSelector((state) => state.auth);

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
  const [profileData, setProfileData] = useState(null);

  const [isMobile, setIsMobile] = useState(false);

  const basePath = role === 1 ? "/dashboard" : "/vendor-dashboard";

  // ======================================================
  // 🛠️ CLEAN UNIFIED NOTIFICATION API HANDLER
  // ======================================================
  const fetchNotifications = useCallback(
    async () => {
      if (!token) return;
      try {
       

        const res = await axios.get("/new/getallnotification", {
          params : {limitedData : false},
          headers: { Authorization: `Bearer ${token}` },
        });

        const rawData = res.data?.data || [];

        const formatted = rawData.map((item) => ({
          id: item.notificationid,
          title: item.title,
          message: item.description,
          isRead: item.isread,
          time: new Date(item.createddate).toLocaleString(),
        }));

       
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    },
    [token, initialNotificationsFetched]
  );

  
useEffect(() => {
  if (!socket || !token || !userId) return;

  socket.on("connect", () => {
    console.log("⚡ SOCKET CONNECTED:", socket.id);

    socket.emit("joinUserRoom", userId);
    console.log("🔗 Joined Notification Room:", `user_${userId}`);
  });

  return () => socket.off("connect");
}, [socket, token, userId]);

 useEffect(() => {
  if (!socket) return;

  const handler = (ntf) => {
    console.log("hellosocket")
    console.log("📩 REAL-TIME NOTIFICATION RECEIVED:", ntf);

    const list = Array.isArray(ntf) ? ntf : ntf ? [ntf] : [];
    if (!list.length) return;

    const formatted = list.map(n => ({
      id: n.notificationid,
      title: n.title,
      message: n.description,
      isRead: false,
      time: new Date(n.createddate).toLocaleString(),
    }));

    setUnreadNotifications(prev => [...formatted, ...prev]);
    setHasUnreadNotifications(true);
  };

  socket.on("receiveNotification", handler);

  return () => socket.off("receiveNotification", handler);
}, [socket]);



  // ======================================================
  // 🧭 LOGOUT
  // ======================================================
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  // ======================================================
  // 📨 MESSAGE LOGIC (unchanged)
  // ======================================================
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

  useEffect(() => {
    if (!token) return;
    setLoadingMessages(true);          
    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 3000);
    return () => clearInterval(interval);
  }, [token, fetchUnreadMessages]);

  const memoizedMessages = useMemo(() => unreadMessages, [unreadMessages]);

  // ======================================================
  // 🕒 POLLING UNREAD NOTIFICATIONS
  // ======================================================
  // useEffect(() => {
  //   if (!token) return;
  //   fetchNotifications({ mode: "unread" });
  // }, [token, fetchNotifications]);

  // ======================================================
  // GET ALL NOTIFICATIONS
  // ======================================================
  // useEffect(() => {
  //   if (modalOpen) {
  //     fetchNotifications({ mode: "all" });
  //   }
  // }, [modalOpen, fetchNotifications]);

  // ======================================================
  // 📜 WHEN MODAL OPENS → FETCH LAST 3 UNREAD (mark read)
  // ======================================================
  // useEffect(() => {
  //   if (notificationDropdownVisible) {
  //     fetchNotifications({ mode: "last-three" });
  //   }
  // }, [notificationDropdownVisible, fetchNotifications]);

  const memoizedNotifications = useMemo(
    () => unreadNotifications,
    [unreadNotifications]
  );

  // ======================================================
  // PROFILE DATA
  // ======================================================
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

  // ======================================================
  // MODAL CONTENT
  // ======================================================
  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? "s" : ""} ago`;
    if (diffDay === 1) return "Yesterday";
    if (diffDay < 30) return `${diffDay} days ago`;
    return date.toLocaleDateString();
  };

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
                      {formatRelativeTime(item.time)}
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

  // ======================================================
  // RESPONSIVE
  // ======================================================
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // ======================================================
  // UI RETURN (unchanged)
  // ======================================================
  return (
    <div className="w-full flex justify-between items-center p-4 bg-white shadow-sm border-b border-gray-200">
      {/* Sidebar + Search */}
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

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Messages */}
        <Dropdown
          open={messageDropdownVisible}
          onOpenChange={(open) => {
            setMessageDropdownVisible(open);
            if (open && !initialMessagesFetched) setLoadingMessages(true);
          }}
          placement={isMobile ? "bottom" : "bottomRight"}
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

        {/* Notifications */}
        <Dropdown
          open={notificationDropdownVisible}
          onOpenChange={(open) => {
            setNotificationDropdownVisible(open);
            // if (open) setHasUnreadNotifications(false);
          }}
          placement={isMobile ? "bottom" : "bottomRight"}
          trigger={["click"]}
          arrow
          overlay={
            <NotificationDropdown
              closeDropdown={() => setNotificationDropdownVisible(false)}
              onViewAll={() => setModalOpen(true)}
              onUnreadChange={setHasUnreadNotifications}
              notifications={fetchNotifications}
              loading={!initialNotificationsFetched || loadingNotifications}
            />
          }
        >
          <Badge dot={hasUnreadNotifications} color="red" offset={[-3, 3]}>
            <Button shape="circle" icon={<BellOutlined />} />
          </Badge>
        </Dropdown>

        {/* Profile */}
        <Dropdown
          menu={{
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
          }}
          trigger={["click"]}
          arrow
        >
          <div className="flex items-center gap-2 cursor-pointer border border-gray-200 px-3 py-1 rounded-full">
            <Avatar
              src={profileData?.photopath || "/default.jpg"}
              alt={profileData?.firstname}
            />
            <span className="hidden sm:inline text-sm font-medium">
              {`${profileData?.firstname || ""} ${profileData?.lastname || ""}`}
            </span>
            <DownOutlined className="text-xs" />
          </div>
        </Dropdown>
      </div>

      {/* Modal */}
      <Modal
        title="All Notifications"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={800}
        bodyStyle={{ maxHeight: "90vh", overflowY: "auto" }}
        centered
      >
        {loadingNotifications ? (
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
