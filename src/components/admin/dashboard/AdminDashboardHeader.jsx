import { Dropdown, Avatar, Badge } from "antd";
import { RiMenu2Line, RiNotification3Line } from "@remixicon/react";

const userMenu = {
    items: [
        { key: "1", label: "Profile" },
        { key: "2", label: "Logout" },
    ],
};

const notifications = {
    items: [
        { key: "1", label: "New user registered" },
        { key: "2", label: "Campaign request pending" },
        { key: "3", label: "System update available" },
    ],
};

const AdminDashboardHeader = ({ toggleSidebar }) => {
    return (
        <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:pl-64 fixed top-0 left-0 z-30">
            {/* Mobile Hamburger */}
            <button
                className="md:hidden text-gray-600"
                onClick={toggleSidebar}
            >
                <RiMenu2Line size={24} />
            </button>

            {/* Right-side Controls */}
            <div className="flex items-center gap-4 ml-auto">
                {/* Notifications */}
                <Dropdown
                    menu={notifications}
                    placement="bottomRight"
                    arrow
                >
                    <div className="cursor-pointer relative">
                        <Badge count={3} size="small">
                            <RiNotification3Line size={22} className="text-gray-600" />
                        </Badge>
                    </div>
                </Dropdown>

                {/* User Avatar + Dropdown */}
                <Dropdown menu={userMenu} placement="bottomRight" arrow>
                    <div className="flex items-center gap-2 cursor-pointer">
                        <Avatar src="https://i.pravatar.cc/150?img=5" />
                        <span className="hidden sm:inline text-sm font-medium text-gray-700">Admin User</span>
                    </div>
                </Dropdown>
            </div>
        </header>
    );
};

export default AdminDashboardHeader;
