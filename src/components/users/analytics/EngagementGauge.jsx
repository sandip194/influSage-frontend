import { useState, useEffect, useCallback } from "react";
import { Skeleton, Select } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { FiTrendingUp } from "react-icons/fi";

const { Option } = Select;

const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
  return Math.round(num);
};

const ENDPOINT_BY_ROLE = {
  2: "/vendor/analytics/engagement-score",
  1: "/user/analytics/engagement-score",
};

const CAMPAIGN_ENDPOINT_BY_ROLE = {
  2: "/vendor/analytics/campaign-engagement-score",
  1: "/user/analytics/campaign-engagementscore",
};

const EngagementCard = ({ campaignId }) => {
  const [sortBy, setSortBy] = useState("month");
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const { token, role } = useSelector((state) => state.auth);

  const getEndpoint = useCallback(() => {
    if (campaignId) return CAMPAIGN_ENDPOINT_BY_ROLE[role];
    return ENDPOINT_BY_ROLE[role];
  }, [campaignId, role]);

  const fetchEngagementScore = useCallback(async () => {
    if (!token || !role) return;
    setLoading(true);

    try {
      const endpoint = getEndpoint();
      if (!endpoint) return;

      const params = campaignId
        ? { p_campaignid: campaignId, p_filtertype: sortBy }
        : { p_filtertype: sortBy };

      const res = await axios.get(endpoint, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setScore(res?.data?.data?.engagementscore || 0);
    } catch (error) {
      console.error("EngagementCard fetch error:", error);
      setScore(0);
    } finally {
      setLoading(false);
    }
  }, [campaignId, getEndpoint, sortBy, token, role]);

  useEffect(() => {
    fetchEngagementScore();
  }, [fetchEngagementScore]);

  useEffect(() => {
    if (loading) return;

    let rafId;
    const duration = 3000;
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

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {campaignId ? "Campaign Engagement" : "Engagement Score"}
        </h2>
        <Select
          value={sortBy}
          onChange={setSortBy}
          size="middle"
          style={{ width: 100 }}
          className="bg-white text-black rounded"
        >
          <Option value="year">Year</Option>
          <Option value="month">Month</Option>
          <Option value="week">Week</Option>
        </Select>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : (
        <div className="flex flex-col items-center justify-center py-1">
          <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-green-100">
           
            <p className="text-2xl text-green-900 font-bold z-10">{formatNumber(animatedScore)}</p>
          </div>
          <p className="mt-2 text-sm opacity-90">Total Engagement Score</p>
        </div>
      )}

      {/* Optional decorative circles */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/20 -z-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 -z-10" />
    </div>
  );
};

export default EngagementCard;
