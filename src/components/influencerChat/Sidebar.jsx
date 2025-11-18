import React, { useState, useEffect } from "react";
import { Select } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { Modal, Button } from "antd";

import { RiBook2Line, RiAddLine } from "@remixicon/react";

const Sidebar = ({ setActiveSubject }) => {
  const initialByTab = {
    Open: [],
    Inprograss: [],
    Close: [],
    Released: [],
  };

  const [activeTab, setActiveTab] = useState("Open");
  const [subjectsByTab, setSubjectsByTab] = useState(initialByTab);
  const [activeSubjectName, setActiveSubjectName] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [openModal, setOpenModal] = useState(false);
  const [newSubject, setNewSubject] = useState(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("/chat/support/user/get-subject", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const list = res.data?.subjectList || [];

        setSubjectOptions(
          list.map((x) => ({
            label: x.name,
            value: x.id,
          }))
        );

        setSubjectsByTab({
          Open: list.map((x) => ({
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

  const handleSubmitTicket = async () => {
    if (!newSubject) {
      setShowError(true);
      return;
    }
    setShowError(false);

    setLoadingAdd(true);
    try {
      const res = await axios.post(
        "/chat/support/user/create-ticket",
        {
          p_objectiveid: newSubject,
          p_statusname: "Open",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.p_status) {
        const selected = subjectOptions.find((o) => o.value === newSubject);
        const newTicketObj = {
          name: selected.label,
          icon: <RiBook2Line className="text-xl" />,
        };

        setSubjectsByTab((prev) => ({
          ...prev,
          Open: [...prev.Open, newTicketObj],
        }));

        setActiveSubject(selected.label);
        setActiveSubjectName(selected.label);
        setOpenModal(false);
        setNewSubject(null);
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setLoadingAdd(false);
    }
  };

  const subjects = subjectsByTab[activeTab] || [];

  const handleSubjectClick = (name) => {
    setActiveSubject(name);
    setActiveSubjectName(name);
  };

  return (
    <div className="h-full w-[400px] bg-white flex flex-col p-4 border-r border-gray-200 shadow-md rounded-md">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Support</h1>
          <p className="text-gray-500 text-sm">
            Your conversations related to subject
          </p>
        </div>

        {activeTab === "Open" && (
          <button
            onClick={() => setOpenModal(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0D132D] hover:bg-[#1A234B] text-white"
          >
            <RiAddLine size={22} />
          </button>
        )}
      </div>

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

      <Modal
        title={ <div className="pb-3 mb-3 border-b border-gray-200">
            <span className="font-semibold text-lg">Create Ticket</span>
          </div>}
        open={openModal}
        onCancel={() => {
          setNewSubject(null);
          setOpenModal(false);
        }}
        footer={[
          <Button
            key="cancel"
            size="large"
            className="border border-gray-300"
            onClick={() => {
              setNewSubject(null);
              setOpenModal(false);
            }}
          >
            Cancel
          </Button>,

          <Button
            key="submit"
            type="primary"
            size="large"
            loading={loadingAdd}
            className="!bg-[#0D132D] hover:!bg-[#1a234b] !border-none"
            onClick={handleSubmitTicket}
          >
            Submit
          </Button>,
        ]}
      >
        <div className="mt-1">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Select Subject
          </label>

          <Select
            allowClear
            placeholder="Select Subject"
            value={newSubject}
            onChange={(value) => {
              setNewSubject(value);
              setShowError(false);
            }}
            className="w-full"
            size="large"
            options={subjectOptions}
          />

          {showError && (
            <p className="text-red-500 text-sm mt-1">Please select a subject</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
