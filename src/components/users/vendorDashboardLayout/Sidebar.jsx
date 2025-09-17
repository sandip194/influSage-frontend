import {
    RiArrowLeftDoubleLine,
    RiGalleryView2,
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
import { RiPriceTag3Line } from 'react-icons/ri';


const Sidebar = forwardRef((props, ref) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    useImperativeHandle(ref, () => ({
        toggleSidebar, // expose this to parent
    }));

    const handleResize = () => {
        const width = window.innerWidth;

        if (width < 768) {
            setIsMobile(true);   // true mobile
            setIsOpen(false);    // hide sidebar
        } else if (width < 1024) {
            setIsMobile(false);  // tablet-like
            setIsOpen(false);    // mini-sidebar (icons only)
        } else {
            setIsMobile(false);  // desktop
            setIsOpen(true);     // full sidebar
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
        { icon: <RiGalleryView2 className="w-5" />, label: "Dashboard", to: "/vendor-dashboard", end: true },
        { icon: <RiSearch2Line className="w-5" />, label: "Browse Influencer", to: "/vendor-dashboard/browse-influencers" },
        { icon: <RiStackLine className="w-5" />, label: "My Campaign", to: "/vendor-dashboard/vendor-campaign" },
        { icon: <RiPriceTag3Line className="w-5" />, label: "Offers", to: "/vendor-dashboard/offers" },
        { icon: <RiMessage3Line className="w-5" />, label: "Messages", to: "/vendor-dashboard/messages" },
    ];

    const financeItems = [
        { icon: <RiWallet3Line className="w-5" />, label: "Payment", to: "/vendor-dashboard/payment" },
        { icon: <RiLineChartLine className="w-5" />, label: "Analytics", to: "/vendor-dashboard/analytics" },
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
                                src="/public/influSage-logo.png"
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
                            <span className="text-base">{item.icon}</span>
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
                            <span className="text-base">{item.icon}</span>
                            {isOpen && <span className="text-sm">{item.label}</span>}
                        </NavLink>
                    ))}
                </ul>

                {/* Logout */}
                <div className="logout-btn mb-2">
                    <button
                        onClick={handleLogout}
                        title={!isOpen ? "Logout" : ""}
                        className={`flex items-center cursor-pointer ${isOpen ? "justify-between px-6" : "justify-center"}
            gap-2 w-full py-2 border border-gray-300 rounded-full hover:bg-gray-100 text-sm`}
                    >
                        {isOpen && <span>Logout</span>}
                        <RiShutDownLine />
                    </button>
                </div>
            </div>
        </>
    );
});

export default Sidebar;
