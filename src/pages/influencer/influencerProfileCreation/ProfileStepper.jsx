import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Steps } from 'antd';
import { RiMenu2Line } from 'react-icons/ri';

import { PersonalDetails } from '../../../components/users/complateProfile/PersonalDetails';
import { ProfileHeader } from '../../../components/users/complateProfile/ProfileHeader';
import { SocialMediaDetails } from '../../../components/users/complateProfile/SocialMediaDetails';
import { CategorySelector } from '../../../components/users/vendorProfile/CategorySelector';
import PortfolioUploader from '../../../components/users/complateProfile/PortfolioUploader';
import PaymentDetailsForm from '../../../components/users/complateProfile/PaymentDetailsForm';
import ThankYouScreen from '../../../components/users/complateProfile/ThankYouScreen';

import '../../../components/users/complateProfile/profile.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import ErrorBoundary from '../../../components/common/ErrorBoundary';
import { setCredentials } from '../../../features/auth/authSlice';

// Validation Functions
const isProfileComplete = (profile) => {
  if (!profile) return false;

  const fieldsToCheck = [
    'photopath',
    'genderid',
    'dob',
    'address1',
    'countryname',
    'statename',
    'bio',
  ];

  return fieldsToCheck.every(field => {
    const value = profile[field];
    if (typeof value === 'string') return value.trim().length > 0;
    return Boolean(value);
  });
};


const isSocialComplete = (social) => Array.isArray(social) && social.length > 0;
const isCategoriesComplete = (categories) => Array.isArray(categories) && categories.length > 0;

const isPortfolioComplete = (portfolio) => {
  if (!portfolio || typeof portfolio !== 'object') return false;
  const hasValidUrl = typeof portfolio.portfoliourl === 'string' && portfolio.portfoliourl.trim() !== '';
  const hasValidFilepath = Array.isArray(portfolio.filepaths) &&
    portfolio.filepaths.some(file => typeof file.filepath === 'string' && file.filepath.trim() !== '');
  return hasValidUrl || hasValidFilepath;
};

const isPaymentComplete = (payment) => {
  if (!payment) return false;

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

  const basicComplete = fieldsToCheck.every(field => {
    const value = payment[field];
    if (typeof value === 'string') return value.trim().length > 0;
    return Boolean(value);
  });

  const methodComplete =
    Array.isArray(payment.paymentmethod) &&
    payment.paymentmethod.length > 0;

  return basicComplete && methodComplete;
};


