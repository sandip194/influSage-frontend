import React, { useState } from "react";
import { Modal } from "antd";

import {
  RiBook2Line,
  RiBug2Line,
  RiMoneyDollarCircleLine,
  RiShieldUserLine,
  RiTicket2Line,
} from "@remixicon/react";

const AdminSidebar = ({ setActiveSubject }) => {
  const initialByTab = {
    Open: [
      { name: "Support Related", icon: <RiBook2Line className="text-xl" /> },
      { name: "Technical Support", icon: <RiBug2Line className="text-xl" /> },
    ],
    Inprograss: [
      {
        name: "Payment Support",
        icon: <RiMoneyDollarCircleLine className="text-xl" />,
      },
    ],
    Close: [
      {
        name: "Verification Support",
        icon: <RiShieldUserLine className="text-xl" />,
      },
    ],
    Released: [],
  };

  const [activeTab, setActiveTab] = useState("Open");
  const [subjectsByTab] = useState(initialByTab);
  const [activeSubjectName, setActiveSubjectName] = useState("");
  const [ticketModalData, setTicketModalData] = useState(null);

  const handleSubjectClick = (name) => {
    setActiveSubject(name);
    setActiveSubjectName(name);
  };

  const openTicketModal = (ticket) => setTicketModalData(ticket);

  const subjects = subjectsByTab[activeTab] || [];

  return (
    <div className="h-full w-[400px] bg-white flex flex-col p-4 border-r border-gray-200 shadow-md rounded-md">
      <h1 className="text-xl font-bold text-gray-900">Support</h1>
      <p className="text-gray-500 text-sm mb-3">
        Your conversations to related subject
      </p>

      <hr className="my-2 border-gray-200" />

      {/* Tabs */}
      <div className="flex gap-2 mb-4 my-2">
        {["Open", "Inprograss", "Resolve", "Close"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              activeTab === tab
                ? "bg-[#0D132D] text-white border-[#0D132D]"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Subject list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {subjects.length === 0 && (
          <p className="text-gray-400 text-sm text-center">No subjects</p>
        )}

        {subjects.map((s, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg transition ${
              activeSubjectName === s.name
                ? "bg-[#0D132D] text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <div className="flex items-center justify-between gap-3 w-full">
              {/* Subject name + icon */}
              <div
                onClick={() => openTicketModal(s)}
                className="flex items-center gap-2 cursor-pointer flex-1"
              >
                <div
                  className={`${
                    activeSubjectName === s.name
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {s.icon}
                </div>
                <span
                  className={`font-medium truncate ${
                    activeSubjectName === s.name
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {s.name}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleSubjectClick(s.name)}
                  className="text-[11px] px-2 py-1 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                  Claim
                </button>

                <button
                  onClick={() => openTicketModal(s)}
                  className="text-[11px] px-2 py-1 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Modal */}
      {ticketModalData && (
        <Modal
          open={!!ticketModalData}
          onCancel={() => setTicketModalData(null)}
          footer={null}
          width={750}
          title={null}
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 text-gray-600">
                <RiTicket2Line className="text-base" />
              </span>
              <span className="text-sm font-medium text-gray-600">
                Ticket Details
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">
                {ticketModalData.status || "In Progress"}
              </span>
            </div>

            {/* Ticket details grid */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Ticket ID</p>
                  <p className="font-medium">
                    {ticketModalData.ticketid || "TKT-2025-01-001"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Subject</p>
                  <p className="font-medium">
                    {ticketModalData.Subject || "Technical Support"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Created On</p>
                  <p className="font-medium">
                    {ticketModalData.createdat
                      ? new Date(ticketModalData.createdat).toLocaleString()
                      : "Jan 15, 2025, 10:30 AM"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Resolve on</p>
                  <p className="font-medium">
                    {ticketModalData.updatedat
                      ? new Date(ticketModalData.updatedat).toLocaleString()
                      : "Jan 15, 2025, 10:45 AM"}
                  </p>
                </div>
              </div>

              {/* Submitted & Assigned */}
              <div className="space-y-6">
                {/* Submitted by */}
                <div>
                  <p className="text-gray-500 text-sm mb-1 font-medium">
                    Submitted By
                  </p>
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        ticketModalData.submittedimage ||
                        "https://randomuser.me/api/portraits/women/44.jpg"
                      }
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">
                        {ticketModalData.submittedby || "Sarah Jenkins"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ticketModalData.submittedemail ||
                          "s.jenkins@example.com"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Assigned to */}
                <div>
                  <p className="text-gray-500 text-sm mb-1 font-medium">
                    Assigned To
                  </p>
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        ticketModalData.assignedimage ||
                        "https://randomuser.me/api/portraits/men/32.jpg"
                      }
                      alt="admin"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">
                        {ticketModalData.assignedto || "Alex Hartman"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ticketModalData.assignedrole || "Admin"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 border-t border-gray-300 pt-4">
              <button className="px-4 py-2 border rounded font-medium text-red-600 hover:bg-red-50">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminSidebar;
