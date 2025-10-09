
import { Dropdown, Avatar } from "antd";
import { RiMenu2Line, RiNotification3Line } from "@remixicon/react";
const userMenu = {
    items: [
        { key: "1", label: "Profile" },
        { key: "2", label: "Logout" },
    ],
};

const AdminDashboardHeader = ({ toggleSidebar }) => {
    return (
        <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:pl-64 fixed top-0 left-0 z-30">

            {/* Hamburger for mobile */}
            <button
                className="md:hidden text-gray-600"
                onClick={toggleSidebar}
            >
                <RiMenu2Line size={24} />
            </button>

            {/* Right side user panel */}
            <div className="flex items-center gap-4 ml-auto">
                <RiNotification3Line size={22} className="text-gray-500 cursor-pointer" />
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


export default AdminDashboardHeader