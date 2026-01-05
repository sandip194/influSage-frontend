import { RiAddLine, RiArrowLeftLine } from "react-icons/ri";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { CloseCircleFilled } from "@ant-design/icons";
import { Tooltip, Skeleton } from "antd";
import { getSocket } from "../../sockets/socket";
import useSocketRegister from "../../sockets/useSocketRegister";

const SidebarSkeleton = () => (
  <div className="px-4 py-3 flex items-center gap-3">
    <Skeleton.Avatar active size="large" shape="circle" />
    <div className="flex-1">
      <Skeleton.Input active size="small" style={{ width: "70%", marginBottom: 6 }} />
      <Skeleton.Input active size="small" style={{ width: "40%" }} />
    </div>
  </div>
);

export default function SidebarVendor({ onSelectChat }) {
    useSocketRegister();
  const socket = getSocket();
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [search, setSearch] = useState("");
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [loadingUnread, setLoadingUnread] = useState(false);
  const selectChatFromOutside = location.state?.selectChatFromOutside || null;
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [loadingInfluencers, setLoadingInfluencers] = useState(false);


  // ✅ useCallback to memoize function references
  const fetchCampaigns = useCallback(async () => {
    if (!token) return;

    try {
    setLoadingCampaigns(true);

      const response = await axios.get(`/chat/conversationsdetails`, {
        params: { p_search: search.trim() || "" },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const formatted = (response.data.data || []).map((c) => ({
          ...c,
          campaignphoto: c.campaignphoto ? c.campaignphoto : null,
        }));

        // Only update state if data actually changed
        setCampaigns((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(formatted)) {
            return formatted;
          }
          return prev;
        });

        const allInfluencers = formatted
          .flatMap((c) =>
            (c.influencers || []).map((v) => ({
              ...v,
              campaignId: c.campaignid,
              campaignName: c.campaignname,
              campaignPhoto: c.campaignphoto,
              img: v.userphoto ? v.userphoto : null,
              name: `${v.firstname || ""} ${v.lastname || ""}`.trim(),
              message: v.lastmessage || "No message",
              time: v.lastmessagedate || "",
            }))
          )
          .sort((a, b) => new Date(b.time) - new Date(a.time));

        setInfluencers((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(allInfluencers)) {
            return allInfluencers;
          }
          return prev;
        });
      }
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }finally {
    setLoadingCampaigns(false);
  }
  }, [token, search]);

  const fetchUnreadMessages = useCallback(async () => {
    try {
      setLoadingUnread(true);
      const res = await axios.get(`/chat/unread-messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.data) {
        setUnreadMessages((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(res.data.data)) {
            return res.data.data;
          }
          return prev;
        });
      }
    } catch (err) {
      console.error("Failed to fetch unread messages:", err);
    } finally {
      setLoadingUnread(false);
    }
  }, [token]);

  useEffect(() => {
  fetchCampaigns();
  fetchUnreadMessages();

  if (!socket) {
    return;
  }

  const handleIncoming = () => {
    fetchUnreadMessages();
    fetchCampaigns();
  };

  socket.off("receiveMessage", handleIncoming);
  socket.on("receiveMessage", handleIncoming);

  return () => {
    socket.off("receiveMessage", handleIncoming);
  };

}, [socket, fetchCampaigns, fetchUnreadMessages]);



  // ✅ useMemo for derived data
  const filteredInfluencers = useMemo(() => {
    if (!selectedCampaign) return [];
    return influencers.filter(
      (inf) => inf.campaignId === selectedCampaign.campaignid
    );
  }, [influencers, selectedCampaign]);

  useEffect(() => {
    if (selectChatFromOutside && campaigns.length > 0) {
      const { influencerid, campaignid, conversationid } = selectChatFromOutside;

      const campaign = campaigns.find((c) => c.campaignid === campaignid);

      if (campaign) {
        setSelectedCampaign(campaign);

        const influencer = campaign.influencers.find(
          (i) => i.influencerid === influencerid
        );

        if (influencer) {
          setSelectedInfluencer(influencerid);

          onSelectChat({
            conversationid: conversationid || influencer.conversationid,
            id: conversationid || influencer.conversationid,
            name: `${influencer.firstname} ${influencer.lastname}`,
            img: influencer.userphoto || null,
            influencerid: influencer.influencerid,
            campaign,
          });
        }
      }

      navigate(location.pathname, { replace: true });
    }
  }, [selectChatFromOutside, campaigns]);

  useEffect(() => {
  if (selectedCampaign) {
    const timer = setTimeout(() => {
      setLoadingInfluencers(false);
    }, 300);

    return () => clearTimeout(timer);
  }
}, [selectedCampaign]);

  return (
    <div className="h-full flex flex-col md:flex-row gap-4">
      {/* --- Campaigns Panel --- */}
      <div
        className={`flex-1 w-full h-full flex flex-col bg-white shadow-md rounded-2xl overflow-hidden
              ${selectedCampaign ? "hidden md:flex" : "flex"}`}
      >
        {/* Header */}
        <div className="w-full p-4 flex items-center justify-between border-b border-gray-200">
          <h2 className="font-semibold text-gray-700 text-sm md:text-base w-full text-left">
            Campaigns
          </h2>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-2 relative">
            <svg
              className="w-5 h-5 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 12.65z" />
            </svg>

            <input
              placeholder="Search campaigns..."
              className="w-full outline-none text-sm pr-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <Tooltip title="Clear search" placement="top">
                <CloseCircleFilled
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-150"
                />
              </Tooltip>
            )}
          </div>
        </div>

        <hr className="my-2 border-gray-200" />

        {/* Campaign List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {loadingCampaigns ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <SidebarSkeleton key={idx} />
            ))
          ) : campaigns.length > 0 ? (
            campaigns.map((campaign) => {
              const isSelected =
                selectedCampaign?.campaignid === campaign.campaignid;

              const hasUnread = campaign.influencers?.some(
                (inf) => inf.lastmessage && inf.readbyvendor === false
              );

              return (
              <div
                key={campaign?.campaignid}
                onClick={() => {
                  setSelectedCampaign(campaign);
                  setSelectedInfluencer(null);
                  setLoadingInfluencers(true);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300
                  ${
                    isSelected
                      ? "bg-gray-200 border-l-4 border-gray-500 shadow-sm scale-[1.01]"
                      : "hover:bg-gray-100"
                  }
                  ${hasUnread ? "bg-gray-100 shadow-md scale-[1.02]" : ""}`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={campaign.campaignphoto}
                    alt={campaign.campaignname}
                    onError={(e) => (e.target.src = "/defualt.jpg")}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="overflow-hidden max-w-[140px] min-w-0">
                    <div className="font-semibold text-sm text-gray-800 truncate">
                      {campaign.campaignname}
                    </div>
                    <div
                      className={`text-xs truncate ${
                        hasUnread
                          ? "text-gray-900 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      { hasUnread
                          ? "New message"
                          : campaigns.ishtml
                            ? "New campaign invitation"
                            : campaigns.lastmessage || "No messages yet"
                      }
                    </div>
                  </div>
                </div>
                {hasUnread && (
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-4 text-sm text-gray-400">No campaigns found</div>
        )}
        </div>
      </div>

      {/* --- Influencers Panel --- */}
      <div
        className={`flex-1 w-full h-full flex flex-col bg-white shadow-md rounded-2xl overflow-hidden
              ${!selectedCampaign ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <button
            onClick={() => {
              setSelectedCampaign(null);
              setSelectedInfluencer(null);
            }}
            className="md:hidden mr-2 p-2 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
            aria-label="Back"
          >
            <RiArrowLeftLine size={20} />
          </button>
          <h2 className="font-semibold text-gray-700 text-sm md:text-base flex-grow">
            Influencers
          </h2>
          <Tooltip title="Search Influencers">
            <button
              onClick={() => navigate("/vendor-dashboard/browse-influencers")}
              className="w-9 h-9 bg-[#0D132D] cursor-pointer text-white rounded-full flex items-center justify-center hover:bg-[#0a0e1f] transition"
            >
              <RiAddLine />
            </button>
          </Tooltip>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {loadingInfluencers ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <SidebarSkeleton key={idx} />
            ))
          ) : filteredInfluencers.length > 0 ? (
            filteredInfluencers.map((inf) => {
              const isSelected = selectedInfluencer === inf.influencerid;
              const unread = inf.lastmessage && inf.readbyvendor === false;

              return (
                <div
                  key={`${inf.campaignId}-${inf.influencerid}`}
                  onClick={() => {
                    setSelectedInfluencer(inf.influencerid);
                    setCampaigns((prev) =>
                      prev.map((c) =>
                        c.campaignid === selectedCampaign.campaignid
                          ? {
                              ...c,
                              influencers: c.influencers.map((i) =>
                                i.conversationid === inf.conversationid
                                  ? { ...i, readbyvendor: true }
                                  : i
                              ),
                            }
                          : c
                      )
                    );

                    setInfluencers((prev) =>
                      prev.map((i) =>
                        i.conversationid === inf.conversationid
                          ? { ...i, readbyvendor: true }
                          : i
                      )
                    );

                    onSelectChat({
                      ...inf,
                      campaign: selectedCampaign,
                      canstartchat: inf.canstartchat,
                      date: Date.now(),
                    });

                    setUnreadMessages((prev) =>
                      prev.filter((msg) => String(msg.userid) !== String(inf.influencerid))
                    );
                  }}

                  className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300
                    ${
                      isSelected
                        ? "bg-gray-200 border-l-4 border-gray-500 shadow-sm scale-[1.01]"
                        : "hover:bg-gray-100"
                    }
                    ${unread ? "bg-gray-100 shadow-md scale-[1.02]" : ""}`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {inf.img ? (
                      <img
                        src={inf.img}
                        alt={inf.name}
                        onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                        {inf.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate max-w-[160px]">
                        {inf.fullname}
                      </div>
                      <div
                        className={`text-sm truncate max-w-[180px] ${
                          unread
                            ? "text-gray-900 font-semibold"
                            : "text-gray-500"
                        }`}
                      >
                        {
                          unread
                            ? "New message"
                            : inf.ishtml
                              ? "Campaign invitation received"
                              : inf.lastmessage || "No messages yet"
                        }
                      </div>
                    </div>
                  </div>

                  {unread && (
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-gray-400 text-sm">
              Please select a campaign to see influencers
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
