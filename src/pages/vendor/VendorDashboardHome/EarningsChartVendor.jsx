import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const EarningsChartVendor = ({ data }) => {
  const [barThickness, setBarThickness] = useState(20);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setBarThickness(12); 
      else if (window.innerWidth < 1024) setBarThickness(16);
      else setBarThickness(20);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Earnings',
        data: data || [14000, 25000, 5000, 15000, 25000, 20000, 5000, 15000, 15000, 25000, 18000, 7000],
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, '#335CFF');
          gradient.addColorStop(1, '#fff');
          return gradient;
        },
        borderRadius: 8,
        barThickness,
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
          label: function (context) {
            return `${context.raw / 1000}k`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value / 1000}k`,
          font: { size: 12 },
        },
        grid: { color: '#E5E7EB' },
      },
      x: {
        ticks: { font: { size: 12 } },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-semibold">Earning Summary</h2>
        <select className="text-sm sm:text-base text-gray-600 border rounded-full px-4 py-1 shadow-sm flex gap-2">
          <option value="yearly">Yearly</option>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div className="relative h-[250px] sm:h-[300px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default EarningsChartVendor;
