import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const TOTAL_STEPS = 5;

/* =======================
   Validation logic (UNCHANGED)
======================= */

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
        payment.paymentmethod.some(pm => pm.method && pm.paymentdetails);

    return hasValidField || hasValidPaymentMethod;
};

/* =======================
   Hook
======================= */

export const useVendorProfileCompletionSteps = () => {
    const { token, userId } = useSelector(state => state.auth);

    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState(
        Array(TOTAL_STEPS).fill(false)
    );
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(true);

    const [vendorProfileData, setVendorProfileData] = useState({
        profile: {},
        categories: [],
        providers: [],
        objectives: [],
        payment: {}
    });

    const updateProfileSection = useCallback((sectionKey, newData) => {
        setVendorProfileData(prev => ({
            ...prev,
            [sectionKey]: newData
        }));
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
            setLoading(true);

            const res = await axios.get(`vendor/profile/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = res?.data;
            if (!data) return;

            const source = data.source;

            const parts = {
                profile: data.profileParts?.p_profile || {},
                categories: data.profileParts?.p_categories || [],
                providers: data.profileParts?.p_providers || [],
                objectives: data.profileParts?.p_objectives || [],
                payment: data.profileParts?.p_paymentaccounts || {}
            };

            setVendorProfileData(parts);

            const profileDone = isProfileComplete(parts.profile);
            const categoriesDone = isCategoriesComplete(parts.categories);
            const providersDone = isProvidersComplete(parts.providers);
            const objectivesDone = isObjectivesComplete(parts.objectives);
            const paymentDone = isPaymentComplete(parts.payment);

            let stepsCompletion = [
                profileDone,
                categoriesDone,
                providersDone,
                objectivesDone,
                paymentDone
            ];

            const nonPaymentStepsComplete =
                profileDone && categoriesDone && providersDone && objectivesDone;

            if (source === "db" && nonPaymentStepsComplete) {
                stepsCompletion = Array(TOTAL_STEPS).fill(true);
                setIsCompleted(true);
            }

            setCompletedSteps(stepsCompletion);

            const firstIncomplete = stepsCompletion.findIndex(done => !done);
            setCurrentStep(
                firstIncomplete !== -1 ? firstIncomplete : 0
            );
        } catch (error) {
            console.error("❌ Error fetching profile data:", error);
        } finally {
            setLoading(false);
        }
    }, [token, userId]);

    /* 🔑 Fetch ONCE (same as working hook) */
    useEffect(() => {
        getUserProfileCompletionData();
    }, [getUserProfileCompletionData]);

    return {
        vendorProfileData,
        updateProfileSection,
        completedSteps,
        currentStep,
        setCurrentStep,
        markStepComplete,
        isCompleted,
        getUserProfileCompletionData,
        loading
    };
};
