import { useEffect, useMemo, useState, useCallback } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Select, Spin, Empty } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend);

const { Option } = Select;

const COLORS = ["#335CFF", "#4C6FFF", "#0D132D", "#6B7CFF", "#1A3E5C"];

const ENDPOINT_BY_ROLE = {
  1: "/user/analytics/campaign-Contribution",
  2: "/vendor/analytics/campaign-contribution",
};

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const CampaignContribution = () => {
  const { token, role } = useSelector((state) => state.auth);

  const [filter, setFilter] = useState("month");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token || !role) {
      setData([]);
      return;
    }

    setLoading(true);
    try {
      const endpoint = ENDPOINT_BY_ROLE[role];
      if (!endpoint) return;

      const res = await axios.get(endpoint, {
        params: { p_filtertype: filter },
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Campaign contribution error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [token, role, filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartData = useMemo(() => {
    if (!data.length) return null;

    return {
      labels: data.map((d) => d.campaignname ?? "Unknown"),
      datasets: [
        {
          data: data.map((d) => toNumber(d.contributionpercentage)),
          backgroundColor: COLORS.slice(0, data.length),
          borderWidth: 0,
        },
      ],
    };
  }, [data]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 16,
            boxWidth: 10,
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label} – ${ctx.raw}%`,
          },
        },
      },
    }),
    []
  );

  const isEmpty = !loading && (!chartData || !chartData.labels.length);

  return (
    <div className="bg-white rounded-2xl  p-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Campaign Contribution
        </h2>

        <Select value={filter} onChange={setFilter} style={{ width: 120 }}>
          <Option value="week">Week</Option>
          <Option value="month">Month</Option>
          <Option value="year">Year</Option>
        </Select>
      </div>

      {/* Chart */}
      <div className="relative w-full h-64 sm:h-56 md:h-64">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <Spin />
          </div>
        )}

        {!loading && isEmpty && (
          <Empty description="No campaign contribution data" />
        )}

        {!loading && !isEmpty && (
          <Pie data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default CampaignContribution;
