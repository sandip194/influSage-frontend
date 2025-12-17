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
import { clearNotifications } from "../../../features/socket/notificationSlice";

const { Text } = Typography;

const DeshboardHeader = ({ toggleSidebar }) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, role, userId } = useSelector((state) => state.auth);
  const activeChat = useSelector((state) => state.chat.activeChat);

  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const notifications = useSelector((state) => state.notifications.items);

  const [notificationDropdownVisible, setNotificationDropdownVisible] = useState(false);
  const [messageDropdownVisible, setMessageDropdownVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // 🟢 Local state for dropdown notifications (latest 3 + mark as read)
  const [dropdownNotifications, setDropdownNotifications] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState(false);

  const [unreadMessages, setUnreadMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [initialMessagesFetched, setInitialMessagesFetched] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const basePath = role === 1 ? "/dashboard" : "/vendor-dashboard";

  // ======================================================
  // LOGOUT
  // ======================================================
  const handleLogout = useCallback(() => {
    dispatch(logout());
    dispatch(clearNotifications());
    navigate("/login");
  }, [dispatch, navigate]);

  // ======================================================
  // MESSAGE LOGIC
  // ======================================================
  useEffect(() => {
  if (!token) return;

  const fetchOnce = async () => {
    try {
      console.log("📡 Fetching unread messages API...");
      setLoadingMessages(true);

      const res = await axios.get(`/chat/unread-messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📦 RAW unread API response:", res.data);

      const raw = (res.data?.data || []).map((m) => ({
        ...m,
        conversationid: String(m.conver),
      }));


      console.log("👤 ROLE:", role);
      console.log("📋 RAW unread list:", raw);

      const filtered = raw.filter((msg) => {
        if (String(role) === "2") {
          console.log(
            "🧪 vendor check →",
            msg.conver,
            "readbyvendor:",
            msg.readbyvendor
          );
          return msg.readbyvendor === false;
        }
        console.log(
          "🧪 influencer check →",
          msg.conver,
          "readbyinfluencer:",
          msg.readbyinfluencer
        );
        return msg.readbyinfluencer === false;
      });

      console.log("✅ FILTERED unread list:", filtered);
      setUnreadMessages(filtered);
      setInitialMessagesFetched(true);
    } catch (err) {
      console.error("❌ unread API error:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  fetchOnce();
}, [token, role]);

 useEffect(() => {
  if (!socket) return;

  const messageHandler = (rawPayload) => {
    console.log("📩 RAW socket payload:", rawPayload);

    // 🔥 NORMALIZE PAYLOAD
    const payload = {
      conversationid:
        rawPayload.conversationid ??
        rawPayload.conversationId ??
        rawPayload.conver,

      userid:
        rawPayload.userid ??
        rawPayload.senderId ??
        rawPayload.userId,

      message:
        rawPayload.message ??
        rawPayload.content,

      readbyvendor: rawPayload.readbyvendor,
      readbyinfluencer: rawPayload.readbyinfluencer,
      createddate: rawPayload.createddate,
      userphoto: rawPayload.userphoto,
      campaignphoto: rawPayload.campaignphoto,
    };

    console.log("🔁 NORMALIZED payload:", payload);

    if (!payload.conversationid) {
      console.log("❌ Still invalid after normalize");
      return;
    }

    console.log("👤 Role:", role, "UserId:", userId);

    // Ignore own message
    if (String(payload.userid) === String(userId)) {
      console.log("⏭️ Own message ignored");
      return;
    }

    // Ignore if chat open
    if (
      String(activeChat?.id) ===
      String(payload.conversationid)
    ) {
      console.log("👁️ Chat open → no unread");
      return;
    }

    // 🔥 READ FLAG FILTER
    if (String(role) === "2" && payload.readbyvendor === true) {
      console.log("❌ Vendor already read → skip");
      return;
    }

    if (String(role) === "1" && payload.readbyinfluencer === true) {
      console.log("❌ Influencer already read → skip");
      return;
    }

    console.log("✅ ADDING unread message");

    setUnreadMessages((prev) => {
      const exists = prev.some(
        (m) =>
          String(m.conversationid) ===
          String(payload.conversationid)
      );

      if (exists) {
        console.log("⚠️ Duplicate unread skipped");
        return prev;
      }
    });
  };

  socket.on("receiveMessage", messageHandler);
  return () => socket.off("receiveMessage", messageHandler);
}, [socket, role, userId, activeChat]);


useEffect(() => {
  if (!socket) return;

  const statusHandler = ({
    conversationId,
    readbyvendor,
    readbyinfluencer,
  }) => {
    console.log("📡 updateMessageStatus", {
      conversationId,
      readbyvendor,
      readbyinfluencer,
      role,
    });

    // CLEAR ONLY FOR THE USER WHO READ
    if (
  (String(role) === "2" && readbyvendor === true) ||
  (String(role) === "1" && readbyinfluencer === true)
) {
  setUnreadMessages((prev) =>
    prev.filter(
      (msg) =>
        String(msg.conversationid) !==
        String(conversationId)
    )
  );
}
  };

  socket.on("updateMessageStatus", statusHandler);
  return () =>
    socket.off("updateMessageStatus", statusHandler);
}, [socket, role]);



  const memoizedMessages = useMemo(() => unreadMessages, [unreadMessages]);

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
        if (res.data?.userData) setProfileData(res.data.userData);
      } catch (err) {
        console.error("Error fetching profile info:", err);
      }
    };
    fetchProfileData();
  }, [token]);

  // ======================================================
  // NOTIFICATION MODAL FETCH
  // ======================================================
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get("/new/getallnotification", {
        params: { limitedData: false },
        headers: { Authorization: `Bearer ${token}` },
      });

      return (res.data?.data || []).map((item) => ({
        id: item.notificationid,
        title: item.title,
        message: item.description,
        isRead: item.isread,
        time: item.createddate,
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  }, [token]);

  // ======================================================
  // MODAL CONTENT
  // ======================================================
  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
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
      dropdownNotifications.length === 0 ? (
        <Empty description="No Notifications" />
      ) : (
        <List
          dataSource={dropdownNotifications}
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
    [dropdownNotifications]
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
  // UI RETURN
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
          overlay={<MessageDropdown messages={memoizedMessages} loading={!initialMessagesFetched || loadingMessages} />}
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
          onOpenChange={async (open) => {
            setNotificationDropdownVisible(open);

            if (open && unreadCount > 0) {
              setDropdownLoading(true);
              try {
                const res = await axios.get("/new/getallnotification", {
                  params: { limitedData: true }, // ✅ marks these as read
                  headers: { Authorization: `Bearer ${token}` },
                });

                const formatted = (res.data?.data || []).map((item) => ({
                  id: item.notificationid,
                  title: item.title,
                  message: item.description,
                  time: item.createddate,
                }));

                setDropdownNotifications(formatted);
              } catch (err) {
                console.error("Error fetching dropdown notifications:", err);
              } finally {
                setDropdownLoading(false);
              }
            }
          }}
          placement={isMobile ? "bottom" : "bottomRight"}
          trigger={["click"]}
          arrow
          overlay={
            <NotificationDropdown
              closeDropdown={() => setNotificationDropdownVisible(false)}
              onViewAll={async () => {
                const allNtf = await fetchNotifications();
                setDropdownNotifications(allNtf);
                setModalOpen(true);
              }}
              notifications={dropdownNotifications.length > 0 ? dropdownNotifications : notifications}
              loading={dropdownLoading}
            />
          }
        >
          <Badge dot={unreadCount > 0} color="red" offset={[-3, 3]}>
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
            <Avatar src={profileData?.photopath || "/default.jpg"} alt={profileData?.firstname} />
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
        {dropdownLoading ? (
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
