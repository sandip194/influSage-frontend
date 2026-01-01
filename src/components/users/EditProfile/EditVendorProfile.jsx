import React, { useMemo } from 'react';
import { RiArrowLeftSLine } from 'react-icons/ri';

import { useVendorProfileCompletionSteps } from '../../../hooks/useVendorProfileCompletionSteps';
import { BusinessDetails } from '../../../components/users/vendorProfile/BusinessDetails';
import { CategorySelector } from '../../../components/users/vendorProfile/CategorySelector';
import { SocialMediaDetails } from '../../../components/users/vendorProfile/SocialMediaDetails';
import ObjectiveSelector from '../../../components/users/vendorProfile/ObjectiveSelector';
import PaymentDetailsForm from '../../../components/users/complateProfile/PaymentDetailsForm';
import { toast } from 'react-toastify';

const EditVendorProfile = () => {
    const {
        vendorProfileData,
        updateProfileSection,
        currentStep,
        setCurrentStep,
        markStepComplete,
        getUserProfileCompletionData
    } = useVendorProfileCompletionSteps();

    const steps = useMemo(() => [
        {
            title: "Business Details",
            component: (
                <BusinessDetails
                    data={vendorProfileData.profile}
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
                    data={vendorProfileData.categories}
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
                    data={vendorProfileData.providers}
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
            title: "Objectives",
            component: (
                <ObjectiveSelector
                    data={vendorProfileData.objectives}
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
                    data={vendorProfileData.payment}
                    onSave={() => {
                        toast.success('Profile updated successfully!');
                        getUserProfileCompletionData()
                    }}
                    showControls={true}
                    showToast={false}
                />
            )
        }
    ], [vendorProfileData, updateProfileSection, markStepComplete]);

    return (
        <div className="w-full text-sm">
            <button
                onClick={() => window.history.back()}
                className="text-gray-600 cursor-pointer flex items-center gap-2 hover:text-gray-900 transition mb-2"
            >
                <RiArrowLeftSLine /> Back
            </button>

            <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="bg-white p-4 rounded-2xl shadow-sm h-fit">
                    <h3 className="font-semibold text-sm mb-4">Sections</h3>
                    <ul className="space-y-2">
                        {steps.map((step, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => setCurrentStep(index)}
                                    className={`w-full cursor-pointer text-left px-3 py-2 rounded-lg transition ${currentStep === index
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
                    <div className="bg-white p-2 rounded-2xl shadow-sm min-h-[400px] w-full">
                        {steps[currentStep]?.component}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditVendorProfile;
