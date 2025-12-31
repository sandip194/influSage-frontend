import { useState, useEffect, useCallback } from "react";
import { Skeleton, Select } from "antd";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip);

const { Option } = Select;

/* ---------- Helpers ---------- */
const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
  return Math.round(num);
};

// Role-based endpoints
const ENDPOINT_BY_ROLE = {
  2: "/vendor/analytics/engagement-score",
  1: "/user/analytics/engagement-score",
};

const CAMPAIGN_ENDPOINT_BY_ROLE = {
  2: "/vendor/analytics/campaign-engagement-score",
  1: "/user/analytics/campaign-engagementscore",
};

/* ---------- Component ---------- */
const EngagementGauge = ({ campaignId }) => {
  const [sortBy, setSortBy] = useState("month");
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const { token, role } = useSelector((state) => state.auth);

  /* ---------- Determine API endpoint ---------- */
  const getEndpoint = useCallback(() => {
    if (campaignId) return CAMPAIGN_ENDPOINT_BY_ROLE[role];
    return ENDPOINT_BY_ROLE[role];
  }, [campaignId, role]);

  /* ---------- Fetch Engagement Score ---------- */
  const fetchEngagementScore = useCallback(async () => {
    if (!token || !role) return;
    setLoading(true);

    try {
      const endpoint = getEndpoint();
      if (!endpoint) return;

      const params = campaignId ? { p_campaignid: campaignId, p_filtertype: sortBy } : { p_filtertype: sortBy };

      const res = await axios.get(endpoint, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setScore(res?.data?.data?.engagementscore || 0);
    } catch (error) {
      console.error("EngagementGauge fetch error:", error);
      setScore(0);
    } finally {
      setLoading(false);
    }
  }, [campaignId, getEndpoint, sortBy, token, role]);

  useEffect(() => {
    fetchEngagementScore();
  }, [fetchEngagementScore]);

  /* ---------- Animated Count-Up ---------- */
  useEffect(() => {
    if (loading) return;

    let rafId;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setAnimatedScore(Math.floor(progress * score));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };

    setAnimatedScore(0);
    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [score, loading]);

  /* ---------- Chart Config ---------- */
  const data = {
    labels: ["Engagement"],
    datasets: [
      {
        data: [1],
        backgroundColor: ["#335CFF"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "80%",
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };

  return (
    <div className="bg-white rounded-2xl w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {campaignId ? "Campaign Engagement" : "Engagement Score"}
        </h2>

        <Select value={sortBy} onChange={setSortBy} size="middle" style={{ width: 100 }}>
          <Option value="year">Year</Option>
          <Option value="month">Month</Option>
          <Option value="week">Week</Option>
        </Select>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 mb-2">
            <Doughnut data={data} options={options} />
          </div>

          <p className="text-3xl font-bold text-[#0D132D]">{formatNumber(animatedScore)}</p>
          <p className="text-gray-500 text-sm">Total Engagement Score</p>
        </div>
      )}
    </div>
  );
};

export default EngagementGauge;
