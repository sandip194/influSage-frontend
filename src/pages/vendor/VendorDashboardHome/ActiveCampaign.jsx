import React, { useCallback, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import api from "../../../api/axios";import { useSelector } from "react-redux";
import { Select, Spin } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { Option } = Select;

const ActiveCampaign = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.auth);

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(
        "vendor/dashboard/CampaignStatusTrend",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { p_filtertype: timeRange },
        }
      );

      const apiData = res.data.data || [];

      let labels = [];
      let activeData = [];
      let completedData = [];

      if (apiData.length > 0) {
        if (timeRange === "year") {
          labels = apiData.map((item) => item.year);
        } else if (timeRange === "month") {
          const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ];
          labels = apiData.map((item) => monthNames[item.month - 1] || `Month ${item.month}`);
        } else if (timeRange === "week") {
          labels = apiData.map((item) => `Week ${item.week}`);
        }

        activeData = apiData.map((item) => item.activecampaigncount || 0);
        completedData = apiData.map((item) => item.completecampaigncount || 0);
      }

      // Set chart data safely
      setChartData({
        labels,
        datasets: [
          {
            label: "Active",
            data: activeData,
            borderColor: "#2563EB",
            backgroundColor: "rgba(37,99,235,0.15)",
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 0,
          },
          {
            label: "Completed",
            data: completedData,
            borderColor: "#1E3A8A",
            backgroundColor: "rgba(30,58,138,0.15)",
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 0,
          },
        ],
      });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token, timeRange]);


  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          color: "#111827",
          font: { size: 12, family: "Inter, sans-serif" },
        },
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#111827",
        bodyColor: "#374151",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#6B7280",
          font: { size: window.innerWidth < 640 ? 10 : 12 },
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#E5E7EB" },
        ticks: {
          color: "#6B7280",
          font: { size: window.innerWidth < 640 ? 10 : 12 },
        },
      },
    },

  };


  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl w-full mt-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-lg font-bold text-gray-900">
          Active vs. Completed Campaigns
        </h2>

        {/* Select */}
        <div className="flex justify-end w-full sm:w-auto">
          <Select
            value={timeRange}
            onChange={(value) => setTimeRange(value)}
            className="w-32 sm:w-40 text-sm"
          >
            <Option value="week">Weekly</Option>
            <Option value="month">Monthly</Option>
            <Option value="year">Yearly</Option>
          </Select>

        </div>

      </div>


      {/* Chart */}
      <div className="h-52 sm:h-64 md:h-80 lg:h-96 transition-all duration-300 relative">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default ActiveCampaign;
