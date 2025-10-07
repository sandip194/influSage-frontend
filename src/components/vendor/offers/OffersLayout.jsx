import { RiArrowDownSLine, RiEyeLine } from "@remixicon/react";
import { Pagination, Select, Empty, Input, Skeleton, Tooltip } from "antd";
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
            console.error(error)
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
                    <table className="w-full text-left min-w-[750px]">
                        <thead className="bg-white text-gray-700 text-sm tracking-wide">
                            <tr>
                                <th className="p-4">Campaign Name</th>
                                <th className="p-4">Budget</th>
                                <th className="p-4">Date Started</th>
                                <th className="p-4">Due Date</th>
                                <th className="p-4">Total Offers</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700">
                            {/* Table Body */}
                            {loading ? (
                                [...Array(6)].map((_, index) => (
                                    <tr key={index} className="border-t border-gray-200">
                                        <td colSpan="6" className="p-4">
                                            <Skeleton active paragraph={{ rows: 1 }} />
                                        </td>
                                    </tr>
                                ))
                            ) : offers?.length > 0 ? (
                                offers.map((offer) => (

                                    <tr
                                        key={offer.id}
                                        className="border-t border-gray-200 hover:bg-gray-50 transition"
                                    >
                                        {/* Campaign Name and Icon */}

                                        <td className="p-4 flex items-center gap-3">
                                            <img
                                                src={`${BASE_URL}/${offer?.photopath}`}
                                                alt={offer.name}
                                                className="w-9 h-9 rounded-full object-cover"
                                            />
                                            <span>{offer.name}</span>
                                        </td>

                                        <td className="p-4">₹ {offer.estimatedbudget}</td>
                                        <td className="p-4">{offer.startdate}</td>
                                        <td className="p-4">{offer.enddate}</td>
                                        <td className="p-4">{offer?.totaloffers} Offers</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() =>
                                                    navigate(`/vendor-dashboard/offers/view-all-offers/${offer.id}`)
                                                }
                                                className="flex items-center cursor-pointer gap-1 text-[#141843] hover:text-[#1d214f] transition text-sm font-medium"
                                            >
                                                <Tooltip title="View Offers">
                                                    <RiEyeLine className="text-lg" />
                                                </Tooltip>
                                            </button>
                                        </td>

                                    </tr>

                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-10">
                                        <Empty description="No Offers found" />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
