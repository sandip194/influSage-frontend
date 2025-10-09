import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminDashboardHeader from "./AdminDashboardHeader";

const AdminDashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* Sidebar */}
            <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <AdminDashboardHeader toggleSidebar={toggleSidebar} />
            {/* Mobile Sidebar (if needed later) */}
            {/* Add modal/sidebar drawer logic here for mobile if needed */}

            {/* Main content */}
            {isSidebarOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0  bg-opacity-30 z-20 md:hidden"
                />
            )}

            <main className="pt-16 md:pl-60">
                <div className="main p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};


export default AdminDashboardLayout