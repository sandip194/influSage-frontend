import React, { useState } from 'react';
import { Steps } from 'antd';
import { PersonalDetails } from './PersonalDetails';
import { ProfileHeader } from './ProfileHeader';
import { RiMenu2Line } from 'react-icons/ri';
import './profile.css';
import { SocialMediaDetails } from './SocialMediaDetails';
import { CategorySelector } from './CategorySelector';
import PortfolioUploader from './PortfolioUploader.JSX';
import PaymentDetailsForm from './PaymentDetailsForm';

export const ProfileStepper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([false, false, false, false, false]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const markStepComplete = (index) => {
    const updated = [...completedSteps];
    if (!updated[index]) {
      updated[index] = true;
      setCompletedSteps(updated);
    }
    if (index + 1 < steps.length) {
      setCurrentStep(index + 1);
    }
  };

  const steps = [
    {
      title: 'Personal Information',
      component: <PersonalDetails onNext={() => markStepComplete(0)} />,
    },
    {
      title: 'Social Media Links',
      component: <SocialMediaDetails onNext={() => markStepComplete(1)} />,
    },
    {
      title: 'Categories and Interests',
      component: <CategorySelector onNext={() => markStepComplete(2)}/>
    },
    {
      title: 'Portfolio and Work Samples',
      component: <PortfolioUploader onNext={() => markStepComplete(3)}/>
    },
    {
      title: 'Payment Information',
      component: <PaymentDetailsForm onNext={() => markStepComplete(4)}/>
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="profile-header sticky top-0 z-20 bg-whit">
        <ProfileHeader />
      </div>

      {/* Mobile Menu Button */}
      <div className="sm:hidden p-4 flex justify-start">
        <RiMenu2Line
          className="w-6 h-6 cursor-pointer"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
      </div>

      {/* Mobile Sidebar - pure, no overlay */}
      <div
        className={`sm:hidden fixed top-[55px] left-0 h-full w-90 bg-white z-30 transition-transform duration-300 ease-in-out shadow-lg ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Profile Steps</h2>
            <button onClick={() => setIsMobileSidebarOpen(false)}>✕</button>
          </div>
          <Steps
            direction="vertical"
            current={currentStep}
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
        <div className="hidden sm:block w-full md:w-1/3 lg:w-1/4 p-3">
          <div className="bg-white p-6 rounded-3xl sticky top-[60px]">
            <h2 className="text-xl font-semibold mb-4">Profile Completion Steps</h2>
            <Steps
              current={currentStep}
              direction="vertical"
              items={steps.map((s) => ({ title: s.title }))}
              onChange={(step) => {
                if (completedSteps[step] || step <= currentStep) {
                  setCurrentStep(step);
                }
              }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="w-full sm:w-2/3 lg:w-3/4 p-3">
          {steps[currentStep].component}
        </div>
      </div>
    </>
  );
};
