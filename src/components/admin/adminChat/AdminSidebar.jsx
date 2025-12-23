import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Modal } from "antd";
import axios from "axios";
import { RiBook2Line, RiTicket2Line } from "@remixicon/react";
import { useSelector } from "react-redux";
import { getSocket } from "../../../sockets/socket";
import useSocketRegister from "../../../sockets/useSocketRegister";

const AdminSidebar = forwardRef (({ setActiveSubject }, ref) => {
  useSocketRegister();
  const refresh = async () => {
  const active = statusList.find(x => x.name === activeTab);
  if (active) {
    await fetchTickets(active);
  }
};

useImperativeHandle(ref, () => ({
  refresh,
}));
  const { token , userId } = useSelector((state) => state.auth);
  const socket = getSocket();
  const [activeTab, setActiveTab] = useState("");
  const [statusList, setStatusList] = useState([]);
  const [subjectsByTab, setSubjectsByTab] = useState({});
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [ticketModalData, setTicketModalData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handler = ({ ticketId, readbyadmin }) => {
    setSubjectsByTab(prev =>
      Object.fromEntries(
        Object.entries(prev).map(([tab, tickets]) => [
          tab,
          tickets.map(t =>
            String(t.id) === String(ticketId)
              ? {
                  ...t,
                  unread: !readbyadmin && String(ticketId) !== String(activeSubjectId)
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

        setStatusList(list.map((x) => ({ id: x.id, name: x.name })));

        if (list.length > 0) {
          setActiveTab(list[0].name);
        }
      } catch (error) {
        console.error("Error fetching ticket status:", error);
      }
    };

    fetchTicketStatus();
  }, []);

  useEffect(() => {
    if (!activeTab || statusList.length === 0) return;

    const selected = statusList.find((t) => t.name === activeTab);
    if (!selected) return;

    fetchTickets(selected);
  }, [activeTab, statusList]);

  const fetchTickets = async (tab) => {
    setLoading(true);
    setSubjectsByTab((prev) => ({ ...prev, [tab.name]: [] }));

    try {
      const res = await axios.get("/chat/support/user-admin/all-tickets", {
        headers: { Authorization: `Bearer ${token}` },
        params: { p_statuslabelid: tab.id },
      });

      const tickets = Array.isArray(res.data?.viewTicket?.records)
        ? res.data.viewTicket.records
        : [];

      const mapped = tickets.map((t) => {
      return {
        id: t.usersupportticketid,
        name: t.subjectname,
        status: t.statusname,
        createddate: t.createddate,
        userfullname: t.userfullname,
        userphoto: t.userphoto,
        userrole: t.userrole,
        adminfullname: t.adminfullname,
        adminphoto: t.adminphoto,
        unread:
          t.statusname !== "Open" && 
          t.statusname !== "Closed" && 
          !t.readbyadmin,
        icon: <RiBook2Line className="text-xl" />,
        ...t,
      };
    });

      setSubjectsByTab((prev) => ({ ...prev, [tab.name]: mapped }));
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectClick = async (ticket) => {
  try {
    const wasAlreadyInprogress = activeTab === "Inprogress";

    setActiveSubject(ticket);
    setActiveSubjectId(ticket.id);

    await axios.post(
      "/chat/support/ticket/create-or-update-status",
      {
        p_usersupportticketid: ticket.id,
        p_objectiveid: null,
        p_statusname: "Inprogress",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSubjectsByTab((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((tab) => {
        updated[tab] = updated[tab].map((t) =>
          t.id === ticket.id
            ? {
                ...t,
                statusname: "Inprogress",
                unread: false,
                isclaimedbyadmin: true,
              }
            : t
        );
      });

      return updated;
    });
    if (!wasAlreadyInprogress) {
      setActiveTab("Inprogress");
    }

  } catch (err) {
    console.error("Error updating ticket status:", err);
  }
};

  const subjects = subjectsByTab[activeTab] || [];

  const openChat = (ticket) => {
    setActiveSubject(ticket);
    setActiveSubjectId(ticket.id);
    setTicketModalData(null);
  };

  return (
     <div className="
          h-screen md:h-full w-full
          bg-white flex flex-col
          p-3 sm:p-4
          border-r border-gray-200
          shadow-md
          rounded-md
        " >
      <h1 className="text-xl font-bold text-gray-900">Support</h1>
      <p className="text-gray-500 text-sm mb-3">
        Your conversations related to subjects
      </p>

      <hr className="my-2 border-gray-200" />

      {/* Tabs */}
      <div className="flex gap-2 mb-5 my-2 overflow-x-auto whitespace-nowrap">
      {statusList.map((tab) => (
        <button
           key={tab.id}
            onClick={() => {
              setActiveTab(tab.name);
              setTicketModalData(null);
            }}
          className={`px-4 py-2 rounded-full text-sm border transition ${
            activeTab === tab.name
              ? "bg-[#0D132D] text-white border-[#0D132D]"
              : "bg-white text-gray-600 border-gray-300"
          }`}
        >
          {tab.name}
        </button>
      ))}
    </div>

      {/* Ticket List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {loading && (
          <p className="text-gray-400 text-sm text-center">Loading...</p>
        )}

        {!loading && subjects.length === 0 && (
          <p className="text-gray-400 text-sm text-center">No tickets found</p>
        )}

        {!loading &&
          subjects.map((s) => (
            <div
              key={s.id}
              onClick={() => setTicketModalData(s)}
              className={`p-3 rounded-lg cursor-pointer transition flex flex-col gap-1
                ${
                  activeSubjectId === s.id
                    ? "bg-[#0D132D] text-white shadow-md"
                    : s.unread
                    ? "bg-blue-100 text-black shadow"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }
              `}
            >
              <div className="flex items-center gap-2">
                {s.icon}
                <span className="font-semibold text-[15px] truncate flex-1">
                  {s.name}
                </span>
                {s.unread && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></div>
                )}
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-[12px] opacity-75">
                  {new Date(s.createddate).toLocaleDateString("en-GB")}
                </span>

                <div className="flex gap-2">
                  <div className="flex gap-2">
                    {s.statusname === "Resolved" ? (
                      s.isclaimed ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubjectClick(s);
                          }}
                          className="text-[11px] px-2 py-1 rounded font-medium transition bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Claim
                        </button>
                      ) : null
                    ) : s.isclaimed ? (
                      !s.isclaimedbyadmin ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubjectClick(s);
                          }}
                          className="text-[11px] px-2 py-1 rounded font-medium transition bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Claim
                        </button>
                      ) : (
                        <button
                          disabled
                          className="text-[11px] px-2 py-1 rounded font-medium transition bg-gray-400 text-white cursor-not-allowed"
                        >
                          Claimed
                        </button>
                      )
                    ) : null}

                    {(
                      (s.statusname !== "Open" && s.isclaimedbyadmin === true) ||
                      s.statusname === "Resolved"
                    ) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openChat(s);
                        }}
                        className="text-[11px] px-2 py-1 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
                      >
                        Chat
                      </button>
                    )}
                  </div>
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
                {ticketModalData?.statusname}
              </span>
            </div>

            {/* Ticket details grid */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Ticket Number</p>
                  <p className="font-medium">{ticketModalData?.ticketnumber}</p>
                </div>

                <div>
                  <p className="text-gray-500">Subject</p>
                  <p className="font-medium">{ticketModalData?.subjectname}</p>
                </div>

                <div>
                  <p className="text-gray-500">Created On</p>
                  <p className="font-medium">
                    {new Date(ticketModalData?.createddate).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Resolved On</p>
                  <p className="font-medium">
                    {ticketModalData?.resolveddate
                      ? new Date(ticketModalData.resolveddate).toLocaleString()
                      : "—"}
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
                      src={ticketModalData.userphoto}
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">
                        {ticketModalData.userfullname}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ticketModalData.userrole}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Assigned to */}
                <div>
                  <p className="text-gray-500 text-sm mb-1 font-medium">Assigned To</p>

                  {ticketModalData?.adminfullname ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={ticketModalData.adminphoto || "/default.jpg"}
                        alt="admin"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <p className="font-medium">{ticketModalData.adminfullname}</p>
                    </div>
                  ) : (
                    <p className="text-gray-600 font-medium">—</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 border-t border-gray-300 pt-4">
              <button
                onClick={() => setTicketModalData(null)}
                className="px-4 py-2 border rounded font-medium text-red-600 hover:bg-red-50"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
});

export default AdminSidebar;
