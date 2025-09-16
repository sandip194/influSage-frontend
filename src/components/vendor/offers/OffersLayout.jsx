import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const offers = Array.from({ length: 120 }, (_, i) => ({
    id: i + 1,
    image: `https://picsum.photos/100/100?random=${i}`,
    campaignName: "Instagram Campaign",
    budget: "$124.32",
    dateStarted: "16 Jan, 2025",
    dueDate: "18 Jan, 2025",
    totalOffers: 10,
}));

const OffersLayout = () => {
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 8;
    const navigate = useNavigate();

    const filteredOffers = useMemo(() => {
        return offers.filter((offer) =>
            offer.campaignName.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText]);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredOffers.slice(start, start + pageSize);
    }, [filteredOffers, page]);

    const totalPages = Math.ceil(filteredOffers.length / pageSize);

    return (
        <div className="w-full ">

            <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Offers</h2>
                <p className="text-gray-600 text-sm">Track Your Offers Here</p>
            </div>

            {/* Top Controls */}
            <div className="flex bg-white p-3 rounded-t-2xl flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full  px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f122f]"
                />

                <select className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg text-gray-700">
                    <option>Sort By</option>
                    <option>hight to low</option>
                    <option>low to high</option>
                </select>
            </div>

            {/* Card Wrapper */}
            <div className="bg-white rounded-b-2xl overflow-hidden ">

                {/* Heading Row */}
                <div className="flex items-center px-4 py-4 text-gray-500 text-sm font-medium border-b border-gray-300 bg-gray-100">
                    <div className="flex items-center gap-4 w-1/4">
                        <span>Campaign Name</span>
                    </div>
                    <div className="hidden sm:flex justify-between w-3/4 pr-2">
                        <div className="w-1/5 text-center">Budget</div>
                        <div className="w-1/5 text-center">Start Date</div>
                        <div className="w-1/5 text-center">Due Date</div>
                        <div className="w-1/5 text-center">Total Offers</div>
                        <div className="w-1/5 text-center">Action</div>
                    </div>
                </div>

                {/* Offer Rows */}
                {paginatedData.map((offer) => (
                    <div
                        key={offer.id}
                        className="flex items-center justify-between px-4 py-2 border-b border-gray-200 hover:bg-gray-100 transition"
                    >
                        {/* Campaign Name and Icon */}
                        <div className="flex items-center gap-4 w-1/4 min-w-0">
                            <img
                                src={offer.image}
                                alt="Platform"
                                className="w-10 h-10 object-cover rounded-full"
                            />
                            <div className="flex flex-col truncate">
                                <span className="font-medium truncate">{offer.campaignName}</span>
                            </div>
                        </div>

                        {/* Budget, Dates, Offers, Button */}
                        <div className="hidden sm:flex items-center justify-between w-3/4 pr-2 text-sm text-gray-700">
                            <div className="w-1/5 text-center">{offer.budget}</div>
                            <div className="w-1/5 text-center">{offer.dateStarted}</div>
                            <div className="w-1/5 text-center">{offer.dueDate}</div>
                            <div className="w-1/5 text-center font-medium">
                                {offer.totalOffers} Offers
                            </div>
                            <div className="w-1/5 text-center">
                                <button
                                    onClick={() =>
                                        navigate(`/vendor-dashboard/offers/view-all-offers`)
                                    }
                                    className="bg-[#0f122f] hover:bg-[#1a1d3a] text-white px-4 py-2 rounded-full text-sm"
                                >
                                    View Offers
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* No Results */}
                {paginatedData.length === 0 && (
                    <div className="text-center text-gray-500 py-8">No offers found</div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm">
                <p className="text-gray-600">
                    Showing {paginatedData.length} of {filteredOffers.length} Results
                </p>
                <div className="flex gap-2 mt-2 sm:mt-0">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1.5 rounded-lg border ${page === i + 1
                                    ? "bg-[#0f122f] text-white border-[#0f122f]"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OffersLayout;
