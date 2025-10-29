import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  RiFolderOpenLine,
  RiHome2Line,
  RiSettings3Line,
  RiUser3Line,
  RiCloseLine,
  RiLogoutBoxRLine,
} from "@remixicon/react";
import { useDispatch } from "react-redux";
import { logout } from "../../../features/auth/authSlice";

const navItems = [
  { name: "Dashboard", icon: <RiHome2Line />, path: "/admin-dashboard" },
  { name: "User Requests", icon: <RiUser3Line />, path: "/admin-dashboard/influencers" },
  { name: "Campaign Requests", icon: <RiFolderOpenLine />, path: "/admin-dashboard/campaigns" },
  { name: "Settings", icon: <RiSettings3Line />, path: "/admin-dashboard/settings" },
];

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-full w-60 bg-white shadow-md flex flex-col transition-transform transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:shadow-none`}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
        
        {/* Close button only on mobile */}
        <button
          onClick={toggleSidebar}
          className="text-gray-500 md:hidden"
          aria-label="Close sidebar"
        >
          <RiCloseLine className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-2 space-y-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 768 && toggleSidebar) toggleSidebar();
            }}
            className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition ${
              pathname === item.path
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout button at the bottom */}
      <div className="px-4 py-2 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center border border-red-200 gap-2 w-full cursor-pointer text-sm font-medium text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg transition"
        >
          <RiLogoutBoxRLine />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
