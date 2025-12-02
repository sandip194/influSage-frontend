import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

const EngagementGauge = ({ views, likes, comments, shares }) => {
  const engagementRate = ((likes + comments + shares) / views) * 100;
  const percentage = Math.round(engagementRate);

  const data = {
    labels: ["Engagement", "Remaining"],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ["#335CFF", "#E5E7EB"],
        hoverBackgroundColor: ["#335CFF", "#E5E7EB"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "75%",
    plugins: { tooltip: { enabled: false } },
  };

  return (
    <div className="">
      <h2 className="text-lg font-bold mb-4">Engagement Rate</h2>

      <div className="flex flex-col items-center">
        <div className="w-40 h-40 mb-2">
          <Doughnut data={data} options={options} />
        </div>

        <p className="text-3xl font-bold text-[#0D132D]">{percentage}%</p>
        <p className="text-gray-500 text-sm">Based on likes, comments & shares</p>
      </div>
    </div>
  );
};

export default EngagementGauge;
