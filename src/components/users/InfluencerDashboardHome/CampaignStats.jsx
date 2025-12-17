import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiCheckLine, RiLoopLeftLine } from "@remixicon/react";
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
          { label: "In-Progress Campaigns", value: data.inprogresscampaign, icon: <RiLoopLeftLine /> },
          { label: "Completed Campaigns", value: data.completedcampaign, icon: <RiCheckLine /> },
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
    <div className="rounded-2xl h-full flex flex-col gap-4">
      {stats.map(({ label, value, icon }, idx) => (
        <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-2xl">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0D132D] text-white text-base flex-shrink-0">
            {icon}
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-[#0D132D] font-medium">{label}</p>
            <p className="text-lg font-bold text-gray-800">{Number(value).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampaignStats;
