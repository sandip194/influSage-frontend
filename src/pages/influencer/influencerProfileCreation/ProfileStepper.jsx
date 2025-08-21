import React, { useState, useEffect } from 'react';
import { Steps } from 'antd';
import { RiMenu2Line } from 'react-icons/ri';


import { PersonalDetails } from '../../../components/users/complateProfile/PersonalDetails';
import { ProfileHeader } from '../../../components/users/complateProfile/ProfileHeader';
import { SocialMediaDetails } from '../../../components/users/complateProfile/SocialMediaDetails';
import { CategorySelector } from '../../../components/users/vendorProfile/CategorySelector';
import PortfolioUploader from '../../../components/users/complateProfile/PortfolioUploader.JSX';
import PaymentDetailsForm from '../../../components/users/complateProfile/PaymentDetailsForm';
import ThankYouScreen from '../../../components/users/complateProfile/ThankYouScreen';
import "../../../components/users/complateProfile/profile.css"
import axios from 'axios';

export const ProfileStepper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([false, false, false, false, false]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const markStepComplete = (index) => {
    const updated = [...completedSteps];
    if (!updated[index]) {
      updated[index] = true;
      setCompletedSteps(updated);
    }
    if (index + 1 < steps.length) {
      setCurrentStep(index + 1);
    } else {
      // All steps completed – navigate to thank you screen
      setCurrentStep("thankyou");
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('completedSteps');
    if (stored) setCompletedSteps(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('completedSteps', JSON.stringify(completedSteps));
  }, [completedSteps]);

  const steps = [
    {
      title: 'Personal Information',
      component: <PersonalDetails data={profileData?.profile} onNext={() => markStepComplete(0)} />,
    },
    {
      title: 'Social Media Links',
      component: <SocialMediaDetails data={profileData?.social} onNext={() => markStepComplete(1)} onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))} />,
    },
    {
      title: 'Categories and Interests',
      component: <CategorySelector onNext={() => markStepComplete(2)} onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))} />
    },
    {
      title: 'Portfolio and Work Samples',
      component: <PortfolioUploader onNext={() => markStepComplete(3)} onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))} />
    },
    {
      title: 'Payment Information',
      component: <PaymentDetailsForm onNext={() => markStepComplete(4)} onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))} />
    },
  ];


  const getUserProfileCompationData = async () => {
  try {
    const token = localStorage.getItem("token")
    const id = localStorage.getItem('userId')
    const res = await axios.get(`user/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (res.status === 200) {
      const parts = res.data.profileParts;
      setProfileData(parts);

      // Step completion logic
      const stepsCompletion = [
        !!parts.profile && Object.keys(parts.profile).length > 0,       // Step 0
        Array.isArray(parts.social) && parts.social.length > 0,         // Step 1
        Array.isArray(parts.categories) && parts.categories.length > 0, // Step 2
        !!parts.portfolio && Object.keys(parts.portfolio).length > 0,   // Step 3
        !!parts.payment && Object.keys(parts.payment).length > 0        // Step 4
      ];

      setCompletedSteps(stepsCompletion);

      console.log(profileData)

      // Go to first incomplete step
      const firstIncomplete = stepsCompletion.findIndex(done => !done);
      setCurrentStep(firstIncomplete !== -1 ? firstIncomplete : "thankyou");
    }
  } catch (error) {
    console.log(error);
  }
};


  useEffect(()=>{
    getUserProfileCompationData();
  },[])

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
        className={`sm:hidden fixed top-[55px] left-0 h-full w-90 bg-white z-30 transition-transform duration-300 ease-in-out shadow-lg ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
              items={steps.map((s, index) => ({
                title: s.title,
                status:
                  completedSteps[index]
                    ? 'finish'
                    : index === currentStep
                      ? 'process'
                      : 'wait',
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
        <div className="w-full sm:w-2/3 lg:w-3/4 p-3">
          {currentStep === 'thankyou' ? <ThankYouScreen /> : steps[currentStep].component}
        </div>
      </div>
    </>
  );
};
