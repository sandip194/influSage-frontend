import React, { useMemo } from 'react';
import { RiArrowLeftSLine } from 'react-icons/ri';

import { useProfileCompletionSteps } from '../../../hooks/useProfileCompletionSteps';
import { PersonalDetails } from '../../users/complateProfile/PersonalDetails';
import { SocialMediaDetails } from '../../users/complateProfile/SocialMediaDetails';
import { CategorySelector } from '../../users/vendorProfile/CategorySelector';
import PortfolioUploader from '../../users/complateProfile/PortfolioUploader';
import PaymentDetailsForm from '../../users/complateProfile/PaymentDetailsForm';
import { toast } from 'react-toastify';

const EditProfile = () => {
  const {
    profileData,
    updateProfileSection,
    currentStep,
    setCurrentStep,
    markStepComplete,
    getUserProfileCompletionData
  } = useProfileCompletionSteps();

  const steps = useMemo(() => [
    {
      title: "Personal Details",
      component: (
        <PersonalDetails
          data={profileData.profile}
          onSave={() => {
            toast.success('Profile updated successfully!');
            getUserProfileCompletionData()
          }}
          showControls={true}
          showToast={false}
        />
      )
    },
    {
      title: "Social Media",
      component: (
        <SocialMediaDetails
          data={profileData.social}
          onSave={() => {
            toast.success('Profile updated successfully!');
            getUserProfileCompletionData()
          }}
          showControls={true}
          showToast={false}
        />
      )
    },
    {
      title: "Categories",
      component: (
        <CategorySelector
          data={profileData.categories}
          onSave={() => {
            toast.success('Profile updated successfully!');
            getUserProfileCompletionData()
          }}
          showControls={true}
          showToast={false}
        />
      )
    },
    {
      title: "Portfolio",
      component: (
        <PortfolioUploader
          data={profileData.portfolio}
          onSave={() => {
            toast.success('Profile updated successfully!');
            getUserProfileCompletionData()
          }}
          showControls={true}
          showToast={false}
        />
      )
    },
    {
      title: "Payment",
      component: (
        <PaymentDetailsForm
          data={profileData.payment}
          onSave={() => {
            toast.success('Profile updated successfully!');
            getUserProfileCompletionData()
          }}
          showControls={true}
          showToast={false}
        />
      )
    }
  ], [profileData, updateProfileSection, markStepComplete]);

  return (
    <div className="w-full text-sm">
      <button
        onClick={() => window.history.back()}
        className="text-gray-600 flex items-center gap-2 hover:text-gray-900 transition mb-4"
      >
        <RiArrowLeftSLine /> Back
      </button>

      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="bg-white p-4 rounded-2xl shadow-sm h-fit">
          <h3 className="font-semibold text-sm mb-4">Sections</h3>
          <ul className="space-y-2">
            {steps.map((step, index) => (
              <li key={index}>
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`w-full text-left cursor-pointer px-3 py-2 rounded-lg transition ${currentStep === index
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

        {/* Content */}
        <div className="md:col-span-3">
          <div className="bg-white p-0 rounded-2xl shadow-sm min-h-[400px] w-full">
            {steps[currentStep]?.component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
