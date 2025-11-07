import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  RiFileCopyLine,
  RiExchangeDollarLine,
  RiArrowDownSLine,
  RiEqualizerFill,
  RiCloseFill,
  RiFileCopyFill,
  RiEyeLine,
  RiEraserLine,
  RiAddLine
} from '@remixicon/react';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons';
import { Empty, Input, Pagination, Select, Tooltip, Skeleton } from 'antd';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CampaignCardGrid from "./BrowseCampaignCard";


const buttons = [
  { id: "browse", label: "Browse Campaign", path: "/dashboard/browse" },
  {
    id: "applied",
    label: "Applied Campaign",
    path: "/dashboard/browse/applied",
  },
  { id: "saved", label: "Saved Campaign", path: "/dashboard/browse/saved" },
];

const sortOptions = [
  { value: "createddate_desc", label: "Newest" },
  { value: "estimatedbudget_desc", label: "Price: High to Low" }, // desc = high to low
  { value: "estimatedbudget_asc", label: "Price: Low to High" },  // asc = low to high
];


const Browse = () => {
  const [showFilter, setShowFilter] = useState(false);

  const [platforms, setPlatforms] = useState([])
  const [languages, setLanguages] = useState([]);
  const [campaignTypes, setCampaignTypes] = useState([]);
  const [campaigns, setCampaigns] = useState([])
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");


  const [filters, setFilters] = useState({
    providers: [],
    contenttypes: [],
    languages: [],
    maxbudget: "",
    minbudget: "",
    sortby: "createddate",
    sortorder: "desc",
    pagenumber: 1,
    pagesize: 15,
  });


  // const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { token } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const handleCardClick = (id) => {
    navigate(`/dashboard/browse/description/${id}`);
  };

  const selectedButton = useMemo(
    () => buttons.find((b) => location.pathname === b.path)?.id,
    [location.pathname]
  );


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

      if (res.status === 200) {
        setPlatforms(res.data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getAllLanguages = async () => {
    try {
      const res = await axios.get("languages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLanguages(res.data.languages || []);
    } catch (error) {
      console.error(error)
    }
  }

  const getAllCampaigns = async () => {
    try {
      setLoading(true);
      const params = {
        providers: filters.providers.length ? JSON.stringify(filters.providers) : undefined,
        contenttypes: filters.contenttypes.length ? JSON.stringify(filters.contenttypes) : undefined,
        languages: filters.languages.length ? JSON.stringify(filters.languages) : undefined,
        maxbudget: filters.maxbudget !== "" ? Number(filters.maxbudget) : undefined,
        minbudget: filters.minbudget !== "" ? Number(filters.minbudget) : undefined,
        sortby: filters.sortby || undefined,
        sortorder: filters.sortorder || undefined,
        pagenumber: filters.pagenumber || 1,
        pagesize: filters.pagesize || 15,
        p_search: searchTerm.trim()
      };

      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
      );

      const res = await axios.get("user/browse-all-campaigns/fiterWithSort", {
        params: cleanParams,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTotalCampaigns(res.data.totalcount);
      setCampaigns(res.data.records);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllCampaignTypes = async () => {
    try {
      const res = await axios.get("content-type")
      setCampaignTypes(res.data.contentType)
    } catch (error) {
      console.error(error)
    }
  }

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
        getAllCampaigns()
      }

    } catch (error) {
      console.error(error)
      toast.error(error);
    }
  }

  useEffect(() => {
    document.querySelector('main').scrollTo({ top: 0, behavior: "smooth" });
  }, [filters.pagenumber]);


  useEffect(() => {
    getAllLanguages();
    getAllPlatforms();
    getAllCampaignTypes();
  }, [])

  useEffect(() => {
    getAllCampaigns();
  }, [filters.pagenumber, filters.pagesize, filters.sortby, filters.sortorder, searchTerm]);


  useEffect(() => {
    const handleResize = () => {
      setFilters((prev) => ({
        ...prev,
        pagesize: window.innerWidth < 640 ? 10 : 15,
        pagenumber: 1,
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="browslayout w-full text-sm pb-24 sm:pb-0">


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
        <h4 className="text-xl font-bold text-gray-900 mb-2">
          Browse Campaign
        </h4>

        {/*Header Like Searching, filter and Sort By */}
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
                setFilters((prev) => ({
                  ...prev,
                  pagesize: window.innerWidth < 640 ? 10 : 15,
                  pagenumber: 1,
                }));
                setSearchTerm(trimmedInput);
              }

              if (e.key === "Enter" && trimmedInput === "") {
                // Reset search
                setSearchTerm("");
                setFilters((prev) => ({
                  ...prev,
                  pagesize: window.innerWidth < 640 ? 10 : 15,
                  pagenumber: 1,
                }));
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
              <div className="hidden sm:flex gap-2 w-full sm:w-auto justify-end">
                <Select
                  size="large"
                  value={`${filters.sortby}_${filters.sortorder}`}
                  onChange={(value) => {
                    const [sortby, sortorder] = value.split("_");
                    setFilters((prev) => ({
                      ...prev,
                      sortby,
                      sortorder,
                      pagenumber: 1,
                    }));
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

                <button
                  onClick={() => setShowFilter(true)}
                  className="flex items-center justify-center gap-2 border border-gray-200 rounded-md px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 transition"
                >
                  Filter
                  <RiEqualizerFill size={16} />
                </button>
              </div>

            {/* Mobile view: fixed at bottom, both equal width */}
              {!showFilter && (
                <div className="sm:hidden fixed bottom-0 left-0 w-full z-50 bg-white p-4 flex gap-2 shadow-md">
                  {/* Sort Dropdown */}
                  <div className="flex-1">
                    <Select
                      size="large"
                      value={`${filters.sortby}_${filters.sortorder}`}
                      onChange={(value) => {
                        const [sortby, sortorder] = value.split("_");
                        setFilters((prev) => ({
                          ...prev,
                          sortby,
                          sortorder,
                          pagenumber: 1,
                        }));
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

                  {/* Filter Button */}
                  <div className="flex-1">
                    <button
                      onClick={() => setShowFilter(true)}
                      className="w-full flex items-center justify-center gap-2 border border-gray-200 px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 transition rounded-md"
                    >
                      Filter
                      <RiEqualizerFill size={16} />
                    </button>
                  </div>
                </div>
              )}
           </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-6">

          {/* Campaign Card */}
          <CampaignCardGrid
            campaigns={campaigns}
            loading={loading}
            handleCardClick={handleCardClick}
            handleSave={handleSave}
          />

          {/* Pagination */}
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
              pageSizeOptions={['10', '15', '25', '50']}

            />
          </div>

          {/* Filter Show Conditionly  */}
          {showFilter && (
            <>
              <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={() => setShowFilter(false)}
              />
              <div className="fixed top-0 right-0 w-80 h-full bg-white p-4 z-50 shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Filter Options</h3>

                  <div className="flex items-center gap-2">
                    <Tooltip title="Clear Filters">
                      <button
                        onClick={() => {
                          setFilters({
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
                          setShowFilter(false);
                          getAllCampaigns(); // refresh list with default filters
                        }}
                        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition"
                      >
                        <RiEraserLine size={18} />
                      </button>
                    </Tooltip>

                    <Tooltip title="Apply Filters">
                      <button
                        onClick={() => {
                          getAllCampaigns();
                          setShowFilter(false);
                        }}
                        className="p-2 rounded-full bg-[#0f122f] text-white hover:bg-[#23265a] transition"
                      >
                        <RiAddLine size={18} />
                      </button>
                    </Tooltip>

                    <Tooltip title="Close">
                      <button
                        onClick={() => setShowFilter(false)}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
                      >
                        <RiCloseFill size={20} />
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <hr className="my-4 border-gray-200" />
                {/* Platform */}
                <div>
                  <h4 className="font-semibold mb-2">Platforms</h4>
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
                  <h4 className="font-semibold mb-2">Content Type</h4>
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

                
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
