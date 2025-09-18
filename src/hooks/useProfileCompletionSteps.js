
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

// Validation Function ==> bcs we dont need to re create it for every render 
const isProfileComplete = (profile) => {
    if (!profile || Object.keys(profile).length === 0) return false;
    const fieldsToCheck = ['photopath', 'genderid', 'dob', 'address1', 'countryname', 'statename', 'bio'];
    return fieldsToCheck.some(field => profile[field]?.trim?.() || profile[field]);
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
    if (!payment || Object.keys(payment).length === 0) return false;
    const fieldsToCheck = ['bankcountry', 'bankname', 'accountholdername', 'accountnumber', 'bankcode', 'branchaddress', 'contactnumber', 'email', 'preferredcurrency', 'taxidentificationnumber'];
    const hasValidField = fieldsToCheck.some(field => payment[field]?.trim?.() || payment[field]);
    const hasValidPaymentMethod = Array.isArray(payment.paymentmethod) &&
        payment.paymentmethod.some(pm => pm.method && pm.paymentdetails);
    return hasValidField || hasValidPaymentMethod;
};


export const useProfileCompletionSteps = () => {
    const { token, userId } = useSelector(state => state.auth);

    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([false, false, false, false, false]);
    const [profileData, setProfileData] = useState({
        profile: {},
        social: [],
        categories: [],
        portfolio: {},
        payment: {}
    });

    const updateProfileSection = useCallback((sectionKey, newData) => {
        setProfileData(prev => ({ ...prev, [sectionKey]: newData }));
    }, []);

    const markStepComplete = useCallback((index) => {
        setCompletedSteps(prev => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
        });
    }, []);

    const getUserProfileCompletionData = useCallback(async () => {
        try {
            const res = await axios.get(`user/profile/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = res?.data?.profileParts || {};
            const parts = {
                profile: data.p_profile || {},
                social: data.p_socials || [],
                categories: data.p_categories || [],
                portfolio: data.p_portfolios || {},
                payment: data.p_paymentaccounts || {}
            };

            setProfileData(parts);

            const stepsCompletion = [
                isProfileComplete(parts.profile),
                isSocialComplete(parts.social),
                isCategoriesComplete(parts.categories),
                isPortfolioComplete(parts.portfolio),
                isPaymentComplete(parts.payment),
            ];

            setCompletedSteps(stepsCompletion);
        } catch (err) {
            console.error("Error loading profile:", err);
        }
    }, [token, userId]);

    useEffect(() => {
        getUserProfileCompletionData();
    }, [getUserProfileCompletionData]);

    return {
        profileData,
        updateProfileSection,
        completedSteps,
        currentStep,
        setCurrentStep,
        markStepComplete
    };
};
