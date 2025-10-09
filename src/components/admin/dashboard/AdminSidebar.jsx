
import { Link, useLocation } from "react-router-dom";
import { RiFolderOpenLine, RiHome2Line, RiSettings3Line, RiUser3Line } from "@remixicon/react";

const navItems = [
    { name: "Dashboard", icon: <RiHome2Line />, path: "/admin" },
    { name: "User Requests", icon: <RiUser3Line />, path: "/admin/users" },
    { name: "Campaign Requests", icon: <RiFolderOpenLine />, path: "/admin/campaigns" },
    { name: "Settings", icon: <RiSettings3Line />, path: "/admin/settings" },
];

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
    const { pathname } = useLocation();

    return (
        <aside
            className={`fixed top-0 left-0 z-40 h-full w-60 bg-white shadow-md transition-transform transform md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
        >
            {/* Logo / Title */}
            <div className="px-6 py-4 h-16 border-b border-gray-200">
                <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
            </div>
            {/* Navigation */}
            <nav className="mt-4 px-2">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        onClick={toggleSidebar}
                        className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition ${pathname === item.path
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-700 hover:bg-gray-100" 
                            }`}
                    >
                        {item.icon}
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default AdminSidebar;