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

  const totalViews = useMemo(
    () => platformData.reduce((acc, cur) => acc + (cur.views || 0), 0),
    [platformData]
  );

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm w-full">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <h2 className="text-lg font-bold text-gray-900">Platform Breakdown</h2>
        </Col>
        <Col>
          <div className="flex space-x-2">
            <Select
              value={month}
              onChange={setMonth}
              size="middle"
              style={{ width: 100 }}
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
              style={{ width: 80 }}
            >
              {yearList.map((y) => (
                <Option key={y} value={y}>
                  {y}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
      </Row>

      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : platformData.length === 0 ? (
        <p className="text-gray-500 text-sm">No data available for the selected month/year.</p>
      ) : (
        <div className="space-y-4">
          {platformData.map((item, idx) => {
            const percentage =
              totalViews > 0 ? ((item.views || 0) / totalViews) * 100 : 0;
            return (
              <div key={idx} className="flex items-center space-x-3">
                <img
                  src={item.icon || ""}
                  alt={item.platform || "Unknown"}
                  className="w-6 h-6"
                />
                <p className="w-20 text-sm text-gray-700">{item.platform || "Unknown"}</p>

                {/* Bar */}
                <div className="flex-1 bg-gray-200 h-3 rounded-full relative">
                  <div
                    className="h-3 rounded-full"
                    style={{
                      width: `${percentage.toFixed(1)}%`,
                      backgroundColor: item.color || "#0D132D",
                    }}
                  ></div>

                  <span className="absolute right-1 text-[10px] text-blue-400 font-medium">
                    {percentage.toFixed(1)}%
                  </span>
                </div>

                {/* Count with k/M format */}
                <p className="w-20 text-sm font-bold text-gray-800 text-right">
                  {formatNumber(item.views)} Views
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
