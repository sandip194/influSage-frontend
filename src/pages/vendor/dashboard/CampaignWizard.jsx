// /src/pages/CreateCampaign.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

// Step components
import CampaignExpectationSelector from "../../../components/users/vendorCampaign/CampaignExpectationSelector";
import CampaignStep2 from "../../../components/users/vendorCampaign/CampaignStep2";
import CampaignStep3 from "../../../components/users/vendorCampaign/CampaignStep3";
import CampaignStep4 from "../../../components/users/vendorCampaign/CampaignStep4";
import CampaignStep5 from "../../../components/users/vendorCampaign/CampaignStep5";
import CampaignReviewStep from "../../../components/users/vendorCampaign/CampaignReviewStep";

const LOCAL_KEY = "campaign-progress";

const CampaignWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(
    [false, false, false, false, false, false]
  );

  const { token } = useSelector((state) => state.auth);

  const [campaignData, setCampaignData] = useState({
    expectation: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
  });

  // ✅ Update campaign data for a section
  const updateCampaignSection = (sectionKey, newData) => {
    setCampaignData((prev) => ({
      ...prev,
      [sectionKey]: newData,
    }));
    localStorage.setItem(
      LOCAL_KEY,
      JSON.stringify({
        step: currentStep,
        data: { ...campaignData, [sectionKey]: newData },
      })
    );
  };

  // ✅ Step complete + go next
  const markStepComplete = (index) => {
    const updated = [...completedSteps];
    if (!updated[index]) {
      updated[index] = true;
      setCompletedSteps(updated);
    }
    if (index + 1 < steps.length) {
      setCurrentStep(index + 1);
    } else {
      setCurrentStep("review");
    }
  };

  // ✅ Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      const { step, data } = JSON.parse(stored);
      setCurrentStep(step);
      setCampaignData(data);
    }
  }, []);

  // ✅ Fetch API data
  const getCampaignData = async () => {
    try {
      const res = await axios.get(`/vendor/campaign/01`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        const parts = res.data?.campaignParts || {};
        setCampaignData((prev) => ({
          ...prev,
          ...parts,
        }));
      }
    } catch (err) {
      console.error("❌ Error fetching campaign:", err);
    }
  };

  useEffect(() => {
    getCampaignData();
  }, []);

  // ✅ Define steps
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
    {
      title: "Review",
      component: (
        <CampaignReviewStep
          data={campaignData}
          onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="flex-1 bg-white shadow-md rounded-lg p-6">
        {currentStep === "review"
          ? <CampaignReviewStep data={campaignData} />
          : steps[currentStep].component}
      </div>
    </div>
  );
};

export default CampaignWizard;
