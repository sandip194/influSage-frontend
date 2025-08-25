import { RiVerifiedBadgeFill, RiVerifiedBadgeLine } from '@remixicon/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ThankYouScreen = () => {

    const { role } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const handleGoToHome = () => {
        const roleId = parseInt(role); // Make sure it's stored as a number

        if (roleId === 1) {
            navigate("/dashboard");
        } else if (roleId === 2) {
            navigate("/vendor-dashboard");
        } 
    };


    return (
        <div className="flex items-center justify-start ">
            <div className="bg-white rounded-3xl p-10  text-start w-full">
                <div className="mb-6">
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#F3F4F6]">
                        <RiVerifiedBadgeLine className='w-10 h-10' />
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-[#0D132D]">Thank You</h2>
                <p className="text-gray-700 mb-6">
                    Thank you for completing your profile and submitting your details.
                </p>
                <p className="text-gray-600 mb-8">
                    Our team will review your information shortly, and once approved,
                    you'll be able to access and start using the platform fully.
                    We appreciate your patience!
                </p>
                <button
                    onClick={handleGoToHome}
                    className="bg-[#121A3F] hover:bg-[#0D132D] cursor-pointer text-white font-semibold px-6 py-3 rounded-full shadow-md"
                >
                    Go To Home
                </button>
            </div>
        </div>
    );
};

export default ThankYouScreen;
