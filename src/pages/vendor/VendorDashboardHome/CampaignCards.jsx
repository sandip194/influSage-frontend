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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map(({ label, value, icon }, idx) => (
        <div
          key={idx}
          className="bg-white p-4 rounded-xl flex items-center gap-3"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0D132D] text-white text-base flex-shrink-0">
            {icon}
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-[#0D132D] font-medium">{label}</p>
            <p className="text-lg font-bold text-gray-800">
              {Number(value).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampaignStatsVendor;
