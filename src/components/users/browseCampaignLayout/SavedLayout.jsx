import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import {
  RiArrowDownSLine,

} from "@remixicon/react";
import { SearchOutlined, CloseCircleFilled } from "@ant-design/icons";
import {  Input, Pagination, Select, Tooltip } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CampaignCardGrid from './BrowseCampaignCard';


const SavedLayout = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [pagenumber, setPageNumber] = useState(1);
  const [pagesize, setPageSize] = useState(12); // or any default

  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [sortby, setSortBy] = useState("createddate");
  const [sortorder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");


  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);

  const buttons = [
    { id: "browse", label: "Discover", path: "/dashboard/browse" },
    {
      id: "applied",
      label: "Applied",
      path: "/dashboard/browse/applied",
    },
    { id: "saved", label: "Saved", path: "/dashboard/browse/saved" },
  ];

  const selectedButton = useMemo(
    () => buttons.find((b) => location.pathname === b.path)?.id,
    [location.pathname]
  );

  const sortOptions = [
    { value: "createddate_desc", label: "Newest" },
    { value: "estimatedbudget_asc", label: "Price: Low to High" },
    { value: "estimatedbudget_desc", label: "Price: High to Low" },
  ];

  const handleCardClick = (id) => {
    navigate(`/dashboard/browse/description/${id}`);
  };

  const getAllSavedCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`user/saved-campaign`, {
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
      });

      const { records, totalcount } = res.data.data;
      setCampaigns(records);
      setTotalCampaigns(totalcount);
    } catch (error) {
      console.error("Failed to fetch campaigns", error);
    } finally {
      setLoading(false);
    }
  }, [sortby, sortorder, pagenumber, pagesize, searchTerm, token]);



  const handleSave = async (id) => {
    try {
      const res = await axios.post(
        `user/save-campaign/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(res.data)
      toast.success(res.data?.message);
      if (res.status === 201) {
        getAllSavedCampaigns()
      }

    } catch (error) {
      console.error(error)
      toast.error(error);
    }
  }

  useEffect(() => {
    getAllSavedCampaigns();
  }, [getAllSavedCampaigns]);

  return (
    <div className='w-full text-sm pb-24 sm:pb-0' >
      {/* <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Campaign</h2>
      <p className="mb-6 text-gray-700 text-sm">
        Track your campaigns & Browse
      </p> */}

      {/* Buttons */}
      <div className="
        bg-white p-3 rounded-lg mb-3
        flex flex-row gap-2
        overflow-x-auto sm:overflow-visible
        no-scrollbar
      ">
        {buttons.map(({ id, label, path }) => (
          <button
            key={id}
            onClick={() => navigate(path)}
            className={`whitespace-nowrap cursor-pointer flex-shrink-0 px-4 py-2 rounded-md border transition text-sm ${selectedButton === id
                ? "bg-[#0f122f] text-white border-[#0f122f]"
                : "bg-white text-[#141843] border-gray-300 hover:bg-gray-100"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search for anything here..."
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
            suffix={
              searchInput ? (
                <Tooltip title="Clear search" placement="top">
                  <CloseCircleFilled
                    onClick={() => {
                      setSearchInput("");
                      setSearchTerm("");
                    }}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              ) : null
            }
          />



          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-end">
              {/* Desktop view */}
              <div className="hidden sm:block w-full sm:w-auto">
                <Select
                  size="large"
                  value={`${sortby}_${sortorder}`}
                  onChange={(value) => {
                    const [newSortBy, newSortOrder] = value.split("_");
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                    setPageNumber(1);
                  }}
                  className="w-48"
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

              {/* Mobile view: fixed at bottom */}
              <div className="sm:hidden fixed bottom-0 left-0 w-full z-30 bg-white p-4 shadow-md">
                <Select
                  size="large"
                  value={`${sortby}_${sortorder}`}
                  onChange={(value) => {
                    const [newSortBy, newSortOrder] = value.split("_");
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                    setPageNumber(1);
                  }}
                  className="w-full"
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
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-6">
          <CampaignCardGrid
            campaigns={campaigns}
            loading={loading}
            handleCardClick={handleCardClick}
            handleSave={handleSave}
            variant="saved"
            onCampaignApplied={getAllSavedCampaigns}
          />
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination
          current={pagenumber}
          pageSize={pagesize}
          total={totalCampaigns}
          onChange={(page, pageSize) => {
            setPageNumber(page);
            setPageSize(pageSize);
          }}
          showSizeChanger
          pageSizeOptions={['12', '24', '36', '48']}
        />
      </div>
    </div>
  );
};

export default SavedLayout;
