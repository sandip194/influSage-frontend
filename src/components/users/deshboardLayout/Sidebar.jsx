import { RiArrowLeftDoubleLine, RiGalleryView2, RiGiftLine, RiLineChartLine, RiMessage3Line, RiSearch2Line, RiShutDownLine, RiStackLine, RiWallet3Line } from "@remixicon/react";
import React, { useState } from "react";
import { Link } from 'react-router-dom'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const generalItems = [
        { icon: <RiGalleryView2 className="w-5"/>, label: "Dashboard" },
        { icon: <RiSearch2Line className="w-5"/>, label: "Browse Campaign" },
        { icon: <RiStackLine className="w-5"/>, label: "My Campaign" },
        { icon: <RiMessage3Line className="w-5"/>, label: "Messages" },
    ];

    const financeItems = [
        { icon: <RiWallet3Line className="w-5"/>, label: "Payment" },
        { icon: <RiLineChartLine className="w-5"/>, label: "Analytics" },
        { icon: <RiGiftLine className="w-5"/>, label: "Refer & Earn" },
    ];

    return (
        <div
            className={`h-screen bg-white text-[#141843] px-3 flex flex-col transition-all duration-300 ${isOpen ? "w-64" : "w-16"
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between py-3 sm:p-3 border-b border-gray-100">
                {isOpen && <Link to={"/"}>
                    <img src="/public/influSage-logo.png" alt="Logo" className="h-8 w-auto" />
                </Link>}
                <button onClick={toggleSidebar} className="bg-gray-100 text-[#141843] rounded-lg p-1">
                    <RiArrowLeftDoubleLine
                        className={`transform transition-transform duration-300 ${!isOpen ? "rotate-180" : ""
                            }`}
                    />
                </button>
            </div>

            {/* Menu */}
            <ul className="flex-1 mt-2">
                {/* General Section */}
                {isOpen && <li className="text-xs text-gray-400 uppercase px-4 mb-4 mt-4">General</li>}
                
                {generalItems.map((item, index) => (
                    <li
                        key={index}
                        className={`flex items-center ${isOpen ? "justify-start" : "justify-center"} mb-1 gap-4 px-2 py-2 cursor-pointer rounded-2xl hover:text-white hover:bg-[#141843] ${index === 0 ? "bg-[#141843] text-white" : ""
                            }`}
                    >
                        <span className="text-base">{item.icon}</span>
                        {isOpen && <span className="text-sm">{item.label}</span>}
                    </li>
                ))}

                {/* Divider */}
                <hr className="my-2 border-gray-200" />

                {/* Finance Section */}

                {isOpen &&  <li className="text-xs text-gray-400 uppercase px-4 mb-4 mt-4">Finance</li>}
               
                {financeItems.map((item, index) => (
                    <li
                        key={index}
                        className={`flex items-center ${isOpen ? "justify-start" : "justify-center"} mb-1 gap-4 px-2 py-2 cursor-pointer rounded-2xl hover:text-white hover:bg-[#141843]`}
                    >
                        <span className="text-base">{item.icon}</span>
                        {isOpen && <span className="text-sm">{item.label}</span>}
                    </li>
                ))}
            </ul>


            {/* Logout */}
            <div className="logout-btn mb-2">
                <button className="flex w-full justify-center items-center gap-2 cursor-pointer px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-100 text-sm">
                     {isOpen && <span>Logout</span>}
                    <span> <RiShutDownLine className="w-5"/></span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
