import React from "react";

const AudienceDemographic = () => {
  const ageGenderData = [
    { range: "25-34", women: 30, men: 20, unknown: 1, total: 51.1 },
    { range: "18-24", women: 10, men: 15, unknown: 0, total: 25 },
    { range: "35-44", women: 12, men: 6, unknown: 0, total: 18 },
    { range: "45-54", women: 2, men: 2, unknown: 0.2, total: 4.2 },
    { range: "55-64", women: 1, men: 0, unknown: 0, total: 1 },
  ];

  const countryData = [
    { country: "India", value: 51.1 },
    { country: "United States", value: 25 },
    { country: "United Kingdom", value: 18 },
    { country: "Australia", value: 4.2 },
    { country: "Pakistan", value: 1 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Audience Demographic</h2>
        <div className="flex space-x-2">
          <select className="border rounded-full px-3 py-1 text-sm text-gray-600">
            <option>Instagram</option>
            <option>Facebook</option>
            <option>TikTok</option>
          </select>
          <select className="border rounded-full px-3 py-1 text-sm text-gray-600">
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Yearly</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-4 text-xs text-gray-600 mb-4">
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span>Women</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-blue-900 rounded-full"></span>
          <span>Men</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
          <span>Unknown</span>
        </div>
      </div>

      {/* Split layout with divider */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
       
        <div className="space-y-4 border-r border-gray-200 pr-6">
          <h3 className="text-sm font-bold text-gray-700 mb-2">
            Age & Gender
          </h3>
          {ageGenderData.map(({ range, women, men, unknown, total }, idx) => {
            const sum = women + men + unknown;
            return (
              <div
                key={idx}
                className="flex items-center justify-between w-full"
              >
                <div className="flex-1 mr-3">
                  <p className="text-sm text-gray-700 mb-1">{range}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 flex overflow-hidden">
                    <div
                      className="h-2 bg-blue-500"
                      style={{ width: `${(women / sum) * 100}%` }}
                    ></div>
                    <div
                      className="h-2 bg-blue-900"
                      style={{ width: `${(men / sum) * 100}%` }}
                    ></div>
                    <div
                      className="h-2 bg-gray-400"
                      style={{ width: `${(unknown / sum) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-800">{total}%</p>
              </div>
            );
          })}
        </div>

        {/* Right: Countries */}
        <div className="space-y-4 pl-6">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Countries</h3>
          {countryData.map(({ country, value }, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between w-full"
            >
              <div className="flex-1 mr-3">
                <p className="text-sm text-gray-700 mb-1">{country}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-800">{value}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudienceDemographic;
