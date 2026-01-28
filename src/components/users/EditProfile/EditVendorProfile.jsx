import React, { useMemo } from 'react';
import { RiArrowLeftSLine } from 'react-icons/ri';
import { toast } from 'react-toastify';

import { useVendorProfileCompletionSteps } from '../../../hooks/useVendorProfileCompletionSteps';
import { BusinessDetails } from '../../../components/users/vendorProfile/BusinessDetails';
import { CategorySelector } from '../../../components/users/vendorProfile/CategorySelector';
import { SocialMediaDetails } from '../../../components/users/vendorProfile/SocialMediaDetails';
import ObjectiveSelector from '../../../components/users/vendorProfile/ObjectiveSelector';
import PaymentDetailsForm from '../../../components/users/complateProfile/PaymentDetailsForm';

const EditVendorProfile = () => {
    const {
        vendorProfileData,
        currentStep,
        setCurrentStep,
        getUserProfileCompletionData,
        loading
    } = useVendorProfileCompletionSteps();



    /* ✅ steps created ONLY after data exists */
    const steps = useMemo(() => [
        {
            title: "Business Details",
            component: (
                <BusinessDetails
                    data={vendorProfileData.profile}
                    onSave={() => {
                        toast.success('Profile updated successfully!');
                        getUserProfileCompletionData();
                    }}
                    showControls
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
                        getUserProfileCompletionData();
                    }}
                    showControls
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
                        getUserProfileCompletionData();
                    }}
                    showControls
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
                        getUserProfileCompletionData();
                    }}
                    showControls
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
                        getUserProfileCompletionData();
                    }}
                    showControls
                    showToast={false}
                />
            )
        }
    ], [vendorProfileData, getUserProfileCompletionData]);

    /* ⛔ BLOCK render until data is ready (same contract as EditProfile) */
    if (loading) {
        return (
            <div className="w-full flex items-center justify-center h-64 text-gray-500">
                Loading profile…
            </div>
        );
    }

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
                {/* Sidebar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm h-fit">
                    <h3 className="font-semibold text-sm mb-4">Sections</h3>
                    <ul className="space-y-2">
                        {steps.map((step, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => setCurrentStep(index)}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition ${currentStep === index
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
                    <div className="bg-white p-6 rounded-2xl shadow-sm min-h-[400px] w-full">
                        {/* 🔑 force remount like EditProfile */}
                        {steps[currentStep] && (
                            <div key={currentStep}>
                                {steps[currentStep].component}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditVendorProfile;
