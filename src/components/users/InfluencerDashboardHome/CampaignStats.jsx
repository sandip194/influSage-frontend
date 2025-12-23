import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiLoopLeftLine, RiGroupLine, RiUserFollowLine, RiCheckboxCircleLine } from "@remixicon/react";
import { useSelector } from "react-redux";
import { Skeleton } from "antd";

const CampaignStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const authToken = token || localStorage.getItem("token");
        const response = await axios.get(`/user/dashboard/counts`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const data = response.data?.data;
        const formattedStats = [
        {
          label: "In-Progress Campaigns",
          value: data.inprogresscampaign ?? 0,
          icon: <RiLoopLeftLine className="text-white text-xl" />,
        },
        {
          label: "Total Campaigns Participated",
          value: data.totalcampaignsparticipated ?? 0,
          icon: <RiGroupLine className="text-white text-xl" />,
        },
        {
          label: "Participation Rate",
          value: `${data.participationrate ?? 0}%`,
          icon: <RiUserFollowLine className="text-white text-sm" />,
        },
        {
          label: "Completion Rate",
          value: `${data.completionrate ?? 0}%`,
          icon: <RiCheckboxCircleLine className="text-white text-sm" />,
        },
      ];
        setStats(formattedStats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="rounded-2xl h-full flex flex-col gap-4">
        {[1, 2].map((_, idx) => (
          <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-2xl">
            <Skeleton.Avatar active size={40} shape="circle" />
            <div className="flex-1 flex flex-col gap-1">
              <Skeleton.Input active size="small" style={{ width: '50%' }} />
              <Skeleton.Input active size="default" style={{ width: '30%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
  <div className="bg-white rounded-xl p-3 w-full h-full flex flex-col">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
      {stats.map(({ label, value, icon }, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 bg-gray-50 rounded-md px-3 py-2"
        >
          <div className="bg-[#0D132D] rounded-full p-2 shrink-0">
            {React.cloneElement(icon, { className: "text-sm text-white" })}
          </div>

          <div className="leading-tight">
            <p className="text-[11px] text-gray-500 font-medium truncate">
              {label}
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

};

export default CampaignStats;
