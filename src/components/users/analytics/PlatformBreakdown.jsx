import { useState, useEffect, useMemo, useCallback } from "react";
import { Skeleton, Select, Row, Col } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

const { Option } = Select;

const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
};

export const PlatformBreakdown = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-indexed

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [platformData, setPlatformData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useSelector((state) => state.auth);

  // Years dropdown (e.g., last 5 years)
  const yearList = useMemo(
    () => Array.from({ length: 5 }, (_, i) => currentYear - i),
    [currentYear]
  );

  // Months dropdown
  const monthList = useMemo(
    () => [
      { value: 1, label: "Jan" },
      { value: 2, label: "Feb" },
      { value: 3, label: "Mar" },
      { value: 4, label: "Apr" },
      { value: 5, label: "May" },
      { value: 6, label: "Jun" },
      { value: 7, label: "Jul" },
      { value: 8, label: "Aug" },
      { value: 9, label: "Sep" },
      { value: 10, label: "Oct" },
      { value: 11, label: "Nov" },
      { value: 12, label: "Dec" },
    ],
    []
  );

  const fetchPlatformData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/user/analytics/platform-breakdown", {
        params: { p_year: year, p_month: month },
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlatformData(res?.data?.result || []);
    } catch (error) {
      console.error("PlatformBreakdown fetch error:", error);
      setPlatformData([]);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchPlatformData();
  }, [fetchPlatformData]);


  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5  w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          Platform Breakdown
        </h2>

        <div className="flex gap-2">
          <Select
            value={month}
            onChange={setMonth}
            size="middle"
            className="w-full sm:w-[100px]"
          >
            {monthList.map((m) => (
              <Option key={m.value} value={m.value}>
                {m.label}
              </Option>
            ))}
          </Select>

          <Select
            value={year}
            onChange={setYear}
            size="middle"
            className="w-full sm:w-[80px]"
          >
            {yearList.map((y) => (
              <Option key={y} value={y}>
                {y}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : platformData.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">
          No data available for the selected period
        </p>
      ) : (
        <div className="space-y-5">
          {platformData.map((item) => (
            <div
              key={item.providerid}
              className="flex flex-col sm:flex-row sm:items-center gap-3"
            >
              {/* Platform Info */}
              <div className="flex items-center gap-2 sm:w-40">
                <img
                  src={item.providericonpath}
                  alt={item.providername}
                  className="w-6 h-6"
                />
                <p className="text-sm font-medium text-gray-700 truncate">
                  {item.providername}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="flex-1">
                <div className="relative bg-gray-200 h-3 sm:h-2.5 rounded-full">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: "#0D132D",
                    }}
                  />
                </div>

                {/* Percentage (mobile below bar) */}
                {/* <p className="text-xs text-blue-500 mt-1 sm:hidden">
                  {item.percentage}%
                </p> */}
              </div>

              {/* Percentage (desktop) */}
              <p className="hidden sm:block w-12 text-xs text-blue-500 font-medium text-right">
                {item.percentage}%
              </p>

              {/* Likes */}
              <p className="text-sm font-bold text-gray-800 sm:w-24 text-right">
                {formatNumber(item.totallikes)}
                <span className="font-normal text-xs text-gray-500 ml-1">
                  Likes
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
