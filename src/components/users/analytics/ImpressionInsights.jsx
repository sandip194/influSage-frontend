import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../../../api/axios";import { useSelector } from "react-redux";
import { Select, Spin } from "antd";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const { Option } = Select;

const ImpressionInsights = () => {
  const { token } = useSelector((state) => state.auth);
  const [impressionData, setImpressionData] = useState([]);
  const [sortBy, setSortBy] = useState("month");
  const [loading, setLoading] = useState(false);

  const fetchImpressionInsights = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get("/user/analytics/impression", {
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
    if (!impressionData.length) {
      return {
        labels: [],
        datasets: [
          {
            label: "Impressions",
            data: [],
            backgroundColor: ["#E5E7EB"], // light gray bar
            borderRadius: 10,
            barThickness: 20,
          },
        ],
      };
    }

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
            label: (ctx) =>
              ctx.label === "No Data"
                ? "No impression data"
                : `${ctx.raw.toLocaleString()} impressions`,
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

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-xl font-bold text-gray-900 ">Impression Insights</h2>
        <div className="flex justify-end w-full sm:w-auto">
          <Select value={sortBy} onChange={setSortBy} size="middle" style={{ width: 120 }}>
            <Option value="year">Year</Option>
            <Option value="month">Month</Option>
            <Option value="week">Week</Option>
          </Select>
        </div>

      </div>

      <div className="relative w-full h-48 md:h-64 flex flex-col items-center justify-center py-4 mt-4">
        {loading ? (
          <Spin size="large" />
        ) : (
          <>
            <Bar data={chartData} options={options} />
            {!impressionData.length && !loading && (
              <p className="text-sm text-gray-400 my-3 text-center">
                No impression data available
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ImpressionInsights;
