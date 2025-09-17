import React, { useState, useMemo } from "react";
import { Tabs, Dropdown, Menu, Pagination, Input, Select } from "antd";
import {
  RiMore2Fill,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiEyeLine,
  RiMessage3Line,
  RiUserLine,
  RiArrowLeftLine,
} from "@remixicon/react";
import AcceptOfferModal from "./models/AcceptOfferModal"; // 👈 import modal
import { useNavigate } from "react-router-dom";


const offers = [
  {
    id: 1,
    image: "https://i.pravatar.cc/100?img=1",
    name: "Jacob Jones",
    location: "Ahmedabad, India",
    rating: 4.2,
    categories: ["Fashion", "Beauty", "Fitness", "Other"],
    offer: "$10",
    deliveryDate: "16 Jan, 2025",
    status: "in_review",
  },
  {
    id: 2,
    image: "https://i.pravatar.cc/100?img=2",
    name: "Kathryn Murphy",
    location: "Ahmedabad, India",
    rating: 4.2,
    categories: ["Fashion", "Other"],
    offer: "$10",
    deliveryDate: "19 Jan, 2025",
    status: "accepted",
  },
  {
    id: 3,
    image: "https://i.pravatar.cc/100?img=3",
    name: "Theresa Webb",
    location: "Ahmedabad, India",
    rating: 4.2,
    categories: ["Beauty"],
    offer: "$10",
    deliveryDate: "16 Jan, 2025",
    status: "rejected",
  },
  {
    id: 4,
    image: "https://i.pravatar.cc/100?img=4",
    name: "Wade Warren",
    location: "Ahmedabad, India",
    rating: 4.2,
    categories: ["Fitness", "Beauty"],
    offer: "$10",
    deliveryDate: "16 Jan, 2025",
    status: "in_review",
  },
  {
    id: 5,
    image: "https://i.pravatar.cc/100?img=5",
    name: "Robert Fox",
    location: "Ahmedabad, India",
    rating: 4.2,
    categories: ["Other"],
    offer: "$10",
    deliveryDate: "16 Jan, 2025",
    status: "in_review",
  },
];

const statusLabels = {
  in_review: "In Review",
  accepted: "Accepted",
  rejected: "Rejected",
};

const statusColors = {
  in_review: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const ViewAllOffers = () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [sortOption, setSortOption] = useState(null);


  const navigate = useNavigate();

  const pageSize = 5;

  const filteredOffers = useMemo(() => {
    let data = [...offers];

    if (searchText.trim()) {
      data = data.filter((offer) =>
        offer.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return data;
  }, [searchText]);

  const paginatedOffers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOffers.slice(start, start + pageSize);
  }, [filteredOffers, currentPage]);



  const handleAction = (type, offer) => {
    switch (type) {
      case "accept":
        setSelectedOffer(offer);
        setIsModalOpen(true);
        break;
      case "view":
        navigate(`/vendor-dashboard/offers/${offer.id}`);
        break;
      case "message":
        console.log(`Messaging ${offer.name}`);
        break;
      case "profile":
        navigate(`/vendor-dashboard/offers/influencer-details/${203}`);
        break;
      default:
        break;
    }
  };

  const handleConfirmAccept = (offer) => {
    console.log("Accepted offer:", {
      userId: offer.id,
      name: offer.name,
      offer: offer.offer,
      deliveryDate: offer.deliveryDate,
    });
    setIsModalOpen(false);
  };


  const getActionMenu = (offer) => (
    <Menu
      items={[
        {
          key: "accept",
          icon: <RiCheckboxCircleLine className="text-green-600" />,
          label: "Accept Offer",
          onClick: () => handleAction("accept", offer),
        },

        {
          key: "view",
          icon: <RiEyeLine />,
          label: "View Offer Details",
          onClick: () => handleAction("view", offer),
        },
        {
          key: "message",
          icon: <RiMessage3Line />,
          label: "Send Message",
          onClick: () => handleAction("message", offer),
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
        <button className="px-4 py-2 bg-[#0D132D] text-white rounded-lg">
          View Campaign Details
        </button>
      </div>


      {/* Search */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between">
        <Input
          size="large"
          placeholder="Search influencers..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-sm"
        />

        <Select
          size="large"
          value={sortOption}
          onChange={(value) => setSortOption(value)}
          placeholder="Sort By"
          className="w-52"
          options={[
            { value: "rating_desc", label: "Rating: High to Low" },
            { value: "rating_asc", label: "Rating: Low to High" },
            { value: "budget_desc", label: "Budget: High to Low" },
            { value: "budget_asc", label: "Budget: Low to High" },
            { value: "newest", label: "Newest" },
          ]}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead className="bg-gray-50 text-gray-700 text-sm">
            <tr>
              <th className="p-4">Influencer Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Offer</th>
              <th className="p-4">Delivery Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {paginatedOffers.map((offer) => (
              <tr
                key={offer.id}
                className="border-t border-gray-200 hover:bg-gray-100 transition"
              >
                <td className="p-4 flex gap-3 items-center">
                  <img
                    src={offer.image}
                    alt={offer.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{offer.name}</p>
                    <p className="text-xs text-gray-500">{offer.location}</p>
                    <p className="text-xs text-gray-500">
                      ⭐ {offer.rating.toFixed(1)}
                    </p>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {offer.categories.map((cat, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-0.5 text-xs rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="p-4">{offer.offer}</td>
                <td className="p-4">{offer.deliveryDate}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[offer.status]}`}
                  >
                    {statusLabels[offer.status]}
                  </span>
                </td>

                <td className="p-4">
                  <Dropdown overlay={getActionMenu(offer)} trigger={["click"]}>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <RiMore2Fill className="text-gray-600" />
                    </button>
                  </Dropdown>
                </td>
              </tr>
            ))}

            {paginatedOffers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No offers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Showing {paginatedOffers.length} of {filteredOffers.length} Results
        </p>
        <Pagination
          current={currentPage}
          total={filteredOffers.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          size="small"
        />
      </div>

      {/* Accept Offer Modal */}
      <AcceptOfferModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAccept}
        offer={selectedOffer}
      />

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
