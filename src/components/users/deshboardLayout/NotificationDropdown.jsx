import React from 'react';

const notifications = [
  {
    id: 1,
    name: "Brooklyn Simmons",
    message: "recommended this shop...",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    time: "5 Mins Ago",
  },
  {
    id: 2,
    name: "Sophia Williams",
    message: "invites you ABC.fig file with you",
    avatar: "https://randomuser.me/api/portraits/women/30.jpg",
    time: "5 Mins Ago",
  },
  {
    id: 3,
    name: "Brooklyn Simmons",
    message: "recommended this shop...",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    time: "5 Mins Ago",
  },
  {
    id: 4,
    name: "Sophia Williams",
    message: "invites you ABC.fig file with you",
    avatar: "https://randomuser.me/api/portraits/men/40.jpg",
    time: "5 Mins Ago",
  },
];

const NotificationDropdown = () => {
  return (
    <div className="w-64 sm:w-80 bg-white p-4 shadow-lg rounded-3xl mt-5"
    style={{
        right: "-43px",
        position: "absolute",
      }}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-[#0b0d28]">Notifications</h3>
        <button className="text-sm text-[#0b0d28] font-medium hover:underline cursor-pointer">View All</button>
      </div>

      <div className="space-y-4 divide-y divide-gray-200">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start gap-3 py-1">
            <img
              src={notification.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm">
                <span className="font-semibold">{notification.name}</span>{" "}
                {notification.message}
              </p>
              <span className="text-xs text-gray-400">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default NotificationDropdown;
