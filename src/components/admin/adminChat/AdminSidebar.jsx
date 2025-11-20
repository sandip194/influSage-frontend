import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import axios from "axios";
import { RiBook2Line, RiTicket2Line } from "@remixicon/react";
import { useSelector } from "react-redux";

const AdminSidebar = ({ setActiveSubject }) => {
  const { token } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("");
  const [statusList, setStatusList] = useState([]);
  const [subjectsByTab, setSubjectsByTab] = useState({});
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [ticketModalData, setTicketModalData] = useState(null);
  const [loading, setLoading] = useState(false);

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

    const mapped = tickets.map((t) => ({
      id: t.usersupportticketid,
      name: t.subjectname,
      status: t.statusname,
      createddate: t.createddate,
      userfullname: t.userfullname,
      userphoto: t.userphoto,
      userrole: t.userrole,
      adminfullname: t.adminfullname,
      adminphoto: t.adminphoto,
      icon: <RiBook2Line className="text-xl" />,
      ...t,
    }));

    setSubjectsByTab((prev) => ({ ...prev, [tab.name]: mapped }));

  } catch (error) {
    console.error("Error fetching tickets:", error);
  } finally {
    setLoading(false);
  }
};


  const handleSubjectClick = async (ticket) => {
  try {
    setActiveSubject(ticket);
    setActiveSubjectId(ticket.id);

    await axios.post(
      "/chat/support/ticket/create-or-update-status",
      {
        p_usersupportticketid: ticket.id,
        p_objectiveid: null,
        p_statusname: "Inprogress"
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setActiveTab("Inprogress");

    setTimeout(() => {
      const list = subjectsByTab["Inprogress"];
      if (list) {
        const updated = list.find(x => x.id === ticket.id);
        if (updated) {
          setActiveSubject(updated);
          setActiveSubjectId(updated.id);
        }
      }
    }, 300);

  } catch (err) {
    console.error("Error updating ticket status:", err);
  }
};


  const subjects = subjectsByTab[activeTab] || [];
  

  return (
    <div className="h-full w-[400px] bg-white flex flex-col p-4 border-r border-gray-200 shadow-md rounded-md">
      <h1 className="text-xl font-bold text-gray-900">Support</h1>
      <p className="text-gray-500 text-sm mb-3">
        Your conversations related to subjects
      </p>

      <hr className="my-2 border-gray-200" />

      {/* Tabs */}
      <div className="flex gap-2 mb-4 my-2">
        {statusList.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.name); 
              setTicketModalData(null);
            }}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
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
              className={`rounded-xl border cursor-pointer transition p-3 ${
                activeSubjectId === s.id
                  ? "bg-[#0D132D] border-[#0D132D] text-white shadow-md"
                  : "bg-white border-gray-200 hover:bg-gray-100 text-[#0D132D]"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  {s.icon}
                  <span className="font-semibold text-[15px] truncate">
                    {s.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-[12px] opacity-75">
                  {new Date(s.createddate).toLocaleDateString("en-GB")}
                </span>

                <div className="flex gap-2">
                  {s.isclaimed === true && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubjectClick(s);
                      }}
                      className="text-[11px] px-2 py-1 rounded font-medium transition bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Claim
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTicketModalData(s);
                    }}
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
                {ticketModalData.statusname}
              </span>
            </div>

            {/* Ticket details grid */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Ticket ID</p>
                  <p className="font-medium">{ticketModalData.usersupportticketid}</p>
                </div>

                <div>
                  <p className="text-gray-500">Subject</p>
                  <p className="font-medium">{ticketModalData.subjectname}</p>
                </div>

                <div>
                  <p className="text-gray-500">Created On</p>
                  <p className="font-medium">
                    {new Date(ticketModalData.createddate).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Resolved On</p>
                  <p className="font-medium">
                    {ticketModalData.updateddate
                      ? new Date(ticketModalData.updateddate).toLocaleString()
                      : "-"}
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
                      <p className="font-medium">{ticketModalData.userfullname}</p>
                      <p className="text-xs text-gray-500">
                        {ticketModalData.userrole}
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
                        ticketModalData.adminphoto ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt="admin"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">
                        {ticketModalData.adminfullname || "Not assigned"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Admin
                      </p>
                    </div>
                  </div>
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
};

export default AdminSidebar;
