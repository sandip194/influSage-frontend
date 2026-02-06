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
import api from "../../../api/axios";import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/auth/authSlice";
import { getSocket, resetSocket } from "../../../sockets/socket";


import NotificationDropdown from "./NotificationDropdown";
import MessageDropdown from "./MessageDropdown";
import { clearNotifications } from "../../../features/socket/notificationSlice";
import useSocketRegister from "../../../sockets/useSocketRegister";
import {
  setUnreadMessages,
  addUnreadMessage,
  removeUnreadByConversation,
} from "../../../features/socket/chatSlice";

const { Text } = Typography;

const DeshboardHeader = ({ toggleSidebar }) => {
  useSocketRegister();
  const deletedConversationsRef = React.useRef(new Set());
  const activeConversationId = useSelector(
    (state) => state.chat.activeConversationId
  );
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, role, userId } = useSelector((state) => state.auth);

  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  // const notifications = useSelector((state) => state.notifications.items);
  // const [firstNotificationOpen, setFirstNotificationOpen] = useState(true);

  const [notificationDropdownVisible, setNotificationDropdownVisible] = useState(false);
  const [messageDropdownVisible, setMessageDropdownVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // 🟢 Local state for dropdown notifications (latest 3 + mark as read)
  const [dropdownNotifications, setDropdownNotifications] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState(false);

  // const [unreadMessages, setUnreadMessages] = useState([]);
  const unreadMessages = useSelector((state) => state.chat.unreadMessages );

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [initialMessagesFetched, setInitialMessagesFetched] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const basePath = role === 1 ? "/dashboard" : "/vendor-dashboard";
  // const removeFromHeader = (conversationId) => {
  //   setUnreadMessages((prev) =>
  //     prev.filter(
  //       (m) => String(m.conversationid) !== String(conversationId)
  //     )
  //   );                               
  // };

  // ======================================================
  // LOGOUT
  // ======================================================
  const handleLogout = useCallback(() => {
    resetSocket();
    dispatch(logout());
    dispatch(clearNotifications());
    navigate("/login");
  }, [dispatch, navigate]);

  // ======================================================
  // MESSAGE LOGIC
  // ======================================================
  const refreshUnreadMessages = useCallback(async () => {
    if (!token) return;

    try {
      const res = await api.get(`/chat/unread-messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = (res.data?.data || []).map(m => ({
        ...m,
        conversationid: String(m.conver),
      }));

      const filtered = raw.filter(msg =>
        String(role) === "2"
          ? msg.readbyvendor === false
          : msg.readbyinfluencer === false
      );

      const cleaned = filtered.filter(
        msg => !deletedConversationsRef.current.has(String(msg.conversationid))
      );

      dispatch(setUnreadMessages(cleaned));
      setInitialMessagesFetched(true);
    } catch (err) {
      console.error("❌ refreshUnreadMessages failed", err);
    }
  }, [token, role]);


 useEffect(() => {
  if (!socket) return;

  const messageHandler = (payload) => {
    if (!payload?.conversationid) return;

    const conversationid = String(payload.conversationid);
    const senderId = String(payload.userid);
    const senderRole = String(payload.roleid);

    // console.log("📨 receiveMessage", {
    //   conversationid,
    //   activeConversationId,
    //   senderId,
    // });

    if ( senderId === String(userId) && senderRole === String(role) ) {
      return;
    }

    if ( activeConversationId !== null &&  String(activeConversationId) === conversationid
    ) {
      // console.log("🚫 ignored (chat open)");
      return;
    }

    dispatch(addUnreadMessage({ ...payload, conversationid }));
  };

  socket.on("receiveMessage", messageHandler);
  return () => socket.off("receiveMessage", messageHandler);
}, [socket, userId, role, activeConversationId]);




useEffect(() => {
  if (!socket) return;

  const statusHandler = (payload) => {
    // console.log("📥 updateMessageStatus RECEIVED:", payload);

    const conversationId = String(payload.conversationId);

    dispatch(removeUnreadByConversation(conversationId));
  };

  socket.on("updateMessageStatus", statusHandler);
  return () => socket.off("updateMessageStatus", statusHandler);
}, [socket]);

  useEffect(() => {
    if (!socket) return;

    const deleteHandler = ({ messageId, conversationId }) => {
      // console.log("🗑️ deleteMessage payload:", { messageId, conversationId });

      if (!conversationId) return;

      deletedConversationsRef.current.add(String(conversationId));

      dispatch(removeUnreadByConversation(activeConversationId));
    };
    socket.on("deleteMessage", deleteHandler);
    return () => socket.off("deleteMessage", deleteHandler);
  }, [socket]);
    
  useEffect(() => {
    if (!activeConversationId) return;

    // console.log("🧹 activeConversationId changed → clearing unread:", activeConversationId);

    setUnreadMessages(prev =>
      prev.filter(
        msg => String(msg.conversationid) !== String(activeConversationId)
      )
    );
  }, [activeConversationId]);


  // Fetch initial unread messages for badge
  useEffect(() => {
    refreshUnreadMessages();
  }, [refreshUnreadMessages]);


  const memoizedMessages = useMemo(() => unreadMessages, [unreadMessages]);

  // ======================================================
  // PROFILE DATA
  // ======================================================
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) return;
      try {
        const res = await api.get("/user-profile-info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.userData) setProfileData(res.data.userData);
      } catch (err) {
        console.error("Error fetching profile info:", err);
      }
    };
    fetchProfileData();
  }, [token]);
  useEffect(() => {
    if (!socket) {
      console.log("❌ HEADER socket not available");
    } else {
      console.log("🧠 HEADER socket connected:", socket.id);
    }
  }, [socket]);

  // ======================================================
  // NOTIFICATION MODAL FETCH
  // ======================================================
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get("/new/getallnotification", {
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
        <Empty
          description="No Notifications"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
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
                title={<Text strong>{item.name}</Text>}
                description={
                  <>
                    <p className="text-sm mb-1 text-gray-900">{item.message}</p>
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
    <div className="w-full flex justify-between items-center p-3 bg-white shadow-sm border-b border-gray-200">
      {/* Sidebar + Search */}
      <div className="flex items-center gap-4 w-full max-w-sm">
        <button
          className="md:hidden p-2 rounded-sm bg-gray-100 hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <MenuOutlined className="text-lg" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Messages */}
        <Dropdown
          open={messageDropdownVisible}
          onOpenChange={(open) => {
            setMessageDropdownVisible(open);

            if (open) {
              setLoadingMessages(true);
              refreshUnreadMessages().finally(() => {
                setLoadingMessages(false);
              });
            }
          }}
          placement={isMobile ? "bottom" : "bottomRight"}
          overlay={<MessageDropdown
          messages={memoizedMessages}
          loading={!initialMessagesFetched || loadingMessages}
          onOpenConversation={(id) => {

          dispatch(removeUnreadByConversation(id));


            socket?.emit("messageRead", {
              conversationId: id,
              role,
              userId,
            });

            navigate(`/chat/${id}`);
          }}
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
          trigger={["click"]}
          placement={isMobile ? "bottom" : "bottomRight"}
          getPopupContainer={(trigger) => trigger.parentElement}
          open={notificationDropdownVisible}
          onOpenChange={async (open) => {
            setNotificationDropdownVisible(open);

            if (!open) return;

            try {
              setDropdownLoading(true);
              const res = await api.get("/new/getallnotification", {
                params: { limitedData: true },
                headers: { Authorization: `Bearer ${token}` },
              });

              const formatted = (res.data?.data || []).map((item) => ({
                id: item.notificationid,
                title: item.title,
                message: item.description,
                time: item.createddate,
              }));

              setDropdownNotifications(formatted);

              dispatch(clearNotifications());

            } catch (err) {
              console.error("dropdown api failed", err);
            } finally {
              setDropdownLoading(false);
            }
          }}
          overlay={
            <NotificationDropdown
              closeDropdown={() => setNotificationDropdownVisible(false)}
              onViewAll={async () => {
                const all = await fetchNotifications();
                setDropdownNotifications(all);
                setModalOpen(true);
              }}
              notifications={dropdownNotifications}
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
