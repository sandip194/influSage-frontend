import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  RiArrowDownSLine,
  RiEqualizerFill,
  RiCloseFill,
  RiEraserLine,
  RiFilterLine,
} from "@remixicon/react";
import { SearchOutlined, CloseCircleFilled } from "@ant-design/icons";
import { Input, Pagination, Select, Tooltip } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import CampaignCardGrid from "./BrowseCampaignCard";

const buttons = [
  { id: "browse", label: "Discover", path: "/dashboard/browse" },
  { id: "applied", label: "Applied", path: "/dashboard/browse/applied" },
  { id: "saved", label: "Saved", path: "/dashboard/browse/saved" },
];

const sortOptions = [
  { value: "createddate_desc", label: "Newest" },
  { value: "estimatedbudget_desc", label: "Price: High to Low" },
  { value: "estimatedbudget_asc", label: "Price: Low to High" },
];

const Browse = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [platforms, setPlatforms] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [campaignTypes, setCampaignTypes] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    providers: [],
    contenttypes: [],
    languages: [],
    maxbudget: "",
    minbudget: "",
    sortby: "createddate",
    sortorder: "desc",
    pagenumber: 1,
    pagesize: 12,
  });

  const [pendingFilters, setPendingFilters] = useState(filters);

  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const selectedButton = useMemo(
    () => buttons.find((b) => location.pathname === b.path)?.id,
    [location.pathname]
  );

  /* ------------------------ Fetch Campaigns ------------------------ */
  const getAllCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        providers: filters.providers.length ? JSON.stringify(filters.providers) : undefined,
        contenttypes: filters.contenttypes.length ? JSON.stringify(filters.contenttypes) : undefined,
        languages: filters.languages.length ? JSON.stringify(filters.languages) : undefined,
        maxbudget: filters.maxbudget || undefined,
        minbudget: filters.minbudget || undefined,
        sortby: filters.sortby,
        sortorder: filters.sortorder,
        pagenumber: filters.pagenumber,
        pagesize: filters.pagesize,
        p_search: searchTerm.trim(),
      };
      const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));

      const res = await axios.get("user/browse-all-campaigns/fiterWithSort", {
        params: cleanParams,
        headers: { Authorization: `Bearer ${token}` },
      });

      setCampaigns(res.data.records);
      setTotalCampaigns(res.data.totalcount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm, token]);

  useEffect(() => {
    getAllCampaigns();
  }, [getAllCampaigns]);

  /* ------------------------ Filter Handlers ------------------------ */
  const handleCheckboxChange = (category, id) => {
    setPendingFilters((prev) => {
      const updated = prev[category].includes(id)
        ? prev[category].filter((x) => x !== id)
        : [...prev[category], id];
      return { ...prev, [category]: updated };
    });
  };

  const handleBudgetChange = (type, value) => {
    setPendingFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handleApplyFilters = () => {
    setFilters({ ...pendingFilters, pagenumber: 1 });
    setShowFilter(false);
  };

  const handleClearFilters = () => {
    const cleared = {
      providers: [],
      contenttypes: [],
      languages: [],
      maxbudget: "",
      minbudget: "",
      sortby: "createddate",
      sortorder: "desc",
      pagenumber: 1,
      pagesize: 15,
    };
    setPendingFilters(cleared);
    setFilters(cleared);
    setShowFilter(false);
  };

  const handleSave = useCallback(
    async (id) => {
      try {
        const res = await axios.post(`user/save-campaign/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(res.data?.message);
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, campaigsaved: !c.campaigsaved } : c
          )
        );
      } catch (err) {
        toast.error("Failed to save campaign");
      }
    },
    [token]
  );

  /* ------------------------ Fetch Filter Options ------------------------ */
  useEffect(() => {
    (async () => {
      try {
        const [p, l, c] = await Promise.all([
          axios.get("providers"),
          axios.get("languages", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("content-type"),
        ]);
        setPlatforms(p.data.data || []);
        setLanguages(l.data.languages || []);
        setCampaignTypes(c.data.contentType || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token]);

  /* ------------------------ Scroll Reset ------------------------ */
  useEffect(() => {
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters.pagenumber]);

  /* ------------------------ UI ------------------------ */
  return (
    <div className="browslayout w-full text-sm pb-24 sm:pb-0">
      {/* <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Campaign</h2>
      <p className="mb-6 text-gray-700 text-sm">Track your campaigns & Browse</p> */}

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

      {/* Search + Sort + Filter */}
      <div className="bg-white p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <Input
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search for anything here..."
            className="w-full sm:w-auto flex-1"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchTerm(searchInput.trim());
                setFilters((prev) => ({ ...prev, pagenumber: 1 }));
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

          {/* Sort + Filter */}
          <div className="hidden sm:flex gap-2 w-auto justify-end">
            <Select
              size="large"
              value={`${filters.sortby}_${filters.sortorder}`}
              onChange={(value) => {
                const [sortby, sortorder] = value.split("_");
                setFilters((prev) => ({ ...prev, sortby, sortorder, pagenumber: 1 }));
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
              className="flex items-center cursor-pointer justify-center gap-2 border border-gray-200 rounded-md px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 transition"
            >
              Filter
              <RiEqualizerFill size={16} />
            </button>
          </div>
          {!showFilter && (
            <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-30 p-4 flex gap-3 justify-between">
              <Select
                size="large"
                value={`${filters.sortby}_${filters.sortorder}`}
                onChange={(value) => {
                  const [sortby, sortorder] = value.split("_");
                  setFilters((prev) => ({ ...prev, sortby, sortorder, pagenumber: 1 }));
                }}
                className="flex-1"
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
                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-md px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 transition"
              >
                Filter
                <RiEqualizerFill size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Campaign Grid */}
        <div className="flex flex-col gap-6 mt-6">
          <CampaignCardGrid
            campaigns={campaigns}
            loading={loading}
            handleCardClick={(id) => navigate(`/dashboard/browse/description/${id}`)}
            handleSave={handleSave}
            variant="browse"
            onCampaignApplied={getAllCampaigns}
          />

          <div className="mt-6 flex justify-center">
            <Pagination
              current={filters.pagenumber}
              pageSize={filters.pagesize}
              total={totalCampaigns}
              onChange={(page, pageSize) =>
                setFilters((prev) => ({ ...prev, pagenumber: page, pagesize: pageSize }))
              }
              showSizeChanger
              pageSizeOptions={["12", "24", "36", "48"]}
            />
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
      {showFilter && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowFilter(false)}
          />
          <div
            className="fixed top-0 right-0 w-80 h-full bg-white p-4 z-50 shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
          >

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filter Options</h3>
              <div className="flex items-center gap-2">
                <Tooltip title="Clear Filters">
                  <button
                    onClick={handleClearFilters}
                    className="p-2 rounded-full cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <RiEraserLine size={18} />
                  </button>
                </Tooltip>

                <Tooltip title="Apply Filters">
                  <button
                    onClick={handleApplyFilters}
                    className="p-2 rounded-full cursor-pointer bg-[#0f122f] text-white hover:bg-[#23265a] transition"
                  >
                    <RiFilterLine size={18} />
                  </button>
                </Tooltip>

                <Tooltip title="Close">
                  <button
                    onClick={() => setShowFilter(false)}
                    className="p-2 rounded-full cursor-pointer text-gray-500 hover:bg-gray-100"
                  >
                    <RiCloseFill size={20} />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Platforms */}
            <div>
              <h4 className="font-semibold mb-2">Platforms</h4>
              {platforms.map((p) => (
                <label key={p.id} className="flex cursor-pointer items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={pendingFilters.providers.includes(p.id)}
                    onChange={() => handleCheckboxChange("providers", p.id)}
                  />
                  {p.name}
                </label>
              ))}
            </div>

            {/* Content Types */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Content Type</h4>
              {campaignTypes.map((t) => (
                <label key={t.id} className="block mb-1">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={pendingFilters.contenttypes.includes(t.id)}
                    onChange={() => handleCheckboxChange("contenttypes", t.id)}
                  />
                  {t.name}
                </label>
              ))}
            </div>

            {/* Languages */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Languages</h4>
              {languages.map((lang) => (
                <label key={lang.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={pendingFilters.languages.includes(lang.id)}
                    onChange={() => handleCheckboxChange("languages", lang.id)}
                  />
                  {lang.name}
                </label>
              ))}
            </div>

            {/* Budget */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Budget</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={pendingFilters.minbudget}
                  onChange={(e) => handleBudgetChange("minbudget", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-32"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={pendingFilters.maxbudget}
                  onChange={(e) => handleBudgetChange("maxbudget", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-32"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Browse;
