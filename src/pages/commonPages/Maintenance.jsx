// pages/commonPages/Maintenance.jsx
import React from "react";

const Maintenance = () => {
    return (
        <div className="min-h-screen bg-[#F7FAFF] flex items-center">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 px-6 lg:px-10 gap-10 items-center">

                {/* LEFT CONTENT */}
                <div className="max-w-xl">
                    <div className="mb-6">
                        <img
                            src="/influSage-logo.png"   // or logo.png
                            alt="Company Logo"
                            className="h-8 w-auto"
                        />
                    </div>


                    <h1 className="text-[42px] md:text-[52px] font-extrabold text-[#0B122E] leading-tight mb-6">
                        Website is under <br /> construction
                    </h1>

                    <p className="text-gray-500 text-lg leading-relaxed mb-10">
                        We’re currently working hard to improve our website
                        and will be ready very soon. Stay tuned!
                    </p>

                    <button className="bg-[#0B122E] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#111A44] transition">
                        Contact Us
                    </button>
                </div>

                {/* RIGHT ILLUSTRATION */}
                <div className="flex justify-center lg:justify-end">
                    <img
                        src="/Maintenance.png"
                        alt="Website under construction"
                        className="w-full max-w-[520px]"
                    />
                </div>
            </div>
        </div>
    );
};

export default Maintenance;
