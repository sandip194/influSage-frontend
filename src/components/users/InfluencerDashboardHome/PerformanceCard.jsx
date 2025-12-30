import React, { useEffect, useMemo, useState } from 'react';
import 'remixicon/fonts/remixicon.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useSelector } from 'react-redux';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = {
  applied: '#3B82F6',
  invited: '#335CFF',
  inProgress: '#60A5FA',
  completed: '#0F172A',
};

// Map frontend labels/colors to backend keys
const METRIC_KEYS = [
  { label: 'Applied Campaigns', color: COLORS.applied, backendKey: 'appliedcampaigncount' },
  { label: 'Invited Campaigns', color: COLORS.invited, backendKey: 'invitedcampaigncount' },
  { label: 'In Progress Campaigns', color: COLORS.inProgress, backendKey: 'inprogresscampaign' },
  { label: 'Completed Campaigns', color: COLORS.completed, backendKey: 'completedcampaign' },
];

const PerformanceCard = () => {
  const { token } = useSelector((state) => state.auth);

  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  const getCountData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/user/dashboard/counts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCounts(res?.data?.data ?? null);
    } catch (error) {
      console.error(error);
      setCounts(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCountData();
  }, []);

  // Animate total campaigns count
  useEffect(() => {
    if (!counts) return;
    const total = counts.totalcampaignsparticipated ?? 0;
    let start = 0;
    const duration = 1000; // 1 second
    const increment = total / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= total) {
        start = total;
        clearInterval(counter);
      }
      setAnimatedTotal(Math.floor(start));
    }, 16);

    return () => clearInterval(counter);
  }, [counts]);

  const chartData = useMemo(() => {
    if (!counts) return null;

    return {
      labels: METRIC_KEYS.map((m) => m.label),
      datasets: [
        {
          data: METRIC_KEYS.map((m) => counts[m.backendKey] ?? 0),
          backgroundColor: METRIC_KEYS.map((m) => m.color),
          borderWidth: 0,
          cutout: '75%',
        },
      ],
    };
  }, [counts]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = Number(context.raw) || 0;
            const total = context.dataset.data.reduce((sum, val) => sum + Number(val || 0), 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: loading ? 0 : 1200,
      easing: 'easeOutQuart',
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    onHover: (event, elements) => {
      if (elements && elements.length) {
        setHoveredIndex(elements[0].index);
      } else {
        setHoveredIndex(null);
      }
    },
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
        <div className="h-48 w-48 bg-gray-200 rounded-full mx-auto mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!counts) {
    return (
      <div className="bg-white p-6 rounded-2xl text-center text-gray-500">
        Failed to load performance data
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Performance</h2>
      </div>

      {/* Donut */}
      <div className="relative w-full max-w-[220px] aspect-square mx-auto mb-6 p-2">
        {chartData && <Doughnut data={chartData} options={options} />}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm text-gray-400">Total Participations</span>
          <span className="text-2xl font-semibold text-gray-800">{animatedTotal}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-1 text-sm">
        {METRIC_KEYS.map(({ label, color, backendKey }, index) => (
          <MetricRow
            key={label}
            color={color}
            label={label}
            value={counts[backendKey] ?? 0}
            highlighted={hoveredIndex === index}
          />
        ))}
      </div>
    </div>
  );
};

const MetricRow = ({ color, label, value, highlighted }) => (
  <div
    className={`flex items-center justify-between px-2 rounded ${
      highlighted ? 'bg-gray-50' : ''
    }`}
  >
    <div className="flex items-center gap-2">
      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-gray-800 text-sm">{label}</span>
    </div>
    <span className="font-semibold text-gray-900 text-sm">{value ?? 0}</span>
  </div>
);

export default PerformanceCard;