// Main Component
export const ProfileStepper = () => {

  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([false, false, false, false, false]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [lastCompletedStep, setLastCompletedStep] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);


  const { token, userId, p_code, role, name } = useSelector(state => state.auth);

  const [profileData, setProfileData] = useState({
    profile: {},
    social: [],
    categories: [],
    portfolio: {},
    payment: {}
  });

  const updateProfileSection = useCallback((sectionKey, newData) => {
    setProfileData(prev => ({
      ...prev,
      [sectionKey]: newData
    }));
  }, []);

  const markStepComplete = useCallback((index) => {
    setCompletedSteps(prev => {
      const updated = [...prev];
      if (!updated[index]) {
        updated[index] = true;
        localStorage.setItem('completedSteps', JSON.stringify(updated));
        setLastCompletedStep(index);
      }
      return updated;
    });
    setCurrentStep(index + 1 < steps?.length ? index + 1 :  steps.length);
  }, []);

  // Editable for PENDINGPROFILE or REJECTED
  const isEditable = ['PENDINGPROFILE', 'REJECTED'].includes(p_code);

  const steps = useMemo(() => [
    {
      title: 'Personal Information',
      component: (
        <PersonalDetails
          data={profileData.profile}
          showControls={isEditable}
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
          showControls={isEditable}
          onChange={(updated) => updateProfileSection('social', updated)}
          onNext={() => markStepComplete(1)}
          onBack={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
        />
      )
    },
    {
      title: 'Categories and Interests',
      component: (
        <CategorySelector
          data={profileData.categories}
          showControls={isEditable}
          onChange={(updated) => updateProfileSection('categories', updated)}
          onNext={() => markStepComplete(2)}
          onBack={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
        />
      )
    },
    {
      title: 'Portfolio and Work Samples',
      component: (
        <PortfolioUploader
          data={profileData.portfolio}
          showControls={isEditable}
          onNext={(updated) => {
            updateProfileSection('portfolio', updated);
            markStepComplete(3);
          }}
          onBack={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
        />
      )
    },
    {
      title: 'Payment Information',
      component: (
        <PaymentDetailsForm
          data={profileData.payment}
          showControls={isEditable}
          onChange={(updated) => updateProfileSection('payment', updated)}
          onNext={() => markStepComplete(4)}
          onBack={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
        />
      )
    }
  ], [profileData, updateProfileSection, markStepComplete, isEditable]);

  const getUserProfileCompationData = useCallback(async () => {
    try {
      const res = await axios.get(`user/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (res.status !== 200) return;

      const data = res.data;
      if (!data) return;

      // -------------------------
      // Extract profile parts
      // -------------------------
      const parts = {
        profile: data.profileParts.p_profile || {},
        social: data.profileParts.p_socials || [],
        categories: data.profileParts.p_categories || [],
        portfolio: data.profileParts.p_portfolios || {},
        payment: data.profileParts.p_paymentaccounts || {}
      };

      // Always update UI data with latest server values
      setProfileData(parts);

      // -------------------------
      // Determine mappedStatus from API
      // -------------------------
      const apiStatus = data?.profileParts?.p_profile?.userstatusname;
      console.log(apiStatus)
      const mappedStatus = apiStatus ? apiStatus.toUpperCase() : null;
      console.log(mappedStatus)
      // -------------------------
      // Update Redux only if APPROVALPENDING
      // -------------------------
      if (mappedStatus === "APPROVAL PENDING") {
        console.log("dispatch")
        dispatch(
          setCredentials({
            token: token,
            id: userId,
            name: name,
            role: role,
            p_code: mappedStatus,
          })
        );
      }

      // -------------------------
      // Compute step completion for later use
      // -------------------------
      const stepsCompletion = [
        isProfileComplete(parts.profile),
        isSocialComplete(parts.social),
        isCategoriesComplete(parts.categories),
        isPortfolioComplete(parts.portfolio),
        isPaymentComplete(parts.payment),
      ];

      // -------------------------
      // Handle each status
      // -------------------------
     if (mappedStatus === "APPROVAL PENDING") {
        const allCompleted = [true, true, true, true, true];
        setCompletedSteps(allCompleted);
        setCurrentStep(steps.length); // Set to steps.length to indicate completion
        return;
      }


      // 🔵 REJECTED → user must start from step 0, but keep latest API data
      if (mappedStatus === "REJECTED") {
        if (isInitialLoad) {
          setCompletedSteps([false, false, false, false, false]);
          setCurrentStep(0);
          setIsInitialLoad(false);
        }
        return;
      }


      // null Or PENDINGPROFILE → resume from last incomplete step
      // if (!mappedStatus || mappedStatus === "PENDINGPROFILE") {
      //   setCompletedSteps(stepsCompletion);
      //   const firstIncomplete = stepsCompletion.findIndex(s => !s);
      //   setCurrentStep(firstIncomplete !== -1 ? firstIncomplete :  steps.length);
      //   return;
      // }

      // ⚪ NEW USER → everything empty
      const isNewUser =
        !isProfileComplete(parts.profile) &&
        !isSocialComplete(parts.social) &&
        !isCategoriesComplete(parts.categories) &&
        !isPortfolioComplete(parts.portfolio) &&
        !isPaymentComplete(parts.payment);

      if (isNewUser) {
        setCompletedSteps([false, false, false, false, false]);
        setCurrentStep(0);
        return;
      }

    } catch (error) {
      console.error("❌ Error fetching profile data:", error);
    }
  }, [token, userId, dispatch, name, role]);

  useEffect(() => {
    getUserProfileCompationData();
  }, [getUserProfileCompationData, lastCompletedStep]);

    const handleStepChange = (step) => {
    // For APPROVAL PENDING, do not allow navigation
    if (p_code === 'APPROVAL PENDING') return;

    // Allow navigation only to completed steps
    if (completedSteps[step]) {
      setCurrentStep(step);
    }
  };

  return (
    <>
      <div className="profile-header sticky top-0 z-20 bg-white">
        <ProfileHeader />
      </div>

      <div className="sm:hidden p-4 flex justify-start">
        <RiMenu2Line
          className="w-6 h-6 cursor-pointer"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
      </div>

      <div className={`sm:hidden fixed top-[55px] left-0 h-full w-90 bg-white z-30 transition-transform duration-300 ease-in-out shadow-lg ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Profile Steps</h2>
            <button onClick={() => setIsMobileSidebarOpen(false)}>✕</button>
          </div>
          <Steps
            direction="vertical"
            current={currentStep}
            items={steps.map((s) => ({ title: s.title }))}
            onChange={handleStepChange}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row bg-[#f5f5f5] min-h-screen p-4 gap-2">
        <div className="hidden sm:block w-full md:w-1/3 lg:w-1/4 p-0">
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
              onChange={handleStepChange}
            />
          </div>
        </div>

        <div className="w-full sm:w-2/3 lg:w-3/4 p-4 bg-white rounded-3xl">
          <ErrorBoundary>
            {currentStep >= steps.length ? (
              <ThankYouScreen />
            ) : (
              steps[currentStep]?.component || (
                <div className="p-6 bg-yellow-50 border border-yellow-300 rounded">
                  <p>⚠️ Invalid step index. Please try reloading the page.</p>
                </div>
              )
            )}
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
};