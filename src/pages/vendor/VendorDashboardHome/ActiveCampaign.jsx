import React, { useState } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ActiveCampaign = () => {
  const [timeRange, setTimeRange] = useState("monthly");

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Active",
        data: [60, 85, 75, 40, 30, 95, 65, 70, 50, 80, 75, 60],
        borderColor: "#2563EB",
        backgroundColor: "rgba(37,99,235,0.15)",
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
      },
      {
        label: "Completed",
        data: [20, 60, 40, 20, 10, 50, 70, 65, 80, 50, 65, 30],
        borderColor: "#1E3A8A",
        backgroundColor: "rgba(30,58,138,0.15)",
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "start",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          color: "#111827",
          font: {
            size: 10,
            family: "Inter, sans-serif",
          },
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
          font: {
            size: window.innerWidth < 640 ? 10 : 12, // smaller font on mobile
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#E5E7EB" },
        ticks: {
          color: "#6B7280",
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
      },
    },
  };

  return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl w-full mt-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
          Active vs. Completed Campaigns
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="text-xs sm:text-sm text-gray-600 border rounded-full px-3 sm:px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Chart */}
      <div className="h-52 sm:h-64 md:h-80 lg:h-96 transition-all duration-300">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ActiveCampaign;
