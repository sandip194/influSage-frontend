import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminDashboardHeader from "./AdminDashboardHeader";

const AdminDashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* Sidebar for desktop */}
            <div className="hidden md:block fixed inset-y-0 left-0 w-60 bg-white shadow-lg z-30">
                <AdminSidebar isOpen={true} />
            </div>

            {/* Sidebar for mobile */}
            <div
                className={`fixed inset-y-0 left-0 w-60 bg-white shadow-lg z-40 transform transition-transform duration-300 md:hidden ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>

            {/* Backdrop for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-20">
                <AdminDashboardHeader toggleSidebar={toggleSidebar} />
            </div>

            {/* Main Content */}
            <main className="pt-16 md:pl-60 transition-all duration-300">
                <div className="p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardLayout;
