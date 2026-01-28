import { useState, useEffect, useCallback } from "react";
import { Skeleton, Select } from "antd";
import api from "../../../api/axios";import { useSelector } from "react-redux";

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

      const res = await api.get(endpoint, {
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
    <div className="relative w-full rounded-2xl min-h-[220px] overflow-hidden bg-white p-4 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-xl font-bold text-gray-900">
          {campaignId ? "Campaign Engagement" : "Engagement Score"}
        </h2>

        <div className="flex justify-end w-full sm:w-auto">
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

      </div>

        {loading ? (
          <Skeleton
            active
            title={{ width: "60%" }}
            paragraph={false}
          />
        ) : (
          <div className="flex-1 grid place-items-center text-center">
            <div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-none">
                {formatNumber(animatedScore)}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Total Engagement Score
              </p>
            </div>
          </div>

        )}

    </div>
  );
};

export default EngagementCard;
