import {
    RiArrowLeftDoubleLine,
    RiGalleryView2,
    RiLineChartLine,
    RiMessage3Line,
    RiSearch2Line,
    RiShutDownLine,
    RiStackLine,
    RiWallet3Line
} from "@remixicon/react";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";


const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleResize = () => {
        if (window.innerWidth <= 768) {
            setIsMobile(true);
            setIsOpen(false);
        } else {
            setIsMobile(false);
            setIsOpen(true);
        }
    };

    useEffect(() => {
        handleResize(); // check initially
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const generalItems = [
        { icon: <RiGalleryView2 className="w-5" />, label: "Dashboard", to: "/vendor-dashboard", end:true },
        { icon: <RiSearch2Line className="w-5" />, label: "Browse Influencer", to: "/vendor-dashboard/browse-influencers" },
        { icon: <RiStackLine className="w-5" />, label: "My Campaign", to: "/vendor-dashboard/my-campaigns" },
        { icon: <RiMessage3Line className="w-5" />, label: "Messages", to: "/vendor-dashboard/messages" },
    ];

    const financeItems = [
        { icon: <RiWallet3Line className="w-5" />, label: "Payment", to: "/vendor-dashboard/payment" },
        { icon: <RiLineChartLine className="w-5" />, label: "Analytics", to: "/vendor-dashboard/analytics" },
    ];


    return (
        <div
            className={`h-screen bg-white text-[#141843] px-3 flex flex-col transition-all duration-300
      ${isOpen ? "w-64" : "w-16"} relative z-40 shadow-sm`}
        >
            {/* Header */}
            <div className="flex items-center justify-between py-3 h-18 border-b border-gray-100">
                {isOpen && (
                    <NavLink to="/dashboard">
                        <img
                            src="/public/influSage-logo.png"
                            alt="Logo"
                            className="h-8 w-auto px-3"
                        />
                    </NavLink>
                )}
                <button
                    onClick={toggleSidebar}
                    className="bg-gray-100 text-[#141843] rounded-lg p-1 cursor-pointer"
                >
                    <RiArrowLeftDoubleLine
                        className={`transform transition-transform duration-300 ${!isOpen ? "rotate-180" : ""
                            }`}
                    />
                </button>
            </div>

            {/* Menu */}
            <ul className="flex-1 mt-2 overflow-y-auto">
                {isOpen && (
                    <li className="text-xs text-gray-400 uppercase px-4 mb-4 mt-4">
                        General
                    </li>
                )}
                {generalItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.to}
                        end={item.end}
                        title={!isOpen ? item.label : ""}
                        className={({ isActive }) =>
                            `flex items-center ${isOpen ? "justify-start" : "justify-center"
                            } mb-1 gap-4 px-2 py-2 cursor-pointer rounded-2xl hover:text-white hover:bg-[#141843] 
      ${isActive ? "bg-[#141843] text-white" : "text-[#141843]"}`
                        }
                    >
                        <span className="text-base">{item.icon}</span>
                        {isOpen && <span className="text-sm">{item.label}</span>}
                    </NavLink>
                ))}


                <hr className="my-2 border-gray-200" />

                {isOpen && (
                    <li className="text-xs text-gray-400 uppercase px-4 mb-4 mt-4">
                        Finance
                    </li>
                )}

                {financeItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.to}
                        title={!isOpen ? item.label : ""}
                        className={({ isActive }) =>
                            `flex items-center ${isOpen ? "justify-start" : "justify-center"
                            } mb-1 gap-4 px-2 py-2 cursor-pointer rounded-2xl hover:text-white hover:bg-[#141843] 
      ${isActive ? "bg-[#141843] text-white" : "text-[#141843]"}`
                        }
                    >
                        <span className="text-base">{item.icon}</span>
                        {isOpen && <span className="text-sm">{item.label}</span>}
                    </NavLink>
                ))}
            </ul>

            {/* Logout */}
            <div className="logout-btn mb-2">
                <button
                    title={!isOpen ? "Logout" : ""}
                    className={`flex items-center cursor-pointer ${isOpen ? "justify-between px-6" : "justify-center"
                        } gap-2 w-full  py-2 border border-gray-300 rounded-full hover:bg-gray-100 text-sm`}
                >
                    {isOpen && <span>Logout</span>}
                    <RiShutDownLine />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
