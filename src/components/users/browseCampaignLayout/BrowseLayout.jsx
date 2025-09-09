import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  RiFileCopyLine,
  RiVideoAddLine,
  RiExchangeDollarLine,
  RiArrowDownSLine,
  RiEqualizerFill,
  RiCloseFill,
} from "@remixicon/react";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Pagination, Select } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";


const Browse = () => {
  const [showFilter, setShowFilter] = useState(false);

  const [platforms, setPlatforms] = useState([])
  const [languages, setLanguages] = useState([]);
  const [campaignTypes, setCampaignTypes] = useState([]);
  const [campaigns, setCampaigns] = useState([])
  const [totalCampaigns, setTotalCampaigns] = useState(0);

  const [filters, setFilters] = useState({
    providers: [],
    contenttypes: [],
    languages: [],
    maxbudget: "",
    minbudget: "",
    sortby: "createddate",
    sortorder: "desc",
    pagenumber: 1,
    pagesize: 10,
  });


  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { token } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const buttons = [
    { id: "browse", label: "Browse Campaign", path: "/dashboard/browse" },
    {
      id: "applied",
      label: "Applied Campaign",
      path: "/dashboard/browse/applied",
    },
    { id: "saved", label: "Saved Campaign", path: "/dashboard/browse/saved" },
  ];

  const selectedButton = buttons.find((b) => location.pathname === b.path)?.id;

  const sortOptions = [
    { value: "createddate_desc", label: "Newest" },
    { value: "estimatedbudget_desc", label: "Price: High to Low" }, // desc = high to low
    { value: "estimatedbudget_asc", label: "Price: Low to High" },  // asc = low to high
  ];


  const handleBudgetChange = useCallback((type, value) => {
    setFilters(prev => ({ ...prev, [type]: value, pagenumber: 1 }));
  }, []);

  const handleCheckboxChange = useCallback((category, id) => {
    setFilters(prev => {
      const updated = prev[category].includes(id)
        ? prev[category].filter(v => v !== id)
        : [...prev[category], id];

      return { ...prev, [category]: updated, pagenumber: 1 };
    });
  }, []);


  const getAllPlatforms = async () => {
    try {
      const res = await axios.get("providers")
      console.log(res.data)
      if (res.status === 200) {
        setPlatforms(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getAllLanguages = async () => {
    try {
      const res = await axios.get("languages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLanguages(res.data.languages || []);
    } catch (error) {
      console.log(error)
    }
  }

  const getAllCampaigns = async () => {
    try {
      const params = {
        providers: filters.providers.length ? JSON.stringify(filters.providers) : undefined,
        contenttypes: filters.contenttypes.length ? JSON.stringify(filters.contenttypes) : undefined,
        languages: filters.languages.length ? JSON.stringify(filters.languages) : undefined,
        maxbudget: filters.maxbudget !== "" ? Number(filters.maxbudget) : undefined,
        minbudget: filters.minbudget !== "" ? Number(filters.minbudget) : undefined,
        sortby: filters.sortby || undefined,
        sortorder: filters.sortorder || undefined,
        pagenumber: filters.pagenumber || 1,
        pagesize: filters.pagesize || 10,
      };

      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
      );

      console.log("API Params:", cleanParams);

      const res = await axios.get("user/browse/fiterWithSort", {
        params: cleanParams,
      });

      console.log("Campaigns:", res.data.fn_get_campaignbrowse);
      setTotalCampaigns(res.data.fn_get_campaignbrowse.totalcount)
      setCampaigns(res.data.fn_get_campaignbrowse.records);

    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };


  const getAllCampaignTypes = async () => {
    try {
      const res = await axios.get("content-type")
      setCampaignTypes(res.data.contentType)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getAllLanguages();
    getAllPlatforms();
    getAllCampaignTypes();
  }, [])

  useEffect(() => {
    getAllCampaigns();
  }, [filters.pagenumber, filters.pagesize, filters.sortby, filters.sortorder]);


  return (
    <main className="flex-1 bg-gray-100 overflow-y-auto w-full">
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
        <h4 className="text-xl font-bold text-gray-900 mb-2">
          Browse Campaign
        </h4>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search"
            className="w-full sm:w-auto flex-1"
          />

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-end">
              <div className="w-full sm:w-auto">
                <Select
                  size="large"
                  value={`${filters.sortby}_${filters.sortorder}`}
                  onChange={(value) => {
                    const [sortby, sortorder] = value.split("_");
                    setFilters((prev) => ({
                      ...prev,
                      sortby,
                      sortorder,
                      pagenumber: 1, // Reset page on sort change
                    }));

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


              <button
                onClick={() => setShowFilter(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-200 rounded-md px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 transition"
              >
                Filter
                <RiEqualizerFill size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-6">
          <div
            className={`grid gap-6 flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 `}
          >
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border rounded-2xl transition hover:shadow-sm border-gray-200 bg-white p-5 flex flex-col"
              >
                <span className="text-xs text-gray-500 mb-3">
                  {campaign.time}
                </span>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={`${BASE_URL}${campaign.photopath}`}
                    alt="icon"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {campaign.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {campaign.businessname}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">

                  <div className="flex flex-col text-xs text-gray-500 gap-1">
                    {campaign.providercontenttype?.map((item, index) => (
                      <span key={index}>
                        {item.providername} - {item.contenttypename}
                      </span>
                    ))}
                  </div>

                  <RiExchangeDollarLine size={16} />
                  <span>{campaign.estimatedbudget}</span>
                </div>
                <p className="text-gray-700 text-sm mb-4 text-justify">
                  {campaign.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {/* {campaign.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))} */}
                </div>
                <div className="flex items-center justify-between mt-auto gap-4">
                  <Link to="apply-now" className="flex-1">
                    <button className="w-full py-2 rounded-3xl bg-[#0f122f] text-white font-semibold hover:bg-[#23265a] transition">
                      Apply Now
                    </button>
                  </Link>
                  <Link to="description" className="flex-shrink-0">
                    <div className="border border-gray-200 bg-white w-10 h-10 p-2 flex justify-center items-center rounded-3xl cursor-pointer hover:bg-gray-100 transition">
                      <RiFileCopyLine size={20} />
                    </div>
                  </Link>
                </div>
              </div>
            ))}

          </div>

          <div className="mt-6 flex justify-center">
            <Pagination
              current={filters.pagenumber}
              pageSize={filters.pagesize}
              total={totalCampaigns}
              onChange={(page, pageSize) => {
                setFilters(prev => ({
                  ...prev,
                  pagenumber: page,
                  pagesize: pageSize,
                }));
              }}
              showSizeChanger
              pageSizeOptions={['10', '20']}
            />
          </div>

          {showFilter && (
            <>
              <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={() => setShowFilter(false)}
              />

              <div className="fixed top-0 right-0 w-80 h-full bg-white p-4 z-50 shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Filter Options</h3>
                  <button
                    onClick={() => setShowFilter(false)}
                    className="text-gray-500 hover:text-gray-900"
                  >
                    <RiCloseFill />
                  </button>
                </div>

                <hr className="my-4 border-gray-200" />
                {/* Platform */}
                <div>
                  <h4 className="font-semibold mb-2">Platform</h4>
                  {platforms.length === 0 ? (
                    <p className="text-sm text-gray-500">No platforms available.</p>
                  ) : (
                    platforms.map((platform) => (
                      <label key={platform.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={filters.providers.includes(platform.id)}
                          onChange={() => handleCheckboxChange("providers", platform.id)}
                        />

                        <span className="text-sm text-gray-700">{platform.name}</span>
                      </label>
                    ))
                  )}
                </div>

                {/* Type */}
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Type</h4>
                  {campaignTypes.map((type) => (
                    <label key={type.id} className="block mb-1">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={filters.contenttypes.includes(type.id)}
                        onChange={() => handleCheckboxChange("contenttypes", type.id)}
                      />
                      {type.name}
                    </label>
                  ))}

                </div>

                {/* Languages */}
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Languages</h4>
                  {languages.length === 0 ? (
                    <p className="text-sm text-gray-500">No languages available.</p>
                  ) : (
                    languages.map((lang) => (
                      <label key={lang.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={filters.languages.includes(lang.id)}
                          onChange={() => handleCheckboxChange("languages", lang.id)}
                        />
                        <span className="text-sm text-gray-700">{lang.name}</span>
                      </label>
                    ))
                  )}
                </div>


                {/* Budget */}
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Budget</h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minbudget}
                      onChange={(e) => handleBudgetChange("minbudget", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-32"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxbudget}
                      onChange={(e) => handleBudgetChange("maxbudget", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-32"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-4 px-4">
                  <button
                    className="flex-1 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
                    onClick={() => {
                      setFilters({
                        providers: [],
                        contenttypes: [],
                        languages: [],
                        maxbudget: "",
                        minbudget: "",
                        sortby: "",
                        sortorder: "desc",
                        pagenumber: 1,
                        pagesize: 10,
                      });
                      setShowFilter(false);
                      getAllCampaigns(); // refresh list with default filters
                    }}
                  >
                    Clear
                  </button>

                  <button
                    className="flex-1 py-2 bg-[#0f122f] text-white rounded-full hover:bg-[#23265a]"
                    onClick={() => {
                      getAllCampaigns();
                      setShowFilter(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Browse;
