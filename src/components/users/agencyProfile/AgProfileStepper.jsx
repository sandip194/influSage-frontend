import React, { useState, useEffect } from 'react';
import { Steps } from 'antd';
import { ProfileHeader } from '../complateProfile/ProfileHeader';
import { RiMenu2Line } from 'react-icons/ri';
import PaymentDetailsForm from '../complateProfile/PaymentDetailsForm';
import ThankYouScreen from '../complateProfile/ThankYouScreen';
import { BusinessDetails } from './BusinessDetails';
import { CategorySelector } from './CategorySelector';
import PlatformSelector from './PlatformSelector';
import ObjectiveSelector from './ObjectiveSelector';

export const AgProfileStepper = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([false, false, false, false, false]);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const storedSteps = localStorage.getItem("completedSteps");
        const storedStep = localStorage.getItem("currentStep");

        if (storedSteps) {
            const parsedSteps = JSON.parse(storedSteps);
            if (Array.isArray(parsedSteps)) {
                setCompletedSteps(parsedSteps);

                // Check if all steps are complete
                const allDone = parsedSteps.every((val) => val === true);
                if (allDone) {
                    setCurrentStep("thankyou");
                } else if (storedStep !== null) {
                    const parsedStep = parseInt(storedStep);
                    if (!isNaN(parsedStep)) setCurrentStep(parsedStep);
                }
            }
        }

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


    const markStepComplete = (index) => {
        const updated = [...completedSteps];
        if (!updated[index]) {
            updated[index] = true;
            setCompletedSteps(updated);
        }

        // Move to next step or show thankyou
        if (index + 1 < steps.length) {
            setCurrentStep(index + 1);
        } else {
            setCurrentStep("thankyou");
        }
    };

    const steps = [
        {
            title: "Business Information",
            component: <BusinessDetails onNext={() => markStepComplete(0)} />,
        },
        {
            title: "Categories",
            component: (
                <CategorySelector
                    onNext={() => markStepComplete(1)}
                    onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                />
            ),
        },
        {
            title: "Platform And Influencer",
            component: (
                <PlatformSelector
                    onNext={() => markStepComplete(2)}
                    onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                />
            ),
        },
        {
            title: "Objectives",
            component: (
                <ObjectiveSelector
                    onNext={() => markStepComplete(3)}
                    onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                />
            ),
        },
        {
            title: "Payment Information",
            component: (
                <PaymentDetailsForm
                    onNext={() => markStepComplete(4)}
                    onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                />
            ),
        },
    ];

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
                    {currentStep === "thankyou" ? (
                        <ThankYouScreen />
                    ) : (
                        steps[currentStep].component
                    )}
                </div>
            </div>
        </>
    );
};

