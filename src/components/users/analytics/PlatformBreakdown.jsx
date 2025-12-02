const platformData = [
  {
    platform: "Instagram",
    views: 68000,
    color: "#335CFF", // Primary blue
    icon: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
  },
  {
    platform: "TikTok",
    views: 72000,
    color: "#4C6FFF", // Lighter blue shade
    icon: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
  },
  {
    platform: "YouTube",
    views: 58000,
    color: "#0D132D", // Dark blue shade
    icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
  },
];

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
};

export const PlatformBreakdown = () => {
  const totalViews = platformData.reduce((acc, cur) => acc + cur.views, 0);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm w-full">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Platform Breakdown</h2>

      <div className="space-y-4">
        {platformData.map((item, idx) => {
          const percentage = ((item.views / totalViews) * 100).toFixed(1);
          return (
            <div key={idx} className="flex items-center space-x-3">
              <img src={item.icon} alt={item.platform} className="w-6 h-6" />
              <p className="w-20 text-sm text-gray-700">{item.platform}</p>

              {/* Bar */}
              <div className="flex-1 bg-gray-200 h-3 rounded-full relative">
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                  }}
                ></div>

                <span className="absolute right-1 text-[10px] text-blue-400 font-medium">
                  {percentage}%
                </span>
              </div>

              {/* Count with k/M format */}
              <p className="w-20 text-sm font-bold text-gray-800 text-right">
                {formatNumber(item.views)} Views
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

