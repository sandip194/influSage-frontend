import React from "react";
import { Skeleton, Empty, Typography } from "antd";
import { BellOutlined } from "@ant-design/icons";

const { Text } = Typography;

const NotificationDropdown = React.memo(
  ({ closeDropdown, onViewAll, onUnreadChange, notifications = [], loading = false }) => {
    const handleViewAll = () => {
      closeDropdown();
      onViewAll?.(notifications);
      onUnreadChange?.(false);
    };


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

      // For older dates, show month name or months ago
      const diffMonth =
        now.getMonth() -
        date.getMonth() +
        12 * (now.getFullYear() - date.getFullYear());

      if (diffMonth < 12) {
        if (diffMonth === 1) return "1 month ago";
        return `${diffMonth} months ago`;
      }

      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: now.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
      });
    };


    return (
      <div className="w-80 sm:w-80 bg-white p-4 shadow-xl rounded-2xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-[#0b0d28]">Notifications</h3>
          <button
            onClick={handleViewAll}
            className="text-sm text-[#0b0d28] font-medium hover:underline cursor-pointer"
            disabled={loading}
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
                  <BellOutlined style={{ fontSize: "18px" }} />
                </div>
                <div>
                  <Text strong className="text-sm">{notification.title}</Text>
                  <p className="text-xs">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {formatRelativeTime(notification.time)}
                  </p>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
  // Optional: custom comparison for better control
  (prevProps, nextProps) => {
    return (
      prevProps.loading === nextProps.loading &&
      JSON.stringify(prevProps.notifications) === JSON.stringify(nextProps.notifications)
    );
  }
);

export default NotificationDropdown;
