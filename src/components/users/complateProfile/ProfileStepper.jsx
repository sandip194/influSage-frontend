import React, { useState } from 'react';
import { Steps } from 'antd';
import { PersonalDetails } from './PersonalDetails';
import { ProfileHeader } from './ProfileHeader';

export const ProfileStepper = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { title: 'Personal Information', component: <PersonalDetails onNext={() => setCurrentStep(1)} /> },
        { title: 'Social Media Links', component: "Social Media Links" },
        { title: 'Categories and Interests', component: "Categories and Interests" },
        { title: 'Portfolio and Work Samples', component: "Portfolio and Work Samples" },
        { title: 'Payment Information', component: "Payment Information" },
    ];

    return (
        <>
            <div className="profile-header sticky top-0 z-10 ">
                <ProfileHeader />
            </div>

            <div className="block sm:flex flex-row justify-between bg-[#f5f5f5] h-auto p-5">
                <div className="w-4/4 md:w-2/4 lg:w-1/4 p-4">
                    <div className="profile-steps-container bg-white p-6 rounded-xl shadow-md text-inter">
                        <h2 className="text-xl font-semibold mb-4">Profile Completion Steps</h2>
                        <Steps current={currentStep} direction="vertical" items={steps.map(s => ({ title: s.title }))} />

                    </div>
                </div>
                <div className='w-4/4 md:w-2/4 lg:w-3/4 p-4'>
                    <div className="">{steps[currentStep].component}</div>
                </div>
            </div>
        </>

    );
};
