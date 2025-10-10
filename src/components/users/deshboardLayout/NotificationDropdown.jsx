import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Skeleton,
  Empty,
  Typography,
} from 'antd';
import { BellOutlined } from '@ant-design/icons';

const { Text } = Typography;

const NotificationDropdown = ({ closeDropdown, onViewAll }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.auth);

  const getAllNotification = async () => {
    try {
      setLoading(true);
      const res = await axios.get('new/getallnotification', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data?.data || [];

      const formatted = data.map((item) => ({
        id: item.notificationid,
        title: item.title,
        message: item.description,
        time: new Date(item.createddate).toLocaleString(),
      }));

      setNotifications(formatted);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch only when dropdown mounts (i.e., opens)
  useEffect(() => {
    getAllNotification();
  }, []); // Empty dependency: Runs once per mount

  const handleViewAll = () => {
    closeDropdown(); // Close dropdown immediately for better UX
    // Pass data to parent to open Modal
    if (onViewAll) {
      onViewAll(notifications);
    }
  };

  return (
    <div className="w-64 sm:w-80 bg-white p-4 shadow-xl rounded-2xl">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-[#0b0d28]">Notifications</h3>
        <button
          onClick={handleViewAll}
          className="text-sm text-[#0b0d28] font-medium hover:underline cursor-pointer"
          disabled={loading} // Disable while loading
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 items-start">
              <Skeleton.Avatar active size="large" shape="circle" />
              <Skeleton active title={false} paragraph={{ rows: 2, width: ['80%', '60%'] }} />
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex justify-center py-5">
          <Empty description="No Notifications" />
        </div>
      ) : (
        <div className="space-y-2 divide-y divide-gray-200">
          {notifications.slice(0, 3).map((notification) => (
            <div key={notification.id} className="flex items-start gap-3 py-2">
              <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                <BellOutlined style={{ fontSize: '18px' }} />
              </div>
              <div>
                <Text strong className="text-sm">{notification.title}</Text>
                <p className="text-xs">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
