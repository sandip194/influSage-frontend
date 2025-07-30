import React from "react";
import { FaSearch, FaCommentDots, FaBell, FaChevronDown } from "react-icons/fa";

const DeshboardHeader = () => {
  return (
    <div className="w-full flex justify-between items-center p-3 bg-white border-b border-gray-200">
      {/* Left: Search */}
      <div className="flex items-center w-full max-w-sm rounded-full border border-gray-200 px-4 py-2">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
        />
      </div>

      {/* Right: Icons & Profile */}
      <div className="flex items-center gap-4 ml-4">
        {/* Chat Icon */}
        <div className="relative flex items-center justify-center w-10 h-10 border border-gray-200 rounded-full">
          <FaCommentDots className="text-black text-lg" />
          <span className="absolute -top-1 -right-1 bg-[#0b0d28] text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
            09
          </span>
        </div>

        {/* Bell Icon */}
        <div className="relative flex items-center justify-center w-10 h-10 border border-gray-200 rounded-full">
          <FaBell className="text-black text-lg" />
          <span className="absolute -top-1 -right-1 bg-[#0b0d28] text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
            09
          </span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 cursor-pointer">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-black">Sean Smith</span>
          <FaChevronDown className="text-sm text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default DeshboardHeader;
