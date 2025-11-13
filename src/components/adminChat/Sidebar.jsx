import React, { useState } from "react";
import { Select } from "antd";

import {
  RiBook2Line,
  RiBug2Line,
  RiMoneyDollarCircleLine,
  RiShieldUserLine,
  RiAddLine,
} from "@remixicon/react";

import {
  RiCheckDoubleLine,
  RiBarChart2Line,
  RiHandHeartLine,
  RiFileList3Line,
  RiQuestionLine,
} from "@remixicon/react";

const Sidebar = ({ setActiveSubject }) => {
  const initialByTab = {
    Open: [
      { name: "Support Related", icon: <RiBook2Line className="text-xl" /> },
      { name: "Technical Support", icon: <RiBug2Line className="text-xl" /> },
    ],
    Pending: [{ name: "Payment Support", icon: <RiMoneyDollarCircleLine className="text-xl" /> }],
    Close: [{ name: "Verification Support", icon: <RiShieldUserLine className="text-xl" /> }],
    Released: [],
  };

  const [activeTab, setActiveTab] = useState("Open");
  const [subjectsByTab, setSubjectsByTab] = useState(initialByTab);
  const [newSub, setNewSub] = useState("");
  const [activeSubjectName, setActiveSubjectName] = useState("");

  const subjectOptions = [
    { label: "Campaign Approval", value: "Campaign Approval", icon: <RiCheckDoubleLine className="text-lg" /> },
    { label: "Payment & Payout Issues", value: "Payment & Payout Issues", icon: <RiMoneyDollarCircleLine className="text-lg" /> },
    { label: "Profile Verification", value: "Profile Verification", icon: <RiShieldUserLine className="text-lg" /> },
    { label: "Campaign Performance", value: "Campaign Performance", icon: <RiBarChart2Line className="text-lg" /> },
    { label: "Technical Issue", value: "Technical Issue", icon: <RiBug2Line className="text-lg" /> },
    { label: "Brand Collaboration Help", value: "Brand Collaboration Help", icon: <RiHandHeartLine className="text-lg" /> },
    { label: "Content Approval", value: "Content Approval", icon: <RiFileList3Line className="text-lg" /> },
    { label: "General Query", value: "General Query", icon: <RiQuestionLine className="text-lg" /> },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAdd = () => {
    if (!newSub) return;

    const find = subjectOptions.find((o) => o.value === newSub);
    const newObj = { name: newSub, icon: find?.icon || <RiBook2Line className="text-xl" /> };

    setSubjectsByTab((prev) => {
      const copy = { ...prev };
      copy[activeTab] = [...copy[activeTab], newObj];
      return copy;
    });

    // ⭐ UPDATE HEADER + HIGHLIGHT NEW SUBJECT
    setActiveSubject(newSub);
    setActiveSubjectName(newSub);

    setNewSub("");
  };

  const subjects = subjectsByTab[activeTab] || [];

  const handleSubjectClick = (name) => {
    setActiveSubject(name);
    setActiveSubjectName(name);
  };

  return (
    <div className="h-full w-[400px] bg-white flex flex-col p-4">
      <h1 className="text-xl font-bold text-gray-900">Support</h1>
      <p className="text-gray-500 text-sm mb-3">Your conversations to related subject</p>

      <hr className="my-2 border-gray-100" />

      <div className="flex gap-2 mb-4 my-2">
        {["Open", "Pending", "Close", "Released"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
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

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {subjects.length === 0 && (
          <p className="text-gray-400 text-sm text-center">No subjects</p>
        )}

        {subjects.map((s, i) => (
          <div
            key={i}
            onClick={() => handleSubjectClick(s.name)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
              activeSubjectName === s.name
                ? "bg-[#0D132D] text-white shadow-md"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700"
            }`}
          >
            <div className={`${activeSubjectName === s.name ? "text-white" : "text-gray-700"}`}>
              {s.icon}
            </div>

            <span
              className={`font-medium truncate ${
                activeSubjectName === s.name ? "text-white" : "text-gray-700"
              }`}
            >
              {s.name}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-white p-4 border border-gray-200 rounded-lg">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">Select a Subject</label>

        <Select
          placeholder="Select Subject"
          value={newSub}
          onChange={(val) => {
            setNewSub(val);
            setActiveSubject(val);
            setActiveSubjectName(val);
          }}
          className="w-full mb-3"
          options={subjectOptions}
        />

        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 bg-[#0D132D] text-white py-2 rounded-lg font-semibold hover:bg-[#1A234B] transition"
        >
          <RiAddLine />
          Add
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
