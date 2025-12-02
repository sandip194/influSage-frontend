import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ImpressionInsights = () => {
  const chartData = {
    labels: ["Instagram", "YouTube", "TikTok", "Facebook", "Pinterest"],
    datasets: [
      {
        label: "Impressions",
        data: [42000, 35000, 28000, 18000, 12000],
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

  const options = {
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
          callback: (value) =>
            value >= 1000 ? `${value / 1000}k` : value,
        },
        grid: { color: "#E5E7EB" },
      },
    },
  };

  return (
    <div className="relative h-[250px] sm:h-[300px] w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ImpressionInsights;
