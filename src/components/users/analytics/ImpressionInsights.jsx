import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { Select, Skeleton, Empty } from "antd";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const { Option } = Select;

const ImpressionInsights = () => {
  const { token } = useSelector((state) => state.auth);
  const [impressionData, setImpressionData] = useState([]);
  const [sortBy, setSortBy] = useState("year");
  const [loading, setLoading] = useState(false);

  const fetchImpressionInsights = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await axios.get("/user/analytics/impression", {
        params: { p_filtertype: sortBy },
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res?.data?.data || [];
      setImpressionData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setImpressionData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImpressionInsights();
  }, [sortBy, token]);

  const chartData = useMemo(() => {
    if (!impressionData.length) return { labels: [], datasets: [] };

    return {
      labels: impressionData.map((item) => item?.providername || "Unknown"),
      datasets: [
        {
          label: "Impressions",
          data: impressionData.map((item) => item?.estimatedimpression || 0),
          backgroundColor: (ctx) => {
            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 250);
            gradient.addColorStop(0, "#335CFF");
            gradient.addColorStop(1, "rgba(51,92,255,0.1)");
            return gradient;
          },
          borderRadius: 10,
          barThickness: 30,
        },
      ],
    };
  }, [impressionData]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          titleFont: { size: 12 },
          bodyFont: { size: 12 },
          callbacks: {
            label: (ctx) => `${ctx.raw.toLocaleString()} impressions`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 12 },
            color: "#6B7280",
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            font: { size: 12 },
            color: "#6B7280",
            callback: (value) => (value >= 1000 ? `${value / 1000}k` : value),
          },
          grid: { color: "#E5E7EB" },
        },
      },
    }),
    []
  );

  // Dynamic height: only apply when loading or data exists
  const chartContainerHeight = loading || impressionData.length ? "h-[250px] sm:h-[200px] md:h-[250px] lg:h-[300px]" : "h-auto";

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Impression Insights</h2>

        <Select
          value={sortBy}
          onChange={setSortBy}
          size="middle"
          style={{ width: 120 }}
        >
          <Option value="year">Year</Option>
          <Option value="month">Month</Option>
          <Option value="week">Week</Option>
        </Select>
      </div>

      <div className={`relative w-full ${chartContainerHeight}`}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : impressionData.length ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Empty description="No data available" className="mt-10" />
        )}
      </div>
    </>
  );
};

export default ImpressionInsights;
