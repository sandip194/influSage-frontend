import React from "react";
import {
  RiEyeLine,
  RiHeartLine,
  RiChat1Line,
  RiShareForwardLine,
} from "react-icons/ri";

/* ----------------------------------
   Central Icon Map
----------------------------------- */
const ICON_MAP = {
  views: RiEyeLine,
  likes: RiHeartLine,
  comments: RiChat1Line,
  shares: RiShareForwardLine,
};

const StatCard = ({
  iconKey,
  title,
  value,
  bgColor = "bg-white",
  iconColor = "text-blue-500",
}) => {
  const Icon = ICON_MAP[iconKey];

  return (
    <div className={`flex items-center p-4 shadow rounded-lg border border-gray-300 ${bgColor}`}>
      <div className={`text-3xl mr-4 ${iconColor}`}>
        {Icon ? <Icon /> : null}
      </div>

      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl font-bold">
          {typeof value === "number" ? value.toLocaleString() : value || 0}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
