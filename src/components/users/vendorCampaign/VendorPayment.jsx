import React from 'react';
import {
  RiCheckboxBlankCircleLine,
} from '@remixicon/react';




const getStatusColor = (status) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-600";
    case "Pending":
      return "bg-yellow-100 text-yellow-600";
    case "Overdue":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const milestones = [
  {
    name: "Milestone Name 1",
    amount: "$12.35",
    dueDate: "16 Jun 2021, 05:00 PM",
    status: "Paid",
  },
  {
    name: "Milestone Name 2",
    amount: "$12.35",
    dueDate: "16 Jun 2021, 05:00 PM",
    status: "Paid",
  },
  {
    name: "Milestone Name 3",
    amount: "$12.35",
    dueDate: "16 Jun 2021, 05:00 PM",
    status: "Pending",
  },
];



const VendorPayment = () => {



  return (
    <div className="">
      {/* Milestones */}
      <h3 className="font-semibold text-base mb-2 my-4">Milestones</h3>
      <div className="flex flex-wrap md:justify-around mt-3 gap-6 border border-gray-200 rounded-2xl p-4 my-4">
        <div className="flex-row items-center gap-2">
          <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
            <span>Project price</span>
          </div>
          <p>$195.00</p>
        </div>
        <div className="flex-row items-center justify-center gap-2">
          <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
            <span>Milestones paid (5)</span>
          </div>
          <p>$195.00</p>
        </div>
        <div className="flex-row items-center justify-center gap-2">
          <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
            <span>Milestones remaining (0)</span>
          </div>
          <p>$0.00</p>
        </div>
        <div className="flex-row items-center justify-center gap-2">
          <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
            <span>Total earnings</span>
          </div>
          <p>$195.00</p>
        </div>
      </div>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-2 top-0 h-full border-l-2 border-dashed border-gray-300"></div>

        {milestones.map((m, idx) => (
          <div key={idx} className="relative pl-10 pb-6">
            {/* Circle timeline */}
            <span className="absolute left-0 top-1 text-gray-700">
              <RiCheckboxBlankCircleLine size={18} />
            </span>

            {/* Milestone Details */}
            <div>
              <h4 className="font-semibold text-gray-800">{m.name}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <span className="font-medium">{m.amount}</span>
                <span>|</span>
                <span>Due On {m.dueDate}</span>
              </div>

              {/* Status Badge */}
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded-md font-medium ${getStatusColor(
                  m.status
                )}`}
              >
                {m.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default VendorPayment;
