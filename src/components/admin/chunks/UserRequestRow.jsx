// components/UserRequestRow.jsx
import React from "react";
import { Tooltip } from "antd";
import {
  RiEyeLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
};

const iconButtonClass =
  "text-gray-600 hover:text-blue-600 transition-colors p-1 cursor-pointer";

const UserRequestRow = ({ user, email, role, date, status, avatar }) => {
  const handleAction = (action) => {
    console.log(`Action: ${action} on user ${user}`);
    // Implement your logic here (modal, API call, etc.)
  };

  return (
    <tr className="border-b border-gray-100">
      <td className="px-4 py-3 flex items-center space-x-3">
        <img
          src={avatar}
          onError={(e) => (e.target.src = "/default.jpg")}
          alt={user}
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-medium">{user}</span>
      </td>
      <td className="px-4 py-3 text-gray-600">{email}</td>
      <td className="px-4 py-3 text-gray-600">{role}</td>
      <td className="px-4 py-3 text-gray-600">{date}</td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
        >
          {status}
        </span>
      </td>
      <td className="px-4 py-3 flex space-x-3 items-center justify-start">
        {/* View Details Icon */}
        <Tooltip title="View Details">
          <button
            onClick={() => handleAction("view")}
            className={iconButtonClass}
          >
            <RiEyeLine size={20} />
          </button>
        </Tooltip>

        {/* Approve & Reject only if status is Pending */}
        {status === "Pending" && (
          <>
            <Tooltip title="Approve">
              <button
                onClick={() => handleAction("approve")}
                className={`${iconButtonClass} text-green-600 hover:text-green-700`}
              >
                <RiCheckLine size={20} />
              </button>
            </Tooltip>

            <Tooltip title="Reject">
              <button
                onClick={() => handleAction("reject")}
                className={`${iconButtonClass} text-red-600 hover:text-red-700`}
              >
                <RiCloseLine size={20} />
              </button>
            </Tooltip>
          </>
        )}
      </td>
    </tr>
  );
};

export default UserRequestRow;
