import React from "react";
import { Button } from "antd";
import { ExclamationCircleOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const BlockedUserPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const query = new URLSearchParams(location.search);
    const status = query.get("status") || "blocked";

    const content = {
        blocked: {
            title: "Account Blocked",
            message:
                "Your profile has been blocked by the admin due to a violation of privacy, terms and conditions, or other policies.",
            color: "red",
        },
        rejected: {
            title: "Account Rejected",
            message:
                "Your profile registration has been rejected. Please contact support for further assistance.",
            color: "orange",
        },
    };

    const { title, message, color } = content[status] || content.blocked;

    // ✅ Tailwind-safe color mappings
    const colorClasses = {
        red: {
            icon: "text-red-500 bg-red-100",
            title: "text-red-700",
            bgLight: "bg-red-100",
            bgMedium: "bg-red-200",
        },
        orange: {
            icon: "text-orange-500 bg-orange-100",
            title: "text-orange-700",
            bgLight: "bg-orange-100",
            bgMedium: "bg-orange-200",
        },
    };

    const colors = colorClasses[color] || colorClasses.red;



    const emailSubject = encodeURIComponent(
        status === "blocked"
            ? "Account Blocked Support"
            : "Account Rejected Support"
    );

    const emailBody = encodeURIComponent(
        "Hello Team,\n\nMy account has been blocked/rejected. Please assist me with this issue.\n\nThank you."
    );


    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 relative overflow-hidden">
            <div className="bg-white shadow-lg rounded-xl p-8 md:p-12 max-w-lg text-center relative z-10">
                <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${colors.icon} mb-6`}
                >
                    <ExclamationCircleOutlined className="text-5xl" />
                </div>

                <h1 className={`text-2xl md:text-3xl font-bold ${colors.title} mb-4`}>{title}</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <p className="text-gray-500 mb-6">
                    For any inquiries or further assistance, please contact us:
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                    <a
                        href={`mailto:influsage.dev@gmail.com?subject=${emailSubject}&body=${emailBody}`}
                        className="flex items-center justify-center gap-2 bg-[#1677ff] hover:bg-[#1657d0] text-white font-medium px-5 py-2.5 rounded-md transition-colors duration-200"
                    >
                        <MailOutlined />
                        Email Support
                    </a>

                    <a
                        href="tel:+9328207032"
                        className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:text-white hover:bg-gray-700 font-medium px-5 py-2.5 rounded-md transition-colors duration-200"
                    >
                        <PhoneOutlined />
                        Call Support
                    </a>

                </div>

                <Button
                    type="link"
                    onClick={() => navigate("/login")}
                    className="text-gray-500 hover:text-gray-700"
                >
                    Return to Login
                </Button>
            </div>

            {/* Decorative background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div
                    className={`absolute -top-20 -left-20 w-72 h-72 ${colors.bgLight} rounded-full opacity-30 animate-pulse`}
                ></div>
                <div
                    className={`absolute -bottom-20 -right-20 w-96 h-96 ${colors.bgMedium} rounded-full opacity-20 animate-pulse`}
                ></div>
            </div>
        </div>
    );
};

export default BlockedUserPage;
