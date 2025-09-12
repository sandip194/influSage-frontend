import React, { useState } from 'react';
import EditPersonalDetails from './EditPersonalDetails';
import Category from './Category';
import SocialMedia from './SocialMedia'
import Portfolio from './Portfolio'
import Payment from './Payment'
import { RiArrowLeftSLine } from 'react-icons/ri';

const EditProfile = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: "Personal Details", component: <EditPersonalDetails /> },
    { title: "Social Media", component: <SocialMedia /> },
    { title: "Categories", component: <Category/> },
    { title: "Portfolio", component: <Portfolio/> },
    { title: "Payment Details", component: <Payment />},
  ];

  return (
    <div className="w-full max-w-7xl mx-auto text-sm overflow-x-hidden">
      {/* Back button */}
      <button
        onClick={() => window.history.back()}
        className="text-gray-600 flex items-center gap-2 hover:text-gray-900 transition mb-4"
      >
        <RiArrowLeftSLine /> Back
      </button>

      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>

      {/* Sidebar + Content (Fixed width layout) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm h-fit">
          <h3 className="font-semibold text-sm mb-4">Edit Your Profile</h3>
          <ul className="space-y-2">
            {steps.map((step, index) => (
              <li key={index}>
                <button
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    activeStep === index
                      ? "bg-gray-100 font-medium text-gray-900"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  {step.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Active step content with FIXED width */}
        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-2xl shadow-sm min-h-[400px] w-full">
            {steps[activeStep].component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
