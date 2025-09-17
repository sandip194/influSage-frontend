import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  RiVideoAddLine,
  RiExchangeDollarLine,
  RiArrowDownSLine,
  RiEyeLine,
} from '@remixicon/react';
import { SearchOutlined } from '@ant-design/icons';
import { Empty, Input, Pagination, Select, Skeleton, Tooltip } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AppliedLayout = () => {

  const [campaigns, setCampaigns] = useState([]);
  const [pagenumber, setPageNumber] = useState(1);
  const [pagesize, setPageSize] = useState(10); // or any default
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [sortby, setSortBy] = useState("createddate");
  const [sortorder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [loading, setLoading] = useState(false);


  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  useEffect(() => {
    getAllAppliedCampaigns();
  }, [getAllAppliedCampaigns]);


  return (
    <div className="appliedlayout">


      <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Campaign</h2>
      <p className="mb-6 text-gray-700 text-sm">
        Track your campaigns & Browse
      </p>

      <div className="bg-white p-4 rounded-lg mb-6 flex flex-col sm:flex-row gap-3">
        {buttons.map(({ id, label, path }) => (
          <button
            key={id}
            onClick={() => handleClick(path)}
            className={`px-4 py-2 rounded-md border border-gray-300 transition
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
            placeholder="Search campaigns "
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

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-end">
              <div className="relative w-full sm:w-auto">
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

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <RiArrowDownSLine size={16} />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div
            className="grid gap-6 flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 6 }} className="col-span-full" />
            ) : campaigns.length === 0 ? (
              <div className="col-span-full py-10">
                <Empty description="No campaigns found." />
              </div>
            ) : (
              campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="border rounded-2xl transition hover:shadow-sm border-gray-200 bg-white p-5 flex flex-col"
                >
                  <span className="text-xs text-gray-500 mb-3">
                    Applied on {new Date(campaign.createddate).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={`${BASE_URL}/${campaign.photopath}`} // adjust if image path needs base URL
                      alt="icon"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{campaign.name}</div>
                      <div className="text-xs text-gray-500">{campaign.businessname}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">

                    <span>
                      {campaign?.providercontenttype?.[0]?.providername
                        ? `${campaign.providercontenttype[0].providername} - ${campaign.providercontenttype[0].contenttypename}`
                        : "N/A"}
                    </span>
                    <RiExchangeDollarLine size={16} />
                    <span>₹{campaign.estimatedbudget}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {campaign.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[...(campaign.campaigncategories || [])].map(
                      (item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 rounded text-xs"
                        >
                          {item.categoryname}
                        </span>
                      )
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-auto gap-4">
                    <Link to={`/dashboard/browse/apply-now/${campaign.id}`} className="flex-1">
                      <button className="w-full py-2 cursor-pointer rounded-3xl bg-[#0f122f] text-white font-semibold hover:bg-[#23265a] transition">
                        Edit Application
                      </button>
                    </Link>

                    <Tooltip title="View Details">
                      <Link to={`/dashboard/browse/applied-campaign-details/${campaign.id}`} className="flex-shrink-0">
                        <div className="border border-gray-200 bg-[#0f122f] text-white w-10 h-10 p-2 flex justify-center items-center rounded-3xl cursor-pointer hover:bg-[#23265a] transition">
                          <RiEyeLine size={20} />
                        </div>
                      </Link>
                    </Tooltip>

                  </div>
                </div>
              ))
            )}

          </div>
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
          pageSizeOptions={['10', '15', '25', '50']}
        />
      </div>
    </div>
  );
};

export default AppliedLayout;
