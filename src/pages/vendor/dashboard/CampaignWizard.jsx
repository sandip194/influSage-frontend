import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

// Step components
import CampaignExpectationSelector from "../../../components/users/vendorCampaign/CampaignExpectationSelector";
import CampaignStep2 from "../../../components/users/vendorCampaign/CampaignStep2";
import CampaignStep3 from "../../../components/users/vendorCampaign/CampaignStep3";
import CampaignStep4 from "../../../components/users/vendorCampaign/CampaignStep4";
import CampaignStep5 from "../../../components/users/vendorCampaign/CampaignStep5";
import CampaignReviewStep from "../../../components/users/vendorCampaign/CampaignReviewStep";
import CampaignCategorySection from "../../../components/users/vendorCampaign/CampaignCategorySection";

const CampaignWizard = () => {
  const { token } = useSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([false, false, false, false, false, false]);
  const [lastCompletedStep, setLastCompletedStep] = useState(null);

  const [campaignData, setCampaignData] = useState({
    expectation: {},
    step2: {},
    step3: {},
    categories: [],
    step4: [],
    step5: {},
    profileParts: null,
  });



  // Update a section of the campaign data
  const updateCampaignSection = (sectionKey, newData) => {
    setCampaignData((prev) => ({
      ...prev,
      [sectionKey]: newData,
    }));
  };

  // Mark a step complete and move to the next
  const markStepComplete = async (index) => {
    const updated = [...completedSteps];
    if (!updated[index]) {
      updated[index] = true;
      setCompletedSteps(updated);
      localStorage.setItem("completedSteps", JSON.stringify(updated));
      setLastCompletedStep(index);
    }

    // Fetch updated campaign data immediately
    await getCampaignData();

    if (index + 1 < steps.length) {
      setCurrentStep(index + 1);
    } else {
      setCurrentStep("review");
    }
  };

  // Fetch campaign data
  const getCampaignData = async () => {
    try {
      const res = await axios.get("/vendor/campaign/01", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const parts = res.data?.campaignParts;
      if (res.status === 200 && parts) {
        setCampaignData({
          expectation: parts.p_objectivejson || {},
          step2: parts.p_vendorinfojson || {},
          step3: parts.p_campaignjson || {},
          categories: parts.p_campaigncategoyjson  || [],
          step4: parts.p_campaignfilejson || [],
          step5: parts.p_contenttypejson || {},
          profileParts: parts,
        });

        // Determine which steps are completed
        const newCompletion = [
          !!parts.p_objectivejson,
          !!parts.p_vendorinfojson,
          !!parts.p_campaignjson,
          !!parts.p_campaigncategoyjson ,
          !!(parts.p_campaignfilejson && parts.p_campaignfilejson.length > 0),
          !!(parts.p_contenttypejson && Object.keys(parts.p_contenttypejson).length > 0), 
        ];

        setCompletedSteps(newCompletion);
        localStorage.setItem("completedSteps", JSON.stringify(newCompletion));

    // Find the first incomplete step
    const firstIncomplete = newCompletion.findIndex((done) => !done);
    if (firstIncomplete !== -1) {
      setCurrentStep(firstIncomplete);
    } else {
      setCurrentStep("review"); 
    }
          }
    } catch (err) {
      console.error("❌ Error fetching campaign:", err);
      toast.error("Failed to fetch campaign data.");
    }
  };

  useEffect(() => {
    if (lastCompletedStep !== null) {
      getCampaignData();
    }
  }, [lastCompletedStep]);


useEffect(() => {
  const stored = localStorage.getItem("completedSteps");
  if (stored) {
    const parsed = JSON.parse(stored);
    setCompletedSteps(parsed);

    const lastIndex = parsed.lastIndexOf(true);
    if (lastIndex !== -1) {
      setLastCompletedStep(lastIndex);
    }

    // Go to first incomplete step
    const firstIncomplete = parsed.findIndex((done) => !done);
    if (firstIncomplete !== -1) {
      setCurrentStep(firstIncomplete);
    } else {
      setCurrentStep("review");
    }
  }
}, []);


  // Define steps early so functions below can access it
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
      title: "Categories", // 👈 NEW STEP
      component: (
        <CampaignCategorySection
          data={campaignData.categories || []} // 👈 you may need to adjust this based on saved data
          onNext={() => markStepComplete(3)}
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
          onNext={() => markStepComplete(4)}
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
          onNext={() => markStepComplete(5)}
          onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {currentStep === "review" ? (
        <CampaignReviewStep
          campaignData={campaignData}
          onEdit={() => setCurrentStep(0)}
        />
      ) : (
        steps[currentStep]?.component
      )}
    </div>
  );
};

export default CampaignWizard;
