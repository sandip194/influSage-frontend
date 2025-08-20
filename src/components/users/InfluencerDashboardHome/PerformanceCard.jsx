import React from 'react';
import 'remixicon/fonts/remixicon.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

const PerformanceCard = () => {
  const data = {
    datasets: [
      {
        data: Array(12).fill(1),
        backgroundColor: [
          // First 9 segments = blue gradient or solid
          '#3B82F6', '#3B82F6', '#3B82F6',
          '#335CFF', '#335CFF', '#335CFF',
          '#335CFF', '#335CFF', '#335CFF',
          // Last 3 segments = dark blue (inactive)
          '#0F172A', '#0F172A', '#0F172A'
        ],
        borderWidth: 0,
        cutout: '80%',
        spacing: 20,
      }
    ]
  };

  const options = {
    cutout: '80%',
    rotation: -90,
    circumference: 360,
    plugins: {
      tooltip: { enabled: false },
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Performance</h2>
        <div className="flex gap-2">
          <button className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 flex items-center gap-1">
            Instagram <i className="ri-arrow-down-s-line"></i>
          </button>
          <button className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 flex items-center gap-1">
            Monthly <i className="ri-arrow-down-s-line"></i>
          </button>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm text-gray-400">Avg. Performance</span>
          <span className="text-2xl font-semibold text-gray-800">75%</span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4 text-sm">
        <MetricRow
          color="bg-blue-500"
          label="Followers Growth"
          value="2.4k"
          change="26"
          icon="ri-arrow-up-line"
          positive
        />
        <MetricRow
          color="bg-blue-900"
          label="Engagement Rate"
          value="10.3k"
          change="26"
          icon="ri-arrow-down-line"
          positive={false}
        />
        <MetricRow
          color="bg-blue-800"
          label="Impressions / Clicks"
          value="11.4k"
          change="26"
          icon="ri-arrow-up-line"
          positive
        />
      </div>
    </div>
  );
};

const MetricRow = ({ color, label, value, icon, change, positive }) => {
  return (
    <div className="flex items-center justify-between border-b-1 border-gray-200 pb-3">
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
        <span className="text-gray-800">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-gray-900">{value}</span>
        <div className="flex items-center gap-1 px-2 py-1 border rounded-full text-xs text-gray-700 bg-gray-100">
          <i className={`${icon} ${positive ? 'text-green-500' : 'text-red-500'}`}></i>
          78.8%
        </div>
        <span className={`${positive ? 'text-green-500' : 'text-red-500'}`}>
          {positive ? '+' : '-'} {change}% Today
        </span>
      </div>
    </div>
  );
};

export default PerformanceCard;
