import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  RiStackLine,
  RiGiftLine,
  RiWalletLine,
  RiCheckLine,
  RiLoopLeftLine,
} from "@remixicon/react";
import { useSelector } from "react-redux";
import { Skeleton } from "antd";

const CampaignStatsVendor = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const authToken = token || localStorage.getItem("token");

        const response = await axios.get(
          `vendor/dashboard/performancesummary`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        const data = response.data?.Data;
        const formattedStats = [
          {
            label: "Total Campaigns",
            value: data.totalcampaigncount,
            icon: <RiStackLine />,
          },
          {
            label: "Active",
            value: data.totalactivecampaigncount,
            icon: <RiLoopLeftLine />,
          },
          {
            label: "Completed",
            value: data.totalcompletedcampaigncount,
            icon: <RiCheckLine />,
          },
          {
            label: "Total Applications",
            value: data.totalapplicationcount,
            icon: <RiGiftLine />,
          },
        ];

        setStats(formattedStats);
      } catch (error) {
        console.error("Error fetching vendor performance stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 w-full h-full flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Campaign Statistics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
          {[1, 2, 3, 4].map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
            >
              {/* Icon skeleton */}
              <Skeleton.Avatar active size={48} shape="circle" />

              {/* Text skeletons */}
              <div className="flex-1 space-y-1">
                <Skeleton.Input active size="small" style={{ width: 120 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 w-full h-full flex flex-col">
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        Campaign Statistics
      </h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
        {stats.map(({ label, value, icon }, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
          >
            {/* Icon */}
            <div className="w-12 h-12 bg-[#0D132D] rounded-full flex items-center justify-center shrink-0">
              {React.cloneElement(icon, {
                className: "text-white text-sm",
              })}
            </div>

            {/* Text */}
            <div className="leading-tight">
              <p className="text-gray-500 font-semibold">{label}</p>
              <p className="text-xl font-bold text-[#0D132D]">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignStatsVendor;
