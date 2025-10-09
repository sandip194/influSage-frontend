import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  RiFileCopyLine,
  RiExchangeDollarLine,
  RiArrowDownSLine,
  RiEqualizerFill,
  RiCloseFill,
  RiFileCopyFill,
  RiEyeLine
} from '@remixicon/react';
import { SearchOutlined } from '@ant-design/icons';
import { Empty, Input, Pagination, Select, Tooltip } from 'antd';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';




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

  const selectedButton = useMemo(
    () => buttons.find((b) => location.pathname === b.path)?.id,
    [location.pathname]
  );


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
    <div className="browslayout">


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

        {/*Header Like Searching, filter and Sort By */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
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

          {/* Campaign Card */}
          <div
            className={`grid gap-6 flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`}
          >
            {loading ? (
              <div className="col-span-full text-center py-10 text-gray-500">
                Loading campaigns...
              </div>
            ) : campaigns.length === 0 ? (
              <div className="col-span-full py-10">
                <Empty description="No campaigns found." />
              </div>
            ) : (campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border rounded-2xl transition hover:shadow-sm border-gray-200 bg-white p-5 flex flex-col"
              >
                <span className="text-xs text-gray-500 mb-3">
                  Applied on {new Date(campaign.createddate).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={`${BASE_URL}/${campaign.photopath}`}
                    alt="icon"
                    loading="lazy"
                    className="w-10 h-10 object-cover rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0"> {/* Keeps space management intact */}
                     <Link
                        to={
                          campaign.campaignapplied
                            ? `/dashboard/browse/applied-campaign-details/${campaign.id}`
                            : `/dashboard/browse/description/${campaign.id}`
                        }
                        className="font-semibold text-gray-900 hover:underline"
                      >
                        {campaign.name}
                      </Link>
                    <div className="text-xs text-gray-500"> {/* Removed 'truncate' to allow wrapping; add back if needed */}
                      {campaign.businessname}
                    </div>
                  </div>
                </div>
                {/* Rest of the card remains the same */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <div className="flex flex-col text-xs text-gray-500 gap-1">
                    {campaign.providercontenttype?.map((item, index) => (
                      <span key={index}>
                        {item.providername} - {item.contenttypename}
                      </span>
                    ))}
                  </div>
                  <RiExchangeDollarLine size={16} />
                  <span>₹{campaign.estimatedbudget}</span>
                </div>
                <p
                  className="text-gray-700 text-sm mb-4 text-justify overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {campaign.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {campaign.campaigncategories?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 rounded-xl text-xs"
                    >
                      {tag.categoryname}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-auto gap-4 min-w-0">
                  {campaign.campaignapplied ? (
                    <button className="flex-1 py-2 rounded-3xl bg-[#9d9d9d] cursor-pointer text-white font-semibold transition min-w-0 truncate">
                      Applied
                    </button>
                  ) : (
                    <Link to={`/dashboard/browse/apply-now/${campaign.id}`} className="flex-1 min-w-0">
                      <button className="py-2 rounded-3xl bg-[#0f122f] cursor-pointer text-white font-semibold hover:bg-[#23265a] transition w-full truncate">
                        Apply Now
                      </button>
                    </Link>
                  )}

                  <Tooltip title="Save Campaign">
                    <button
                      onClick={() => handleSave(campaign.id)}
                      className="border border-[#0f122f] text-black w-10 h-10 p-2 flex justify-center items-center rounded-3xl cursor-pointer transition flex-shrink-0 bg-transparent"
                    >
                      {campaign.campaigsaved ? (
                        <RiFileCopyFill size={20} />
                      ) : (
                        <RiFileCopyLine size={20} />
                      )}
                    </button>
                  </Tooltip>

                  {/* <Tooltip title="View Details">
                    <Link
                      to={
                        campaign.campaignapplied
                          ? `/dashboard/browse/applied-campaign-details/${campaign.id}`
                          : `/dashboard/browse/description/${campaign.id}`
                      }
                    >
                      <button className="border bg-[#0f122f] text-white border-gray-200 w-10 h-10 p-0 flex justify-center items-center rounded-3xl cursor-pointer hover:bg-[#23265a] transition flex-shrink-0">
                        <RiEyeLine size={20} />
                      </button>
                    </Link>
                  </Tooltip> */}
                </div>
              </div>
            )))
            }

          </div>

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
                        sortby: "createddate",
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
    </div>
  );
};

export default Browse;
