

const activities = [
  {
    date: "11 Jul, 2025",
    items: [
      {
        user: "Jane Cooper",
        avatar: "https://i.pravatar.cc/40?img=1",
        action: "Added New Files to Instagram Campaign",
        time: "05:00 PM",
      },
      {
        user: "John Doe",
        avatar: "https://i.pravatar.cc/40?img=2",
        action:
          "released a payment of $100.00 to you for the milestone Instagram Campaign",
        time: "05:00 PM",
      },
      {
        user: "John Doe",
        avatar: "https://i.pravatar.cc/40?img=3",
        action: "activated milestone Short Reel for $30.00",
        time: "05:00 PM",
      },
    ],
  },
  {
    date: "10 Jul, 2025",
    items: [
      {
        user: "Jane Cooper",
        avatar: "https://i.pravatar.cc/40?img=4",
        action: "Added New Files to Instagram Campaign",
        time: "05:00 PM",
      },
      {
        user: "John Doe",
        avatar: "https://i.pravatar.cc/40?img=5",
        action:
          "released a payment of $100.00 to you for the milestone Instagram Campaign",
        time: "05:00 PM",
      },
      {
        user: "John Doe",
        avatar: "https://i.pravatar.cc/40?img=6",
        action: "activated milestone Short Reel for $30.00",
        time: "05:00 PM",
      },
    ],
  },
];

const VendorActivity = () => {


  return (

    <div>
      {/* Activity Section */}
      <h3 className="font-semibold text-lg mb-4">Activity</h3>

      {activities.map((activity, idx) => (
        <div key={idx} className="mb-6">
          {/* Date Heading */}
          <div className="flex mb-4">
            <p className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
              {activity.date}
            </p>
          </div>

          {/* Activity Items */}
          <div className="space-y-4">
            {activity.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                {/* Avatar */}
                <img
                  src={item.avatar}
                  alt={item.user}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {/* Content */}
                <div>
                  <p className="text-gray-800 text-sm">
                    <span className="font-semibold">{item.user}</span>{" "}
                    {item.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
            <hr className="border-b border-gray-200 my-4" />
          </div>
        </div>
      ))}

    </div>

  );
};

export default VendorActivity;
