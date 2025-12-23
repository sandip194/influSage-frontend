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

const CampaignStatsVendor = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const authToken = token || localStorage.getItem("token");

        const response = await axios.get(`vendor/dashboard/performancesummary`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const data = response.data?.Data;
        const formattedStats = [
          {
            label: "Total Campaigns",
            value: data.totalcampaigncount,
            icon: <RiStackLine />,
          },
          {
            label: "Active Campaigns",
            value: data.totalactivecampaigncount,
            icon: <RiLoopLeftLine />,
          },
          {
            label: "Completed Campaigns",
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
      <div className="bg-white p-6 rounded-2xl flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading statistics...</p>
      </div>
    );
  }

    return (
  <div className="bg-white rounded-xl p-3 w-full h-full flex flex-col">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
        {stats.map(({ label, value, icon }, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
          >
            {/* Icon */}
            <div className="w-9 h-9 bg-[#0D132D] rounded-full flex items-center justify-center shrink-0">
              {React.cloneElement(icon, {
                className: "text-white text-sm",
              })}
            </div>

            {/* Text */}
            <div className="leading-tight">
              <p className="text-xs text-gray-500 font-medium">
                {label}
              </p>
              <p className="text-base font-semibold text-gray-900">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignStatsVendor;
