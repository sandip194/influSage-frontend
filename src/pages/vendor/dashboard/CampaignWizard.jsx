import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

// Step components
import CampaignExpectationSelector from "../../../components/users/vendorCampaign/CampaignExpectationSelector";
import CampaignStep2 from "../../../components/users/vendorCampaign/CampaignStep2";
import CampaignStep3 from "../../../components/users/vendorCampaign/CampaignStep3";
import CampaignStep4 from "../../../components/users/vendorCampaign/CampaignStep4";
import CampaignStep5 from "../../../components/users/vendorCampaign/CampaignStep5";
import CampaignReviewStep from "../../../components/users/vendorCampaign/CampaignReviewStep";

const CampaignWizard = () => {
  const { token } = useSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([false, false, false, false, false]);
  const [lastCompletedStep, setLastCompletedStep] = useState(null);

  const [campaignData, setCampaignData] = useState({
    expectation: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
    profileParts: null,
  });

  // Update state when a section is changed
  const updateCampaignSection = (sectionKey, newData) => {
    setCampaignData((prev) => ({
      ...prev,
      [sectionKey]: newData,
    }));
  };

  const markStepComplete = (index) => {
    const updated = [...completedSteps];
    if (!updated[index]) {
      updated[index] = true;
      setCompletedSteps(updated);
      setLastCompletedStep(index); 
    }

    const nextStep = index + 1 < steps.length ? index + 1 : "review";
    setCurrentStep(nextStep);
  };

  const getCampaignData = async () => {
    try {
      const res = await axios.get(`/vendor/campaign/01`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        const parts = res.data?.campaignParts || null;
        if (parts) {
          setCampaignData({
            expectation: parts.p_objectivejson || {},
            step2: parts.p_vendorinfojson || {},
            step3: parts.p_campaignjson || {},
            step4: parts.p_campaignfilejson || {},
            step5: parts.p_contenttypejson || {},
            profileParts: parts || null,
          });

          // Auto-complete steps based on data
          const newCompletion = [
            !!parts.p_objectivejson,
            !!parts.p_vendorinfojson,
            !!parts.p_campaignjson,
            !!parts.p_campaignfilejson,
            !!parts.p_contenttypejson,
          ];
          setCompletedSteps(newCompletion);

          const firstIncomplete = newCompletion.findIndex((v) => !v);
          setCurrentStep(firstIncomplete !== -1 ? firstIncomplete : "review");
        }
      }
    } catch (err) {
      console.error("❌ Error fetching campaign:", err);
      toast.error("Failed to fetch campaign data.");
    }
  };

  // Refetch on token or step completion
  useEffect(() => {
    if (token) getCampaignData();
  }, [token, lastCompletedStep]);

  const steps = [
    {
      title: "Expectation",
      component: (
        <CampaignExpectationSelector
          data={campaignData.expectation}
          onChange={(updated) => updateCampaignSection("expectation", updated)}
          onNext={() => markStepComplete(0)}
        />
      ),
    },
    {
      title: "Step 2",
      component: (
        <CampaignStep2
          data={campaignData.step2}
          onChange={(updated) => updateCampaignSection("step2", updated)}
          onNext={() => markStepComplete(1)}
          onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
        />
      ),
    },
    {
      title: "Step 3",
      component: (
        <CampaignStep3
          data={campaignData.step3}
          onChange={(updated) => updateCampaignSection("step3", updated)}
          onNext={() => markStepComplete(2)}
          onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
        />
      ),
    },
    {
      title: "Step 4",
      component: (
        <CampaignStep4
          data={campaignData.step4}
          onChange={(updated) => updateCampaignSection("step4", updated)}
          onNext={() => markStepComplete(3)}
          onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
        />
      ),
    },
    {
      title: "Step 5",
      component: (
        <CampaignStep5
          data={campaignData.step5}
          onChange={(updated) => updateCampaignSection("step5", updated)}
          onNext={() => markStepComplete(4)}
          onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white shadow rounded-lg p-6">
        {currentStep === "review" ? (
          <CampaignReviewStep
            campaignData={campaignData}
            onEdit={() => setCurrentStep(0)}
          />
        ) : (
          steps[currentStep]?.component
        )}
      </div>
    </div>
  );
};

export default CampaignWizard;
