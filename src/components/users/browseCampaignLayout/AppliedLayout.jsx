import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  RiVideoAddLine,
  RiExchangeDollarLine,
  RiArrowDownSLine,
  RiDeleteBinLine,
  RiEyeLine,
} from "@remixicon/react";
import { Modal } from "antd";
import { SearchOutlined, CloseCircleFilled } from "@ant-design/icons";
import { Empty, Input, Pagination, Select, Skeleton, Tooltip } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AppliedCampaignCard from "./AppliedCampaignCard";

const AppliedLayout = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [pagenumber, setPageNumber] = useState(1);
  const [pagesize, setPageSize] = useState(10); // or any default
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [sortby, setSortBy] = useState("createddate");
  const [sortorder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);


  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.auth);
 // const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (path) => {
    navigate(path);
  };

  const buttons = [
    { id: "browse", label: "Browse Campaign", path: "/dashboard/browse" },
    {
      id: "applied",
      label: "Applied Campaign",
      path: "/dashboard/browse/applied",
    },
    { id: "saved", label: "Saved Campaign", path: "/dashboard/browse/saved" },
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
    navigate(`/dashboard/browse/applied-campaign-details/${id}`);
  };

  const getAllAppliedCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`user/applied-campaigns`, {
        params: {
          p_sortby: sortby,
          p_sortorder: sortorder,
          p_pagenumber: pagenumber,
          p_pagesize: pagesize,
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
  }, [sortby, sortorder, pagenumber, pagesize, token, searchTerm]);

  const handleWithdraw = async (campaignapplicationid) => {
    try {
      const res = await axios.post(
        `/user/withdraw-application`,
        {
          p_applicationid: campaignapplicationid,
          p_statusname: "Withdrawn",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(res.data);
      // console.log("Withdraw request:", campaignapplicationid);
      toast.success(res.data?.message);

    } catch (error) {
      console.error(error)
      toast.error(error);
    }
  };
  useEffect(() => {
    getAllAppliedCampaigns();
  }, [getAllAppliedCampaigns]);

  return (
    
    <div className="appliedlayout w-full text-sm pb-24 sm:pb-0 ">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Campaign</h2>
      <p className="mb-6 text-gray-700 text-sm">
        Track your campaigns & Browse
      </p>

      <div className="bg-white p-4 rounded-lg mb-6 flex flex-row gap-2 flex-wrap sm:flex-nowrap">
        {buttons.map(({ id, label, path }) => (
          <button
            key={id}
            onClick={() => handleClick(path)}
            className={`flex-1 sm:flex-none px-3 py-2 rounded-md border border-gray-300 transition text-sm
              ${selectedButton === id
                ? "bg-[#0f122f] text-white"
                : "bg-white text-[#141843] hover:bg-gray-100"
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

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <AppliedCampaignCard
            campaigns={campaigns}
            loading={loading}
            handleCardClick={handleCardClick}
            setSelectedApplicationId={setSelectedApplicationId}
            setWithdrawModalOpen={setWithdrawModalOpen}
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
          pageSizeOptions={["10", "15", "25", "50"]}
        />
      </div>

      <Modal
        open={isWithdrawModalOpen}
        onCancel={() => setWithdrawModalOpen(false)}
        centered
        footer={null}
      >
        <h2 className="text-xl font-semibold mb-2">Withdraw Application</h2>
        <p className="text-gray-600">
          Are you sure you want to withdraw this application? You can’t undo this action.
        </p>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setWithdrawModalOpen(false)}
            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleWithdraw(selectedApplicationId);
              setWithdrawModalOpen(false);
            }}
            className="px-6 py-2 rounded-full bg-[#0f122f] text-white hover:bg-[#23265a]"
          >
            Withdraw
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default AppliedLayout;
