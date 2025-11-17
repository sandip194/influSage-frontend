import React, { useState, useEffect } from "react";
import { Select } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

import {
  RiBook2Line, RiAddLine, } from "@remixicon/react";

const Sidebar = ({ setActiveSubject }) => {
  const initialByTab = {
    Open: [],
    Inprograss: [],
    Close: [],
    Released: [],
  };

  const [activeTab, setActiveTab] = useState("Open");
  const [subjectsByTab, setSubjectsByTab] = useState(initialByTab);
  const [newSub, setNewSub] = useState(null);
  const [activeSubjectName, setActiveSubjectName] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("/chat/support/user/get-subject", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const list = res.data?.subjectList || [];

        setSubjectOptions(list.map(x => ({
          label: x.name,
          value: x.id,
        })));

        setSubjectsByTab({
          Open: list.map(x => ({
            name: x.name,
            icon: <RiBook2Line className="text-xl" />,
          })),
          Inprograss: [],
          Close: [],
          Released: [],
        });
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    if (token) fetchSubjects();
  }, [token]);

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleAdd = async () => {
    if (!newSub) return;
    const selected = subjectOptions.find((o) => o.value === newSub);
    if (!selected) return;

    try {
      const res = await axios.post(
        "/chat/support/user/create-ticket",
        {
          p_objectiveid: selected.value,
          p_statusname: "Open",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data?.p_status) {
        const newTicketObj = {
          name: selected.label,
          icon: <RiBook2Line className="text-xl" />,
        };

        setSubjectsByTab((prev) => ({
          ...prev,
          Open: [...prev.Open, newTicketObj],
        }));

        setNewSub(null);
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };
  const subjects = subjectsByTab[activeTab] || [];

  const handleSubjectClick = (name) => {
    setActiveSubject(name);
    setActiveSubjectName(name);
  };

  return (
    <div className="h-full w-[400px] bg-white flex flex-col p-4 border-r border-gray-200 shadow-md rounded-md">
      <h1 className="text-xl font-bold text-gray-900">Support</h1>
      <p className="text-gray-500 text-sm mb-3">Your conversations to related subject</p>

      <hr className="my-2 border-gray-200" />

      <div className="flex gap-2 mb-4 my-2">
        {["Open", "Inprograss", "Resolve", "Close"].map((tab) => (
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
        {subjects.map((s, i) => (
          <div
            key={i}
            onClick={() => handleSubjectClick(s.name)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
              activeSubjectName === s.name
                ? "bg-[#0D132D] text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {s.icon}
            <span className="font-medium truncate">{s.name}</span>
          </div>
        ))}
      </div>

      {activeTab === "Open" && (
        <div className="mt-4 bg-white p-4 border border-gray-200 rounded-lg shadow-md">
          <Select
            allowClear
            placeholder="Select Subject"
            value={newSub}
            onChange={setNewSub}
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
      )}
    </div>
  );
};

export default Sidebar;
