import {
    RiArrowLeftDoubleLine,
    RiGalleryView2,
    RiGiftLine,
    RiLineChartLine,
    RiMessage3Line,
    RiSearch2Line,
    RiShutDownLine,
    RiStackLine,
    RiWallet3Line
} from '@remixicon/react';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../features/auth/authSlice';
import { Tooltip } from 'antd';



const Sidebar = forwardRef((props, ref) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    useImperativeHandle(ref, () => ({
        toggleSidebar, // expose this to parent
    }));

    const handleResize = () => {
        if (window.innerWidth < 768) {
            setIsMobile(true);
            setIsOpen(false); // Mobile: sidebar hidden fully
        } else if (window.innerWidth <= 1024) {
            setIsMobile(false);
            setIsOpen(false); // Medium: sidebar closed, but not mobile (icons visible)
        } else {
            setIsMobile(false);
            setIsOpen(false);  // Desktop: sidebar open full
        }
    };


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    useEffect(() => {
        handleResize(); // check initially
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const generalItems = [
        { icon: <RiGalleryView2 className="w-5" />, label: "Dashboard", to: "/dashboard", end: true },
        { icon: <RiSearch2Line className="w-5" />, label: "Browse Campaign", to: "/dashboard/browse" },
        { icon: <RiStackLine className="w-5" />, label: "My Campaign", to: "/dashboard/my-campaigns" },
        { icon: <RiMessage3Line className="w-5" />, label: "Messages", to: "/dashboard/messages" },
    ];

    const financeItems = [
        { icon: <RiWallet3Line className="w-5" />, label: "Payment", to: "/dashboard/payment" },
        { icon: <RiLineChartLine className="w-5" />, label: "Analytics", to: "/dashboard/analytics" },
        { icon: <RiGiftLine className="w-5" />, label: "Refer & Earn", to: "/dashboard/referrals" },
    ];


    return (
        <>
            {/* Overlay (only for mobile when open) */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-[#00000069] bg-opacity-20  z-30"
                    onClick={toggleSidebar} // click outside to close
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`
                           bg-white text-[#0D132D] flex flex-col transition-all duration-300 shadow-sm z-40
                          ${isMobile
                        ? `fixed top-0 left-0 h-full ${isOpen ? "w-64 px-4 py-1" : "w-0"}`
                        : `h-screen ${isOpen ? "w-64 px-3 py-1" : "w-16 px-2 py-1"}`
                    }
     `}
            >
                {/* Header */}
                <div className={`flex items-center ${isOpen ? "justify-between" : "justify-center"} py-3 h-18 border-b border-gray-100`}>
                    {isOpen && (
                        <NavLink to="/dashboard">
                            <img
                                src="/influSage-logo.png"
                                alt="Logo"
                                className="h-8 w-auto px-3"
                            />
                        </NavLink>
                    )}
                    {!isMobile && (
                        <button
                            onClick={toggleSidebar}
                            className="bg-gray-100 text-[#0D132D] rounded-lg p-1 cursor-pointer"
                        >
                            <RiArrowLeftDoubleLine
                                className={`transform transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`}
                            />
                        </button>
                    )}

                    {isMobile && isOpen && (
                        <button
                            onClick={toggleSidebar}
                            className="px-2 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Menu */}
                <ul className="flex-1 mt-2 overflow-y-auto">
                    {/* General Section */}
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
                            onClick={() => isMobile && toggleSidebar()}
                            title={!isOpen ? item.label : ""}
                            className={({ isActive }) =>
                                `flex items-center ${isOpen ? "justify-start" : "justify-center"}
                  mb-1 gap-4 px-2 py-2 cursor-pointer rounded-2xl hover:text-white hover:bg-[#0D132D] 
                  ${isActive ? "bg-[#0D132D] text-white" : "text-[#0D132D]"}`
                            }
                        >
                            <Tooltip title={item.label} placement="right" disabled={isOpen}>
                                <span className="text-base">{item.icon}</span>
                            </Tooltip>
                            {isOpen && <span className="text-sm">{item.label}</span>}
                        </NavLink>
                    ))}

                    <hr className="my-2 border-gray-200" />

                    {/* Finance Section */}
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
                                `flex items-center ${isOpen ? "justify-start" : "justify-center"}
                  mb-1 gap-4 px-2 py-2 cursor-pointer rounded-2xl hover:text-white hover:bg-[#0D132D] 
                  ${isActive ? "bg-[#0D132D] text-white" : "text-[#0D132D]"}`
                            }
                        >
                            <Tooltip title={item.label} placement="right" disabled={isOpen}>
                                <span className="text-base">{item.icon}</span>
                            </Tooltip>
                            {isOpen && <span className="text-sm">{item.label}</span>}
                        </NavLink>
                    ))}
                </ul>

                {/* Logout */}
                {!(isMobile && !isOpen) && (
                    <div className="logout-btn mb-2">
                        <Tooltip
                            title="Logout"
                            placement="right"
                            disabled={isOpen}
                        >
                            <button
                                onClick={handleLogout}
                                className={`flex items-center cursor-pointer ${isOpen ? "justify-between px-6" : "justify-center "
                                    } w-full py-2 border border-red-300 rounded-full text-red-600 font-semibold hover:text-white hover:bg-red-600 text-sm`}
                            >

                                {isOpen && <span>Logout</span>}
                                <RiShutDownLine />

                            </button>
                        </Tooltip>
                    </div>
                )}
            </div>
        </>
    );
});

export default Sidebar;
