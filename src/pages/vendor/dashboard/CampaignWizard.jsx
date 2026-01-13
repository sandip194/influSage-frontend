import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

// Step Components
import CampaignExpectationSelector from "../../../components/users/vendorCampaign/CampaignExpectationSelector";
import CampaignStep2 from "../../../components/users/vendorCampaign/CampaignStep2";
import CampaignStep3 from "../../../components/users/vendorCampaign/CampaignStep3";
import CampaignStep4 from "../../../components/users/vendorCampaign/CampaignStep4";
import CampaignStep5 from "../../../components/users/vendorCampaign/CampaignStep5";
import CampaignReviewStep from "../../../components/users/vendorCampaign/CampaignReviewStep";
import CampaignCategorySection from "../../../components/users/vendorCampaign/CampaignCategorySection";


// Helpers
const isNonEmptyObject = (obj) =>
  obj && typeof obj === "object" && !Array.isArray(obj) && Object.keys(obj).length > 0;

const isNonEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;


const CampaignWizard = () => {
  const { token } = useSelector((state) => state.auth);
  const { campaignId } = useParams();

  const [campaignData, setCampaignData] = useState({
    expectation: {},
    step2: {},
    step3: {},
    categories: [],
    step4: [],
    step5: {},
    profileParts: null,
  });

  const [completedSteps, setCompletedSteps] = useState([false, false, false, false, false, false]);
  const [currentStep, setCurrentStep] = useState(null); // null = not initialized yet

  // Prevent re-running initialization
  const initialized = useRef(false);

  const localKey = `completedSteps_${campaignId || "new"}`;



  // ---------------------------
  // Define Steps (Before Logic)
  // ---------------------------
  const steps = [
    {
      title: "Expectation",
      component: (
        <CampaignExpectationSelector
          campaignId={campaignId}
          data={campaignData.expectation}
          onChange={(d) => updateCampaignSection("expectation", d)}
          onNext={() => markStepComplete(0)}
        />
      ),
    },
    {
      title: "Vendor Details",
      component: (
        <CampaignStep2
          campaignId={campaignId}
          data={campaignData.step2}
          onChange={(d) => updateCampaignSection("step2", d)}
          onNext={() => markStepComplete(1)}
          onBack={() => goBack(0)}
        />
      ),
    },
    {
      title: "Campaign Details",
      component: (
        <CampaignStep3
          campaignId={campaignId}
          data={campaignData.step3}
          onChange={(d) => updateCampaignSection("step3", d)}
          onNext={() => markStepComplete(2)}
          onBack={() => goBack(1)}
        />
      ),
    },
    {
      title: "Categories",
      component: (
        <CampaignCategorySection
          campaignId={campaignId}
          data={campaignData.categories}
          onNext={() => markStepComplete(3)}
          onBack={() => goBack(2)}
        />
      ),
    },
    {
      title: "Files",
      component: (
        <CampaignStep4
          campaignId={campaignId}
          data={campaignData.step4}
          onChange={(d) => updateCampaignSection("step4", d)}
          onNext={() => markStepComplete(4)}
          onBack={() => goBack(3)}
        />
      ),
    },
    {
      title: "Content Types",
      component: (
        <CampaignStep5
          campaignId={campaignId}
          data={campaignData.step5}
          onChange={(d) => updateCampaignSection("step5", d)}
          onNext={() => markStepComplete(5)}
          onBack={() => goBack(4)}
        />
      ),
    },
  ];



  // ---------------------------
  // Update Section
  // ---------------------------
  const updateCampaignSection = (key, newData) => {
    setCampaignData((prev) => ({ ...prev, [key]: newData }));
  };



  // ---------------------------
  // Fetch Campaign from Backend
  // ---------------------------
  const getCampaignData = async () => { 
    try {
      const endpoint = campaignId ? campaignId : "01";
      const res = await axios.get("/vendor/campaign", {
        params : {campaignId : endpoint},
        headers: { Authorization: `Bearer ${token}` },
      });

      const p = res.data?.campaignParts;
      if (!p) return;

      const newData = {
        expectation: p.p_objectivejson || {},
        step2: p.p_vendorinfojson || {},
        step3: p.p_campaignjson || {},
        categories: p.p_campaigncategoyjson || [],
        step4: p.p_campaignfilejson || [],
        step5: p.p_contenttypejson || {},
        profileParts: p,
      };

      setCampaignData(newData);

      const cmp = [
        isNonEmptyObject(newData.expectation),
        isNonEmptyObject(newData.step2),
        isNonEmptyObject(newData.step3),
        isNonEmptyArray(newData.categories),
        isNonEmptyArray(newData.step4),
        isNonEmptyObject(newData.step5),
      ];

      setCompletedSteps(cmp);
      localStorage.setItem(localKey, JSON.stringify(cmp));
    } catch (err) {
      console.log("Error fetching campaign:", err);
      toast.error("Failed to fetch campaign data.");
    }
  };



  // ---------------------------
  // BACK Navigation
  // ---------------------------
  const goBack = async (prevIndex) => {
     
    getCampaignData()

    setCurrentStep(prevIndex);
  };




  // ---------------------------
  // STEP COMPLETION
  // ---------------------------
  const markStepComplete = async (index) => {
    const updated = [...completedSteps];
    updated[index] = true;

    setCompletedSteps(updated);
    localStorage.setItem(localKey, JSON.stringify(updated));

    // Last step → go to review
    if (index === steps.length - 1) {
      return setCurrentStep("review");
    }

    setCurrentStep(index + 1);
  };



  // ---------------------------
  // INITIAL WIZARD SETUP
  // ---------------------------
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initialize = async () => {
      await getCampaignData();

      const saved = JSON.parse(localStorage.getItem(localKey) || "[]");
      const firstIncomplete = saved.findIndex((x) => !x);

      // Editing an existing campaign → always start at step 0
      if (campaignId) {
        return setCurrentStep(0);
      }

      // Creating new campaign → restore saved progress
      if (firstIncomplete !== -1) {
        return setCurrentStep(firstIncomplete);
      }

      // All completed → jump to review
      setCurrentStep("review");
    };

    initialize();
  }, [campaignId]);



  // ---------------------------
  // RENDER
  // ---------------------------
  if (currentStep === null) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      {currentStep === "review" ? (
        <CampaignReviewStep
          campaignData={campaignData}
          onEdit={async () => {
            await getCampaignData();
            setCurrentStep(0);
          }}
        />
      ) : (
        steps[currentStep]?.component
      )}
    </div>
  );
};

export default CampaignWizard;
