// components/StatCard.jsx
import React from "react";

const StatCard = ({ icon: Icon, title, value, bgColor = "bg-white", iconColor = "text-blue-500" }) => {
  return (
    <div className={`flex items-center p-4 shadow rounded-lg ${bgColor}`}>
      <div className={`text-3xl ${iconColor} mr-4`}>
        <Icon />
      </div>    
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
