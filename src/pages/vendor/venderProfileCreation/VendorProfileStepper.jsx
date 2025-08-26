import React, { useState, useEffect } from 'react';
import { Steps } from 'antd';
import { ProfileHeader } from '../../../components/users/complateProfile/ProfileHeader';
import { RiMenu2Line } from 'react-icons/ri';
import PaymentDetailsForm from '../../../components/users/complateProfile/PaymentDetailsForm';
import ThankYouScreen from '../../../components/users/complateProfile/ThankYouScreen';
import { BusinessDetails } from '../../../components/users/vendorProfile/BusinessDetails';
import { CategorySelector } from '../../../components/users/vendorProfile/CategorySelector';
import PlatformSelector from '../../../components/users/vendorProfile/PlatformSelector';
import ObjectiveSelector from '../../../components/users/vendorProfile/ObjectiveSelector';
import axios from 'axios';
import { SocialMediaDetails } from '../../../components/users/vendorProfile/SocialMediaDetails';
import { useSelector } from 'react-redux';

export const VendorProfileStepper = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([false, false, false, false, false]);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

      const { token, userId} = useSelector(state => state.auth);

    const [vendorProfileData, setVendorProfileData] = useState({
        profile: {},
        categories: [],
        providers: [],
        objectives: [],
        payment: {}
    });

    const updateProfileSection = (sectionKey, newData) => {
        setVendorProfileData(prev => ({
            ...prev,
            [sectionKey]: newData
        }));
    };

    const isProfileComplete = (profile) => {
        if (!profile || Object.keys(profile).length === 0) return false;

        const fieldsToCheck = [
            'photopath', 'genderid', 'dob', 'address1',
            'countryname', 'statename', 'bio'
        ];

        return fieldsToCheck.some(field => {
            const value = profile[field];
            return value !== null && value !== undefined && value !== '';
        });
    };

    const isCategoriesComplete = (categories) =>
        Array.isArray(categories) && categories.length > 0;

    const isProvidersComplete = (providers) =>
        Array.isArray(providers) && providers.length > 0;

    const isObjectivesComplete = (objectives) =>
        Array.isArray(objectives) && objectives.length > 0;

    const isPaymentComplete = (payment) => {
        if (!payment || Object.keys(payment).length === 0) return false;

        const fieldsToCheck = [
            'bankcountry', 'bankname', 'accountholdername', 'accountnumber',
            'bankcode', 'branchaddress', 'contactnumber', 'email',
            'preferredcurrency', 'taxidentificationnumber'
        ];

        const hasValidField = fieldsToCheck.some(field => {
            const val = payment[field];
            return val !== null && val !== undefined && val !== '';
        });

        const hasValidPaymentMethod = Array.isArray(payment.paymentmethod) &&
            payment.paymentmethod.some(pm =>
                pm.method && pm.paymentdetails
            );

        return hasValidField || hasValidPaymentMethod;
    };

    const markStepComplete = (index) => {
        const updated = [...completedSteps];
        if (!updated[index]) {
            updated[index] = true;
            setCompletedSteps(updated);
        }

        if (index + 1 < steps.length) {
            setCurrentStep(index + 1);
        } else {
            // Mark profile as complete, but let currentStep go one beyond steps
            setIsCompleted(true);
            setCurrentStep(steps.length); // This triggers ThankYouScreen
        }
    };


    const steps = [
        {
            title: "Business Information",
            component: (
                <BusinessDetails
                    data={vendorProfileData.profile}
                    onChange={(updated) => updateProfileSection('profile', updated)}
                    onNext={() => markStepComplete(0)}
                />
            ),
        },
        {
            title: "Categories",
            component: (
                <CategorySelector
                    data={vendorProfileData.categories}
                    onNext={() => markStepComplete(1)}
                    onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                />
            ),
        },
        {
            title: "Platform And Social",
            component: (
                <SocialMediaDetails
                    data={vendorProfileData.providers}
                    onNext={() => markStepComplete(2)}
                    onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                />
            ),
        },
        {
            title: "Objectives",
            component: (
                <ObjectiveSelector
                    data={vendorProfileData.objectives}
                    onNext={() => markStepComplete(3)}
                    onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                />
            ),
        },
        {
            title: "Payment Information",
            component: (
                <PaymentDetailsForm
                    data={vendorProfileData.payment}
                    onNext={() => markStepComplete(4)}
                    onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                />
            ),
        },
    ];

    const getUserProfileCompletionData = async () => {
        try {

            const res = await axios.get(`vendor/profile/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 200) {
                const data = res?.data;
                if (!data) {
                    console.error("❌ No profile data found in response:", res);
                    return;
                }

                const parts = {
                    profile: data.profileParts.p_profile || {},
                    categories: data.profileParts.p_categories || [],
                    providers: data.profileParts.p_providers || [],
                    objectives: data.profileParts.p_objectives || [],
                    payment: data.profileParts.p_paymentaccounts || {}
                };

                setVendorProfileData(parts);

                const stepsCompletion = [
                    isProfileComplete(parts.profile),
                    isCategoriesComplete(parts.categories),
                    isProvidersComplete(parts.providers),
                    isObjectivesComplete(parts.objectives),
                    isPaymentComplete(parts.payment)
                ];

                setCompletedSteps(stepsCompletion);

                const firstIncomplete = stepsCompletion.findIndex(done => !done);
                if (firstIncomplete !== -1) {
                    setCurrentStep(firstIncomplete);
                } else {
                    setIsCompleted(true);
                    setCurrentStep(steps.length); // ✅ Add this line
                }

            }
        } catch (error) {
            console.error("❌ Error fetching profile data:", error);
        }
    };

    useEffect(() => {
        getUserProfileCompletionData();
    }, []);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem("completedSteps", JSON.stringify(completedSteps));
        }
    }, [completedSteps, isHydrated]);

    useEffect(() => {
        if (isHydrated && typeof currentStep === "number") {
            localStorage.setItem("currentStep", currentStep.toString());
        }
    }, [currentStep, isHydrated]);

    return (
        <>
            {/* Header */}
            <div className="profile-header bg-white">
                <ProfileHeader />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden p-4 flex justify-start">
                <RiMenu2Line
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                />
            </div>

            {/* Mobile Sidebar */}
            <div
                className={`md:hidden fixed top-[55px] left-0 h-full w-90 bg-white z-30 transition-transform duration-300 ease-in-out shadow-lg ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Profile Steps</h2>
                        <button onClick={() => setIsMobileSidebarOpen(false)}>✕</button>
                    </div>
                    <Steps
                        direction="vertical"
                        current={typeof currentStep === "number" ? currentStep : steps.length}
                        items={steps.map((s) => ({ title: s.title }))}
                        onChange={(step) => {
                            if (completedSteps[step] || step <= currentStep) {
                                setCurrentStep(step);
                                setIsMobileSidebarOpen(false);
                            }
                        }}
                    />
                </div>
            </div>

            {/* Layout */}
            <div className="flex flex-col sm:flex-row bg-[#f5f5f5] min-h-screen p-4 gap-4">
                {/* Desktop Sidebar */}
                <div className="hidden md:block w-full md:w-1/3 lg:w-1/4 p-3">
                    <div className="bg-white p-6 rounded-3xl sticky top-[30px]">
                        <h2 className="text-xl font-semibold mb-4">Profile Completion Steps</h2>
                        <Steps
                            current={typeof currentStep === "number" ? currentStep : steps.length}
                            direction="vertical"
                            items={steps.map((s, index) => ({
                                title: s.title,
                                status: completedSteps[index]
                                    ? "finish"
                                    : index === currentStep
                                        ? "process"
                                        : "wait",
                            }))}
                            onChange={(step) => {
                                if (completedSteps[step] || step <= currentStep) {
                                    setCurrentStep(step);
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Step Content */}
                <div className="w-full md:w-2/3 lg:w-3/4 p-3">
                    {isCompleted && currentStep === steps.length ? (
                        <ThankYouScreen />
                    ) : (
                        steps[currentStep]?.component
                    )}

                </div>
            </div>
        </>
    );
};

