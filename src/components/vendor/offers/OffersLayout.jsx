import { RiArrowDownSLine } from "@remixicon/react";
import { Pagination, Select, Empty, Input } from "antd";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";



const OffersLayout = () => {

    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(false)

    const [pagenumber, setPageNumber] = useState(1);
    const [pagesize, setPageSize] = useState(10); // or any default

    const [totalOffers, setTotalOffers] = useState(0);
    const [sortby, setSortBy] = useState("createddate");
    const [sortorder, setSortOrder] = useState("desc");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const sortOptions = [
        { value: "createddate_desc", label: "Newest" },
        { value: "estimatedbudget_asc", label: "Price: Low to High" },
        { value: "estimatedbudget_desc", label: "Price: High to Low" },
    ];


    const getAllOffers = useCallback(async () => {
        try {
            setLoading(true)
            const res = await axios.get("vendor/all-offers", {
                params: {
                    sortby,
                    sortorder,
                    pagenumber,
                    pagesize,
                    p_search: searchTerm.trim(),
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const { records, totalcount } = res.data.data;
            setOffers(records)
            setTotalOffers(totalcount)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [sortby, sortorder, pagenumber, pagesize, searchTerm, token])

    useEffect(() => {
        getAllOffers()
    }, [getAllOffers])
    return (
        <div className="w-full ">

            <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Offers</h2>
                <p className="text-gray-600 text-sm">Track Your Offers Here</p>
            </div>

            {/* Top Controls */}
            <div className="flex bg-white p-3 rounded-t-2xl flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
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

                <Select
                    size="large"
                    value={`${sortby}_${sortorder}`}
                    onChange={(value) => {
                        const [newSortBy, newSortOrder] = value.split("_");
                        setSortBy(newSortBy);
                        setSortOrder(newSortOrder);
                        setPageNumber(1); // Reset to first page on sort
                    }}
                    className="w-full sm:w-48"
                    placeholder="Sort By"
                    suffixIcon={<RiArrowDownSLine size={16} />}
                >
                    {sortOptions.map((option) => (
                        <Select.Option key={option.value} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                </Select>
            </div>

            {/* Card Wrapper */}
            <div className="bg-white rounded-b-2xl overflow-hidden">

                {/* Scrollable Table Container */}
                <div className="w-full overflow-x-auto">
                    {/* Table Heading */}
                    <div className="flex items-center px-4 py-4 text-gray-900 text-sm font-bold border-b border-gray-300 bg-gray-100 min-w-[900px]">
                        <div className="flex items-center gap-4 w-1/4">
                            <span>Campaign Name</span>
                        </div>
                        <div className="flex justify-between w-3/4 pr-2">
                            <div className="w-1/5 text-center">Budget</div>
                            <div className="w-1/5 text-center">Start Date</div>
                            <div className="w-1/5 text-center">Due Date</div>
                            <div className="w-1/5 text-center">Total Offers</div>
                            <div className="w-1/5 text-center">Action</div>
                        </div>
                    </div>

                    {/* Table Body */}
                    {loading ? (
                        <tr>
                            <td colSpan="5" className="text-center py-10 text-gray-500">
                                Loading Offers...
                            </td>
                        </tr>
                    ) : offers.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-10">
                                <Empty description="No Applications found." />
                            </td>
                        </tr>
                    ) : (
                        offers.map((offer) => (
                            <div
                                key={offer?.id}
                                className="flex items-center justify-between px-4 py-2 border-b border-gray-200 hover:bg-gray-100 transition min-w-[900px]"
                            >
                                {/* Campaign Name and Icon */}
                                <div className="flex items-center gap-4 w-1/4 min-w-0">
                                    <img
                                        src={`${BASE_URL}/${offer?.photopath}`}
                                        alt="Platform"
                                        className="w-10 h-10 object-cover rounded-full"
                                    />
                                    <div className="flex flex-col truncate">
                                        <span className="font-medium truncate">{offer?.name}</span>
                                    </div>
                                </div>

                                {/* Info Columns */}
                                <div className="flex items-center justify-between w-3/4 pr-2 text-sm text-gray-700">
                                    <div className="w-1/5 text-center">{offer?.estimatedbudget}</div>
                                    <div className="w-1/5 text-center">{offer?.startdate}</div>
                                    <div className="w-1/5 text-center">{offer?.enddate}</div>
                                    <div className="w-1/5 text-center font-medium">
                                        {offer?.totaloffers} Offers
                                    </div>
                                    <div className="w-1/5 text-center">
                                        <button
                                            onClick={() => navigate(`/vendor-dashboard/offers/view-all-offers/${offer.id}`)}
                                            className="bg-[#0f122f] hover:bg-[#1a1d3a] text-white px-4 py-2 rounded-full text-sm"
                                        >
                                            View Offers
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>


            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm">
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
        </div>
    );
};

export default OffersLayout;
