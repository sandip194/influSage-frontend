import React, { useState, useEffect, useCallback } from "react";
import { Tabs, Dropdown, Menu, Pagination, Input, Select, Empty } from "antd";
import {
  RiMore2Fill,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiEyeLine,
  RiMessage3Line,
  RiUserLine,
  RiArrowLeftLine,
} from "@remixicon/react";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";


const statusLabels = {
  "Viewed": { text: "Viewed", style: "bg-blue-50 border border-blue-200 text-blue-700" },
  "Applied": { text: "New", style: "bg-yellow-50 border border-yellow-200 text-yellow-700" },
  "Selected": { text: "Selected", style: "bg-green-50 border border-green-200 text-green-700" },
};



const ViewAllOffers = () => {

  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pagenumber, setPageNumber] = useState(1);
  const [pagesize, setPageSize] = useState(10); // or any default
  const [applications, setApplications] = useState([])
  const [totalOffers, setTotalOffers] = useState(0);


  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();


  const handleViewOffer = async (offer) => {
    console.log(offer.status)
    if (offer.status === "Applied" && offer.status !== "Viewed") {
      try {
        await axios.post(
          `/vendor/application-status`,
          {
            p_applicationid: Number(offer.applicationid),
            p_statusname: "Viewed"
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setApplications((prev) =>
          prev.map((o) =>
            o.applicationid === offer.applicationid
              ? { ...o, status: "true" }
              : o
          )
        );
      } catch (error) {
        console.error("Failed to mark as viewed", error);
      }
    }

    navigate(`/vendor-dashboard/offers/${offer.applicationid}`);
  };

  const handleViewProfile = (offer) => {
    navigate(`/vendor-dashboard/offers/influencer-details/${offer.id}`);
  };

  // Action handler map
  const actionHandlers = {
    view: handleViewOffer,
    profile: handleViewProfile,
  };

  // Central dispatcher
  const handleAction = (type, offer) => {
    const handler = actionHandlers[type];
    if (handler) handler(offer);
  };


  const getActionMenu = (offer) => (
    <Menu
      items={[

        {
          key: "view",
          icon: <RiEyeLine />,
          label: "View Offer Details",
          onClick: () => handleAction("view", offer),
        },
        {
          key: "profile",
          icon: <RiUserLine />,
          label: "View Influencer Profile",
          onClick: () => handleAction("profile", offer),
        },
      ]}
    />
  );

  const getApplications = useCallback(async () => {
    try {
      setLoading(true)

      const res = await axios.get(`/vendor/view-all-offers/${id}`, {
        params: {
          pagenumber,
          pagesize,
          p_search: searchTerm.trim(),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const { records, totalcount } = res.data.data;
      console.log(records)
      setApplications(records)
      setTotalOffers(totalcount)

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [pagenumber, pagesize, searchTerm, token])

  useEffect(() => {
    getApplications()
  }, [getApplications])

  return (
    <div className="text-sm">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 mb-2"
      >
        <RiArrowLeftLine /> Back
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:items-center justify-between mb-4">
        <h2 className="text-xl font-bold">View All Offers</h2>
        <button
          onClick={() => navigate(`/vendor-dashboard/offers/campaignDetails/${id}`)}
          className="px-4 py-2 bg-[#0D132D] text-white rounded-lg"
        >
          View Campaign Details
        </button>

      </div>


      {/* Search */}
      <div className="mb-4 p-3 bg-white rounded-t-2xl flex flex-col sm:flex-row justify-between">
        <Input
          size="large"
          prefix={<SearchOutlined />}
          placeholder="Search campaigns"
          className="w-full sm:w-auto flex-1"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            const trimmedInput = searchInput.trim();

            if ((e.key === "Enter" || e.key === " ") && trimmedInput !== "") {
              setPageNumber(1);
              setSearchTerm(trimmedInput);
            }

            if (e.key === "Enter" && trimmedInput === "") {
              // Reset search
              setSearchTerm("");
              setPageNumber(1);
            }
          }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead className="bg-gray-100 text-gray-900 text-sm">
            <tr>
              <th className="p-4">Influencer Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Offer</th>

              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">

            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Loading Offers...
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10">
                  <Empty description="No Applications found." />
                </td>
              </tr>
            ) : (
              applications?.map((offer) => (
                <tr
                  key={offer.applicationid}
                  className="border-t border-gray-200 hover:bg-gray-100 transition"
                >
                  <td className="p-4 flex gap-3 items-center">
                    <img
                      src={`${BASE_URL}/${offer.photopath}`}
                      alt={offer.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{offer.firstname} {offer.lastname}</p>
                      <p className="text-xs text-gray-500">{offer.statename}-{offer.countryname}</p>
                      {/* <p className="text-xs text-gray-500">
                      ⭐ {offer.rating?.toFixed(1)}
                    </p> */}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {offer.categories?.map((cat) => (
                        <span
                          key={cat.categoryid}
                          className="bg-gray-100 text-gray-700 px-2 py-0.5 text-xs rounded-full"
                        >
                          {cat.categoryname}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-4">{offer.amount}</td>

                  <td className="p-4">
                    {(() => {
                      const { text, style } = statusLabels[offer.status];
                      return (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${style}`}>
                          {text}
                        </span>
                      );
                    })()}
                  </td>


                  <td className="p-4">
                    <Dropdown overlay={getActionMenu(offer)} trigger={["click"]}>
                      <button className="p-2 rounded-full hover:bg-gray-100">
                        <RiMore2Fill className="text-gray-600" />
                      </button>
                    </Dropdown>
                  </td>
                </tr>
              ))
            )

            }

          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <Pagination
          current={pagenumber}
          pageSize={pagesize}
          total={totalOffers}
          onChange={(page, pageSize) => {
            setPageNumber(page);
            setPageSize(pageSize);
          }}
          showSizeChanger
          pageSizeOptions={['10', '15', '25', '50']}
        />
      </div>

      {/* Accept Offer Modal */}
      {/* <AcceptOfferModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAccept}
        offer={selectedOffer}
      /> */}

      {/* Reject Offer Modal */}
      {/* <RejectOfferModal
        open={isRejectModalOpen}
        onCancel={() => setIsRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
        offer={selectedOffer}
      /> */}

    </div>
  );
};

export default ViewAllOffers;
