import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Modal, Button, Select, Skeleton } from "antd";
import { getSocket } from "../../sockets/socket";
import useSocketRegister from "../../sockets/useSocketRegister";

import { RiBook2Line, RiAddLine } from "@remixicon/react";

const TicketSkeleton = () => (
  <div className="flex items-center gap-3 p-3">
    <Skeleton.Avatar active size="default" shape="circle" />
    <div className="flex-1">
      <Skeleton.Input active size="small" style={{ width: "80%", marginBottom: 6 }} />
      <Skeleton.Input active size="small" style={{ width: "50%" }} />
    </div>
  </div>
);

const Sidebar = forwardRef(({ setActiveSubject }, ref) => {
  const initialByTab = {
    Open: [],
    Inprograss: [],
    Close: [],
    Released: [],
  };
    useSocketRegister();
  const socket = getSocket();
  const [activeTab, setActiveTab] = useState("Open");
  const [subjectsByTab, setSubjectsByTab] = useState(initialByTab);
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const { token, userId } = useSelector((state) => state.auth);
  const [openModal, setOpenModal] = useState(false);
  const [newSubject, setNewSubject] = useState(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [showError, setShowError] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  useEffect(() => {
  if (!socket || !userId) return;
  socket.emit("registerUser", { userId });

  socket.on("connect", () => {
    socket.emit("registerUser", { userId });
  });

  return () => socket.off("connect");
}, [socket, userId]);

  useEffect(() => {
  if (!socket) return;

  const handler = ({ ticketId, readbyuser }) => {
    setSubjectsByTab(prev =>
      Object.fromEntries(
        Object.entries(prev).map(([tab, tickets]) => [
          tab,
          tickets.map(t =>
            String(t.id) === String(ticketId)
              ? {
                  ...t,
                  unread: !readbyuser && String(activeSubjectId) !== String(ticketId)
                }
              : t
          ),
        ])
      )
    );
  };
  socket.on("sidebarTicketUpdate", handler);
  return () => socket.off("sidebarTicketUpdate", handler);
}, [socket, activeSubjectId]);

  useEffect(() => {
    const fetchTicketStatus = async () => {
      try {
        const res = await axios.get("/chat/support/ticket-status");
        const list = res.data?.status || [];
        setStatusList(list);
        setSubjectsByTab(
          list.reduce((acc, x) => ({ ...acc, [x.name]: [] }), {})
        );
        if (list.length > 0) {
          setActiveTab(list[0].name);
          handleTabChange(list[0]);
        }

      } catch (error) {
        console.error("Error fetching ticket status:", error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const res = await axios.get("/chat/support/user/get-subject", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = res.data?.subjectList || [];

        setSubjectOptions(list.map((x) => ({ label: x.name, value: x.id })));

        setSubjectsByTab((prev) => ({
          ...prev,
          Open: list.map((x) => ({
            id: x.id,
            name: x.name,
            created: new Date(),
            icon: <RiBook2Line className="text-xl" />,
          })),
        }));
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    if (token) {
      fetchTicketStatus();
      fetchSubjects();
    }
  }, [token]);

 const handleTabChange = async (tab) => {
  setActiveTab(tab.name);
  setLoadingTickets(true);
  try {
    const res = await axios.get("/chat/support/user-admin/all-tickets", {
      headers: { Authorization: `Bearer ${token}` },
      params: { p_statuslabelid: tab.id },
    });

    const tickets = Array.isArray(res.data?.viewTicket?.records)
      ? res.data.viewTicket.records
      : [];

    setSubjectsByTab(prev => ({
    ...prev,
    [tab.name]: tickets.map(t => {
      const previous = prev[tab.name]?.find(o => o.id === t.usersupportticketid);
      return {
        id: t.usersupportticketid,
        name: t.subjectname,
        status: t.statusname,
        created: t.createddate,
        unread: previous?.unread || !t.readbyuser,
        icon: <RiBook2Line className="text-xl" />,
      };
    }),
  }));
  } catch (error) {
    console.error("Error fetching tickets:", error);
  }
  finally {
    setLoadingTickets(false);
  }
};
  useImperativeHandle(ref, () => ({
    refresh: () => handleTabChange(statusList.find(x => x.name === activeTab)),
  }));

  const handleSubmitTicket = async () => {
    if (!newSubject) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setLoadingAdd(true);

    try {
      const res = await axios.post(
        "/chat/support/ticket/create-or-update-status",
        {
          p_objectiveid: newSubject,
          p_statusname: "Open",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data) {
        setOpenModal(false);
        setNewSubject(null);
        await handleTabChange(statusList.find(x => x.name === "Open"));
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setLoadingAdd(false);
    }
  };

  const subjects = subjectsByTab[activeTab] || [];

  const handleSubjectClick = (ticket) => {
    if (activeSubjectId) {
      socket.emit("leaveTicketRoom", activeSubjectId);
    }
    socket.emit("joinTicketRoom", ticket.id);
    setActiveSubject(ticket);
    setActiveSubjectId(ticket.id);
    setSubjectsByTab((prev) => {
    const updated = { ...prev };
    Object.keys(updated).forEach((tab) => {
      updated[tab] = updated[tab].map((t) =>
        t.id === ticket.id ? { ...t, unread: false } : t
      );
    });
    return updated;
  });
  };

  return (
  <div
  className="
      h-screen md:h-full w-full
      bg-white flex flex-col
      p-3 sm:p-4
      border-r border-gray-200
      shadow-md
      rounded-md
    "
>
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
          className="w-9 h-9 cursor-pointer flex items-center justify-center rounded-full bg-[#0D132D] hover:bg-[#1A234B] text-white"
        >
          <RiAddLine size={22} />
        </button>
      )}
    </div>

    <hr className="my-2 border-gray-200" />

    {/* Tabs */}
    <div className="flex gap-2 mb-5 my-2 overflow-x-auto whitespace-nowrap">
      {statusList.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab)}
          className={`px-4 cursor-pointer py-2 rounded-full text-sm border transition ${
            activeTab === tab.name
              ? "bg-[#0D132D] text-white border-[#0D132D]"
              : "bg-white text-gray-600 border-gray-300"
          }`}
        >
          {tab.name}
        </button>
      ))}
    </div>

    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
      {loadingTickets ? (
        Array.from({ length: 6 }).map((_, i) => (
          <TicketSkeleton key={i} />
        ))
      ) : subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-gray-500">
          <RiBook2Line size={32} className="mb-2 opacity-50" />
          <p>No tickets found</p>
        </div>
      ) : (
        subjects.map((s) => (
          <div
            key={s.id}
            onClick={() => handleSubjectClick(s)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
              activeSubjectId === s.id
                ? "bg-[#0D132D] text-white shadow-md"
                : s.unread
                ? "bg-blue-100 text-black shadow"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {s.icon}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-medium truncate">{s.name}</span>
              <span className="text-xs opacity-70">
                {new Date(s.created).toLocaleDateString("en-GB")}
              </span>
            </div>
            {s.unread && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ml-2 shrink-0" />
            )}
          </div>
        ))
      )}
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
});

export default Sidebar;
