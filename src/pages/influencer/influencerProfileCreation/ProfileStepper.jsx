import React, { useState, useEffect } from 'react';
import { Steps } from 'antd';
import { RiMenu2Line } from 'react-icons/ri';


import { PersonalDetails } from '../../../components/users/complateProfile/PersonalDetails';
import { ProfileHeader } from '../../../components/users/complateProfile/ProfileHeader';
import { SocialMediaDetails } from '../../../components/users/complateProfile/SocialMediaDetails';
import { CategorySelector } from '../../../components/users/vendorProfile/CategorySelector';
import PortfolioUploader from '../../../components/users/complateProfile/PortfolioUploader';
import PaymentDetailsForm from '../../../components/users/complateProfile/PaymentDetailsForm';
import ThankYouScreen from '../../../components/users/complateProfile/ThankYouScreen';
import '../../../components/users/complateProfile/profile.css'
import axios from 'axios';

import { useSelector } from 'react-redux';

export const ProfileStepper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([false, false, false, false, false]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [lastCompletedStep, setLastCompletedStep] = useState(null);


  const { token, userId } = useSelector(state => state.auth);

  const [profileData, setProfileData] = useState({
    profile: {},
    social: [],
    categories: [],
    portfolio: {},
    payment: {}
  });


  const updateProfileSection = (sectionKey, newData) => {
    setProfileData(prev => ({
      ...prev,
      [sectionKey]: newData
    }));
  };

  const isProfileComplete = (profile) => {
    // Check if any important profile field is filled
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

  const isSocialComplete = (social) => {
    // Social should be a non-empty array
    return Array.isArray(social) && social.length > 0;
  };

  const isCategoriesComplete = (categories) => {
    // Categories should be a non-empty array
    return Array.isArray(categories) && categories.length > 0;
  };
  const isPortfolioComplete = (portfolio) => {
    if (!portfolio || typeof portfolio !== 'object') return false;

    const hasValidUrl = typeof portfolio.portfoliourl === 'string' && portfolio.portfoliourl.trim() !== '';

    const hasValidFilepath = Array.isArray(portfolio.filepaths) &&
      portfolio.filepaths.some(file => typeof file.filepath === 'string' && file.filepath.trim() !== '');

    return hasValidUrl || hasValidFilepath;
  };


  const isPaymentComplete = (payment) => {
    if (!payment || Object.keys(payment).length === 0) return false;

    // Important payment fields to check:
    const fieldsToCheck = [
      'bankcountry',
      'bankname',
      'accountholdername',
      'accountnumber',
      'bankcode',
      'branchaddress',
      'contactnumber',
      'email',
      'preferredcurrency',
      'taxidentificationnumber',
    ];

    const hasValidField = fieldsToCheck.some(field => {
      const val = payment[field];
      return val !== null && val !== undefined && val !== '';
    });

    // Additionally check paymentmethod array for at least one valid method with details
    const hasValidPaymentMethod = Array.isArray(payment.paymentmethod) && payment.paymentmethod.some(pm => {
      return pm.method && pm.method !== null && pm.paymentdetails && pm.paymentdetails !== null;
    });

    return hasValidField || hasValidPaymentMethod;
  };

  const markStepComplete = (index) => {
    const updated = [...completedSteps];
    if (!updated[index]) {
      updated[index] = true;
      setCompletedSteps(updated);
      localStorage.setItem('completedSteps', JSON.stringify(updated));
      setLastCompletedStep(index);  // <-- trigger useEffect to refetch
    }

    if (index + 1 < steps.length) {
      setCurrentStep(index + 1);
    } else {
      setCurrentStep("thankyou");
    }
  };


  useEffect(() => {
    const stored = localStorage.getItem('completedSteps');
    if (stored) {
      const parsed = JSON.parse(stored);
      setCompletedSteps(parsed);

      // Optionally, set lastCompletedStep to last completed index so data refetches once
      const lastIndex = parsed.lastIndexOf(true);
      if (lastIndex !== -1) setLastCompletedStep(lastIndex);
    }
  }, []);


  const steps = [
    {
      title: 'Personal Information',
      component: (
        <PersonalDetails
          data={profileData.profile}
          onChange={(updated) => updateProfileSection('profile', updated)}
          onNext={() => markStepComplete(0)}
        />
      )
    },
    {
      title: 'Social Media Links',
      component: (
        <SocialMediaDetails
          data={profileData.social}
          onChange={(updated) => updateProfileSection('social', updated)}
          onNext={() => markStepComplete(1)}
          onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
        />
      )
    },
    {
      title: 'Categories and Interests',
      component: (
        <CategorySelector
          data={profileData.categories} // ✅ pass preloaded categories
          onNext={() => markStepComplete(2)}
          onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
          onChange={(updated) => updateProfileSection('categories', updated)} // Optional, if you want to sync updated categories
        />
      )
    }
    ,
    {
      title: 'Portfolio and Work Samples',
      component: (
        <PortfolioUploader
          data={profileData.portfolio} // ✅ prefill here
          onNext={(updated) => {
            updateProfileSection('portfolio', updated); // save back
            markStepComplete(3);
          }}
          onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
        />
      )
    }
    ,
    {
      title: 'Payment Information',
      component: (
        <PaymentDetailsForm
          data={profileData.payment}
          onChange={(updated) => updateProfileSection('payment', updated)}
          onNext={() => markStepComplete(4)}
          onBack={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
        />
      )
    }

  ];


  const getUserProfileCompationData = async () => {
    try {

      const res = await axios.get(`user/profile/${userId}`, {
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

        let parts = {
          profile: data.profileParts.p_profile || {},
          social: data.profileParts.p_socials || [],
          categories: data.profileParts.p_categories || [],
          portfolio: data.profileParts.p_portfolios || {},
          payment: data.profileParts.p_paymentaccounts || null,
        };

        setProfileData(parts)

        // Check source and profile for your special case
        if (data.source === "db" && isProfileComplete(parts.profile)) {
          // Mark all steps complete and show thank you
          setCompletedSteps([true, true, true, true, true]);
          setCurrentStep("thankyou");
        } else {
          // Normal step completion logic
          const stepsCompletion = [
            isProfileComplete(parts.profile),
            isSocialComplete(parts.social),
            isCategoriesComplete(parts.categories),
            isPortfolioComplete(parts.portfolio),
            isPaymentComplete(parts.payment),
          ];

          setCompletedSteps(stepsCompletion);

          // Navigate to first incomplete step
          const firstIncomplete = stepsCompletion.findIndex(done => !done);
          setCurrentStep(firstIncomplete !== -1 ? firstIncomplete : "thankyou");
        }
      }
      } catch (error) {
        console.error("❌ Error fetching profile data:", error);
      }
    };

    useEffect(() => {
      getUserProfileCompationData();
    }, [lastCompletedStep]);



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
