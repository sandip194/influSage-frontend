import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const ImpressionReachChart = () => {
  const chartData = {
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
        label: "Impression",
        data: [5000, 15000, 10000, 20000, 5000, 22000, 30000, 15000, 25000, 30000, 18000, 10000],
        borderColor: "#335CFF",
        backgroundColor: "#335CFF",
        tension: 0.4,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: "Reach",
        data: [10000, 20000, 15000, 10000, 5000, 25000, 35000, 20000, 15000, 35000, 30000, 15000],
        borderColor: "#1D4ED8",
        backgroundColor: "#1D4ED8",
        tension: 0.4,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw / 1000}k`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value / 1000}k`,
        },
        grid: {
          color: "#E5E7EB",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-base sm:text-lg font-semibold">Impression vs. Reach</h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 ">
          <select className="text-sm text-gray-600 border rounded-full px-3 py-1">
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook</option>
          </select>
          <select className="text-sm text-gray-600 border rounded-full px-3 py-1 ">
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Chart wrapper */}
      <div className="relative h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ImpressionReachChart;
