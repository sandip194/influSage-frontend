import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const PerformanceChart = () => {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Views",
        data: [42000, 52000, 35000, 67000, 59000, 63000, 72000, 68000, 61000, 70000, 69000, 75000],
        borderColor: "#335CFF", // Bright blue
        backgroundColor: "rgba(51,92,255,0.25)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Likes",
        data: [6000, 7200, 4000, 8000, 7500, 9000, 8500, 8800, 7900, 9400, 9100, 10000],
        borderColor: "#0D132D", // Navy blue
        backgroundColor: "rgba(13,19,45,0.25)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Comments",
        data: [800, 900, 750, 1100, 950, 1300, 1250, 1400, 1300, 1500, 1450, 1600],
        borderColor: "#1A3E5C", // Soft deep blue
        backgroundColor: "rgba(26,62,92,0.25)",
        tension: 0.4,
        fill: true,
      },
    ],
  };


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true }
      },
      tooltip: {
        mode: "index",
        intersect: false,
        titleFont: { size: 12 },
        bodyFont: { size: 12 }
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280", font: { size: 12 } }
      },
      y: {
        grid: { color: "#E5E7EB" },
        ticks: {
          color: "#6B7280",
          font: { size: 12 },
          callback: value => value >= 1000 ? `${value / 1000}k` : value
        }
      }
    }
  };

  return (
    <div className="relative w-full h-64 sm:h-48 md:h-64 lg:h-72">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PerformanceChart;
