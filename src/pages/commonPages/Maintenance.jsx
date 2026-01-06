// pages/commonPages/Maintenance.jsx
import React from "react";

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-[#EAF2FF] flex items-center justify-center px-4 sm:px-16">

      <div className="relative w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16">

        {/* LEFT CONTENT */}
        <div className="order-2 lg:order-1 text-center lg:text-left">

          {/* MOBILE CARD */}
          <div className="bg-white/90 backdrop-blur rounded-3xl p-6 sm:p-8 lg:p-0 lg:bg-transparent lg:backdrop-blur-0">

            {/* LOGO */}
            <div className="mb-4 flex justify-center lg:justify-start">
              <img
                src="/influSage-logo.png"
                alt="InfluSage Logo"
                className="h-7 sm:h-8"
              />
            </div>

            {/* HEADING */}
            <h1 className="text-[26px] sm:text-[34px] md:text-[40px] lg:text-[52px] font-extrabold text-[#0B122E] leading-tight mb-4">
              InfluSage is <br className="hidden sm:block" /> Under Maintenance
            </h1>

            {/* DESCRIPTION */}
            <p className="text-gray-500 text-sm sm:text-base md:text-lg mb-6">
              We’re improving the experience for you.  
              We’ll be back very soon!
            </p>

            {/* CTA */}
            <button className="
              w-full
              sm:w-auto
              bg-[#FFC93C]
              text-[#0B122E]
              px-8
              py-4
              rounded-full
              font-semibold
              text-base
              hover:bg-[#FFB703]
              transition
            ">
              Contact Us
            </button>

          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="order-1 lg:order-2 flex justify-center">
          <img
            src="/Maintenance.png"
            alt="Website under maintenance"
            className="
              w-full
              max-w-[220px]
              sm:max-w-[300px]
              md:max-w-[360px]
              lg:max-w-[520px]
            "
          />
        </div>

      </div>
    </div>
  );
};

export default Maintenance;
