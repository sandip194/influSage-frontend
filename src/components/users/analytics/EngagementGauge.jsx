import { useState, useEffect, useCallback } from "react";
import { Skeleton, Select } from "antd";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip);

const { Option } = Select;

const EngagementGauge = () => {
  const [sortBy, setSortBy] = useState("year"); // default: year
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  const { token } = useSelector((state) => state.auth);

  const fetchEngagementScore = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/user/analytics/engagement-score", {
        params: { p_filtertype: sortBy },
        headers: { Authorization: `Bearer ${token}` },
      });

      setScore(res?.data?.data || 0);
    } catch (error) {
      console.error("EngagementGauge fetch error:", error);
      setScore(0);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchEngagementScore();
  }, [fetchEngagementScore]);

  const data = {
    labels: ["Score", "Remaining"],
    datasets: [
      {
        data: [score || 0, 100 - (score || 0)],
        backgroundColor: ["#335CFF", "#E5E7EB"],
        hoverBackgroundColor: ["#335CFF", "#E5E7EB"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "75%",
    plugins: { tooltip: { enabled: false } },
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Engagement Score</h2>
        <Select
          value={sortBy}
          onChange={setSortBy}
          size="middle"
          style={{ width: 100 }}
        >
          <Option value="year">Year</Option>
          <Option value="month">Month</Option>
        </Select>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 mb-2">
            <Doughnut data={data} options={options} />
          </div>
          <p className="text-3xl font-bold text-[#0D132D]">{score ?? 0}</p>
          <p className="text-gray-500 text-sm">Based on influencer engagement</p>
        </div>
      )}
    </div>
  );
};

export default EngagementGauge;
