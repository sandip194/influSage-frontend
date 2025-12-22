import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiLoopLeftLine, RiCheckLine, RiMailAddLine, RiMailSendLine, RiGroupLine } from "@remixicon/react";
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
          label: "Completed Campaigns",
          value: data.completedcampaign ?? 0,
          icon: <RiCheckLine className="text-white text-xl" />,
        },
        {
          label: "Applied Campaigns",
          value: data.appliedcampaigncount ?? 0,
          icon: <RiMailSendLine className="text-white text-xl" />,
        },
        {
          label: "Invited Campaigns",
          value: data.invitedcampaigncount ?? 0,
          icon: <RiMailAddLine className="text-white text-xl" />,
        },
        {
          label: "Total Campaigns Participated",
          value: data.totalcampaignsparticipated ?? 0,
          icon: <RiGroupLine className="text-white text-xl" />,
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
    <div className="bg-white rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {stats.map(({ label, value, icon }, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 bg-gray-50 rounded-xl p-4"
        >
          <div className="w-12 h-12 bg-[#0D132D] flex items-center justify-center rounded-lg text-white">
            {icon}
          </div>

          <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampaignStats;
