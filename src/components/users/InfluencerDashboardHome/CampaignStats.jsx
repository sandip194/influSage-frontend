import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiCheckLine, RiLoopLeftLine } from "@remixicon/react";
import { useSelector } from "react-redux";

const CampaignStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const authToken = token || localStorage.getItem("token");

        const response = await axios.get(`/user/dashboard/counts`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        const data = response.data?.data;

        const formattedStats = [
          {
            label: "In-Progress Campaigns",
            value: data.inprogresscampaign,
            icon: <RiLoopLeftLine />,
          },
          {
            label: "Completed Campaigns",
            value: data.completedcampaign,
            icon: <RiCheckLine />,
          },
        ];

        setStats(formattedStats);
      } catch (error) {
        console.error("Error fetching influencer dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading campaign stats...</p>
      </div>
    );
  }

return (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
    {stats.map(({ label, value, icon }, idx) => (
      <div
        key={idx}
        className=" bg-white p-4 rounded-xl flex items-center gap-3"
      >
        {/* Icon circle */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0D132D] text-white text-base flex-shrink-0">
          {icon}
        </div>

        {/* Label and Value */}
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

export default CampaignStats;
