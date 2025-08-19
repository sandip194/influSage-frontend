// /src/pages/CreateCampaign.jsx
import React, { useState, useEffect } from 'react';
import CampaignExpectationSelector from "../../../components/users/vendorCampaign/CampaignExpectationSelector"
import CampaignStep2 from '../../../components/users/vendorCampaign/CampaignStep2';
import CampaignStep3 from '../../../components/users/vendorCampaign/CampaignStep3';
import CampaignStep4 from '../../../components/users/vendorCampaign/CampaignStep4';
import CampaignStep5 from '../../../components/users/vendorCampaign/CampaignStep5';
// import more steps as needed

const steps = [
    { id: 1, component: CampaignExpectationSelector },
    { id: 2, component: CampaignStep2 },
    { id: 3, component: CampaignStep3 },
    { id: 4, component: CampaignStep4 },
    { id: 5, component: CampaignStep5 }
    // Add Step3, Step4, etc...
];

const LOCAL_KEY = 'campaign-progress';

const CampaignWizard = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [campaignData, setCampaignData] = useState({});

    // Load saved progress from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_KEY);
        if (stored) {
            const { step, data } = JSON.parse(stored);
            setCurrentStep(step);
            setCampaignData(data);
        }
    }, []);

    // Save progress to localStorage
    const saveProgress = (step, data) => {
        localStorage.setItem(
            LOCAL_KEY,
            JSON.stringify({ step, data })
        );
    };

    // Update campaign data and go to next step
    const handleNext = (newData) => {
        const updatedData = { ...campaignData, ...newData };
        const nextStep = currentStep + 1;
        setCampaignData(updatedData);
        setCurrentStep(nextStep);
        saveProgress(nextStep, updatedData);
    };

    const handleBack = () => {
        const prevStep = Math.max(currentStep - 1, 0);
        setCurrentStep(prevStep);
        saveProgress(prevStep, campaignData);
    };

    const CurrentStepComponent = steps[currentStep]?.component;

    if (!CurrentStepComponent) {
        return <div>🎉 Campaign Completed!</div>;
    }

    return (
        <div className="p-0">
            <CurrentStepComponent
                data={campaignData}
                onNext={handleNext}
                onBack={handleBack}
            />
        </div>
    );
};

export default CampaignWizard;
