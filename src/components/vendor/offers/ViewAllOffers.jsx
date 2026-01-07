import React, { useState, useEffect, useCallback } from "react";
import {  Dropdown, Menu, Pagination, Input, Select, Empty, Skeleton } from "antd";
import {
  RiMore2Fill,
  RiUserLine,
} from "@remixicon/react";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import InfluencerDetailsModal from "./InfluencerDetailsModal";
import OfferDetailsModal from "./OfferDetailsModal";


const statusLabels = {
  "Viewed": { text: "Viewed", style: "bg-blue-50 border border-blue-200 text-blue-700" },
  "Applied": { text: "New", style: "bg-red-50 border border-red-200 text-red-700" },
  "Selected": { text: "Selected", style: "bg-green-50 border border-green-200 text-green-700" },
  "Withdrawn": { text: "Withdrawn", style: "bg-yellow-50 border border-yellow-200 text-yellow-700" },
};

const ViewAllOffers = ({ campaignData }) => {

  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pagenumber, setPageNumber] = useState(1);
  const [pagesize, setPageSize] = useState(10); // or any default
  const [applications, setApplications] = useState([])
  const [totalOffers, setTotalOffers] = useState(0);
  const [showInfluencerModal, setShowInfluencerModal] = useState(false);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState(null);
  const [hasSelectedApplication, setHasSelectedApplication] = useState(false);


  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);


  const { token } = useSelector((state) => state.auth);


  const handleViewOffer = async (offer) => {
    if (offer.status === "Applied" && offer.status !== "Viewed") {
      try {
        await axios.post(
          `/vendor/application-status`,
          {
            p_applicationid: Number(offer.applicationid),
            p_statusname: "Viewed",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setApplications((prev) =>
          prev.map((o) =>
            o.applicationid === offer.applicationid
              ? { ...o, status: "Viewed" }
              : o
          )
        );
      } catch (error) {
        console.error("Failed to mark as viewed", error);
      }
    }

    // ✅ Open the Offer Details modal
    setSelectedOfferId(offer.applicationid);
    setShowOfferModal(true);
  };

  const handleViewProfile = (offer) => {
    setSelectedInfluencerId(offer.id);
    setShowInfluencerModal(true);
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
      onClick={(e) => e.domEvent.stopPropagation()}
      items={[
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

      const res = await axios.get(`/vendor/view-all-offers/${campaignData?.id}`, {
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
      // console.log(records)
      setApplications(records)
      setTotalOffers(totalcount)

      // ✅ Check if any application is "Selected"
      const hasSelected = records.some(app => app.status === "Selected");
      setHasSelectedApplication(hasSelected);

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [pagenumber, pagesize, searchTerm, token, campaignData?.id])

  useEffect(() => {
    getApplications()
  }, [getApplications])

  const refreshApplications = () => {
    getApplications(); // already defined in your component
  };


  return (
    <div className="text-sm ">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:items-center justify-between mb-4">
        <h2 className="text-xl font-bold">All Applications</h2>

      </div>

      {/* Search */}
      <div className="mb-4 p-3 bg-white rounded-t-2xl flex flex-col sm:flex-row justify-between">
        <Input
          size="large"
          prefix={<SearchOutlined />}
          placeholder="Search Application"
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
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-gray-100 text-gray-900 text-sm">
            <tr>
              <th className="p-4">Influencer Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Offered Budget</th>

              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">

            {loading ? (
              <>
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton.Avatar active size="large" shape="circle" />
                        <div className="flex-1">
                          <Skeleton.Input style={{ width: 120 }} active size="small" />
                          <Skeleton.Input style={{ width: 100, marginTop: 4 }} active size="small" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Skeleton.Input style={{ width: 80 }} active size="small" />
                    </td>
                    <td className="p-4">
                      <Skeleton.Input style={{ width: 60 }} active size="small" />
                    </td>
                    <td className="p-4">
                      <Skeleton.Button active size="small" shape="round" />
                    </td>
                    <td className="p-4">
                      <Skeleton.Avatar active shape="circle" size="small" />
                    </td>
                  </tr>
                ))}
              </>
            )
              : applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <Empty
                      description="No Applications found."
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </td>
                </tr>
              ) : (
                applications?.map((offer) => (
                  <tr
                    key={offer.applicationid}
                    className="border-t border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => handleViewOffer(offer)}
                  >

                    <td className="p-4 flex gap-3 items-center">
                      <img
                        src={offer.photopath}
                        alt={offer.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
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

                    <td className="p-4">₹ {offer.amount}</td>

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
                        <button
                          className="p-2 rounded-full hover:bg-gray-100"
                          onClick={(e) => e.stopPropagation()}
                        >
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


      <InfluencerDetailsModal
        visible={showInfluencerModal}
        influencerId={selectedInfluencerId}
        onClose={() => {
          setShowInfluencerModal(false);
          setSelectedInfluencerId(null);
        }}
      />

      <OfferDetailsModal
        visible={showOfferModal}
        id={selectedOfferId}
        onClose={() => {
          setShowOfferModal(false);
          setSelectedOfferId(null);
        }}
        onStatusChange={refreshApplications}
        hasSelectedApplication={hasSelectedApplication}
      />

    </div>
  );
};

export default ViewAllOffers;
