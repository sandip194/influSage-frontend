import React from "react";
import { RiStackLine, RiGiftLine, RiWalletLine, RiAddLine, RiEyeLine } from "@remixicon/react";

const CampaignCards = () => {
  const data = [
    {
      title: "My Campaign",
      count: "2,765",
      icon: <RiStackLine className="w-6 h-6" />,
      action: {
        label: "Add",
        icon: <RiAddLine className="w-4 h-4" />,
      },
    },
    {
      title: "Offers",
      count: "124",
      icon: <RiGiftLine className="w-6 h-6" />,
      action: {
        label: "View",
        icon: <RiEyeLine className="w-4 h-4" />,
      },
    },
    {
      title: "Payment Requests",
      count: "124",
      icon: <RiWalletLine className="w-6 h-6" />,
      action: {
        label: "View",
        icon: <RiEyeLine className="w-4 h-4" />,
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="bg-[#0B132B] text-white p-3 rounded-full w-10 h-10 flex items-center justify-center">
              {item.icon}
            </div>
            <h3 className="text-sm font-medium text-gray-600">{item.title}</h3>
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-2xl font-semibold text-gray-900">{item.count}</span>
            <button
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full transition"
            >
              {item.action.icon}
              {item.action.label}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampaignCards;
