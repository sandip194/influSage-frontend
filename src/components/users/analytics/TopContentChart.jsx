import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TopContentChart = () => {
  const labels = [
    "Reel - Skincare Routine",
    "TikTok - Unboxing",
    "Instagram Post - Results",
    "Reel - Before/After",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Views",
        data: [52000, 38000, 26000, 18000],
        backgroundColor: "#335CFF",
        borderRadius: 8,
        barThickness: 8,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw.toLocaleString()} Views`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          callback: (v) => (v >= 1000 ? `${v / 1000}k` : v),
          color: "#6B7280",
          font: { size: 12 }
        },
      },
      y: {
        ticks: { color: "#6B7280", font: { size: 12 } },
      },
    },
  };

  return (
    <div className="relative w-full h-64 sm:h-48 md:h-64 lg:h-72">
      <Bar data={data} options={options} />
    </div>
  );
};

export default TopContentChart;
