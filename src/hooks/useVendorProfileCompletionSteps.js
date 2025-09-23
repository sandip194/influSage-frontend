import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';


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

export const useVendorProfileCompletionSteps = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([false, false, false, false, false]);
    const [isHydrated, setIsHydrated] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [lastCompletedStep, setLastCompletedStep] = useState(null);

    const { token, userId } = useSelector(state => state.auth);


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

    const markStepComplete = (index) => {
        const updated = [...completedSteps];
        if (!updated[index]) {
            updated[index] = true;
            setCompletedSteps(updated);
            setLastCompletedStep(index);  // <-- trigger useEffect to refetch
        }

        if (index + 1 < steps.length) {
            setCurrentStep(index + 1);
        } else {
            // Mark profile as complete, but let currentStep go one beyond steps
            setIsCompleted(true);
            setCurrentStep(steps.length); // This triggers ThankYouScreen
        }
    };


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

                const source = data?.source;

                const parts = {
                    profile: data.profileParts.p_profile || {},
                    categories: data.profileParts.p_categories || [],
                    providers: data.profileParts.p_providers || [],
                    objectives: data.profileParts.p_objectives || [],
                    payment: data.profileParts.p_paymentaccounts || {}
                };

                setVendorProfileData(parts);

                // Evaluate completion
                const profileDone = isProfileComplete(parts.profile);
                const categoriesDone = isCategoriesComplete(parts.categories);
                const providersDone = isProvidersComplete(parts.providers);
                const objectivesDone = isObjectivesComplete(parts.objectives);
                const paymentDone = isPaymentComplete(parts.payment);

                // Build step completion array
                let stepsCompletion = [
                    profileDone,
                    categoriesDone,
                    providersDone,
                    objectivesDone,
                    paymentDone // This may stay false
                ];

                // ✅ Special logic if data comes from DB and all other steps are complete
                const nonPaymentStepsComplete = profileDone && categoriesDone && providersDone && objectivesDone;

                if (source === "db" && nonPaymentStepsComplete) {
                    // Leave payment as false, mark others as true
                    stepsCompletion = [true, true, true, true, true];
                    setCompletedSteps(stepsCompletion);
                    setIsCompleted(true);
                    setCurrentStep(steps.length); // Show thank you
                } else {
                    setCompletedSteps(stepsCompletion);

                    // Go to first incomplete step
                    const firstIncomplete = stepsCompletion.findIndex(done => !done);
                    setCurrentStep(firstIncomplete !== -1 ? firstIncomplete : steps.length);
                }
            }
        } catch (error) {
            console.error("❌ Error fetching profile data:", error);
        }
    };


    useEffect(() => {
        getUserProfileCompletionData();
    }, [lastCompletedStep]);


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


    return {
        vendorProfileData,
        updateProfileSection,
        completedSteps,
        currentStep,
        setCurrentStep,
        markStepComplete,
        isCompleted,
        getUserProfileCompletionData
    };
}