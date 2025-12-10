import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RiVerifiedBadgeLine } from '@remixicon/react';

const ThankYouScreen = () => {
  const { role } = useSelector((state) => state.auth);
  // const navigate = useNavigate();
  const roleId = Number(role);

  // const handleGoToHome = () => {
  //   if (roleId === 1) {
  //     navigate("/dashboard");
  //   } else if (roleId === 2) {
  //     navigate("/vendor-dashboard");
  //   }
  // };

  return (
    <div className="flex items-center justify-start ">
            <div className="bg-white rounded-3xl p-10  text-start w-full">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#F3F4F6]">
            <RiVerifiedBadgeLine className="w-10 h-10 text-[#121A3F]" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-[#121A3F]">Thank You</h2>

        {roleId === 1 ? (
          <>
            <p className="text-gray-700 mb-6 text-justify">
              Thank you for completing your influencer profile.
            </p>
            <p className="text-gray-600 mb-8 text-justify">
              <span className="font-bold text-[#121A3F]">
                Our team will review your details shortly. Once approved, you'll be
                able to explore campaigns, collaborate with brands, and start growing
                your influence. We appreciate your patience!
              </span>
            </p>
          </>
        ) : roleId === 2 ? (
          <>
            <p className="text-gray-700 mb-6 text-justify">
              Thank you for completing your business profile.
            </p>
            <p className="text-gray-600 mb-8 text-justify">
              <span className="font-bold text-[#121A3F]">
                Thank you for submitting your business details!  
                You can now create campaigns, connect with influencers,
                and grow your brand presence with us.
              </span>
            </p>
          </>
        ) : (
          <p className="text-gray-700 mb-6 text-justify">
            Thank you for providing your information. Your profile is under review.
          </p>
        )}

        {/* Button
        <button
          onClick={handleGoToHome}
          className="bg-[#121A3F] hover:bg-[#0D132D] cursor-pointer text-white font-semibold px-6 py-3 rounded-full shadow-md"
        >
          Go To Home
        </button> */}
      </div>
    </div>
  );
};

export default ThankYouScreen;
