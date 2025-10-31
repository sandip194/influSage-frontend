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
import { useParams } from 'react-router-dom';



const isNonEmptyObject = (obj) => obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length > 0;
const isNonEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;


const CampaignWizard = () => {
  const { token } = useSelector((state) => state.auth);
  const { campaignId } = useParams();

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
  const markStepComplete = (index) => {
    const updated = [...completedSteps];
    if (!updated[index]) {
      updated[index] = true;
      setCompletedSteps(updated);
      localStorage.setItem("completedSteps", JSON.stringify(updated));
      setLastCompletedStep(index);
    } else {
      // Handle edge case: all completed, go to review
      if (index + 1 >= steps.length) {
        setCurrentStep("review");
      } else {
        setCurrentStep(index + 1);
      }
    }
  };


  // Fetch campaign data
  const getCampaignData = async () => {
    try {
      const endpath = campaignId ? `${campaignId}` : '01';
      const res = await axios.get(`/vendor/campaign/${endpath}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const parts = res.data?.campaignParts;
      if (res.status === 200 && parts) {
        setCampaignData({
          expectation: parts.p_objectivejson || {},
          step2: parts.p_vendorinfojson || {},
          step3: parts.p_campaignjson || {},
          categories: parts.p_campaigncategoyjson || [],
          step4: parts.p_campaignfilejson || [],
          step5: parts.p_contenttypejson || {},
          profileParts: parts,
        });

        // Determine which steps are completed
        const newCompletion = [
          isNonEmptyObject(parts.p_objectivejson),
          isNonEmptyObject(parts.p_vendorinfojson),
          isNonEmptyObject(parts.p_campaignjson),
          isNonEmptyArray(parts.p_campaigncategoyjson),
          isNonEmptyArray(parts.p_campaignfilejson),
          isNonEmptyObject(parts.p_contenttypejson),
        ];


        setCompletedSteps(newCompletion);
        localStorage.setItem("completedSteps", JSON.stringify(newCompletion));

        // Find the first incomplete step
      const firstIncomplete = newCompletion.findIndex((done) => !done);
setCurrentStep(firstIncomplete !== -1 ? firstIncomplete : (campaignId ? 0 : "review"));
        }
    } catch (err) {
      console.error("❌ Error fetching campaign:", err);
      toast.error("Failed to fetch campaign data.");
    }
  };

  // ✅ Handle back navigation — fetch latest data before showing previous step
const handleBack = async (prevIndex) => {
  try {
    await getCampaignData(); // re-fetch from Redis/backend
    setCurrentStep(prevIndex);
  } catch (err) {
    console.error("Error while going back:", err);
  }
};


  useEffect(() => {
  if (!campaignId && lastCompletedStep !== null) {
    let isMounted = true;
    (async () => {
      await getCampaignData();
      if (!isMounted) return;

      if (lastCompletedStep + 1 < steps.length) {
        setCurrentStep(lastCompletedStep + 1);
      } else {
        setCurrentStep("review");
      }
    })();

    return () => {
      isMounted = false;
    };
  }
}, [lastCompletedStep]);



// useEffect(() => {
//   const fetchData = async () => {
//     await getCampaignData();

//     if (campaignId) {
//       // If campaignId exists, skip review completely
//       const firstIncompleteStep = completedSteps.findIndex((done) => !done);
//       setCurrentStep(firstIncompleteStep !== -1 ? firstIncompleteStep : 0);
//     } else {
//       // If no campaignId, allow review
//       const firstIncompleteStep = completedSteps.findIndex((done) => !done);
//       setCurrentStep(firstIncompleteStep !== -1 ? firstIncompleteStep : "review");
//     }
//   };

//   fetchData();
// }, [campaignId]);

 useEffect(() => {
  const fetchData = async () => {
    await getCampaignData();

    if (campaignId) {
      setCurrentStep(0);
    } else {
      const savedSteps = JSON.parse(localStorage.getItem("completedSteps") || "[]");

      const firstIncompleteStep = savedSteps.findIndex((done) => !done);

      if (firstIncompleteStep !== -1) {
        setCurrentStep(firstIncompleteStep);
      } else {
        setCurrentStep("review");
      }
    }
  };

  fetchData();
}, [campaignId]);




  // Define steps early so functions below can access it
  const steps = [
    {
      title: "Expectation",
      component: (
        <CampaignExpectationSelector
          campaignId={campaignId}
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
          campaignId={campaignId}
          data={campaignData.step2}
          onChange={(updated) => updateCampaignSection("step2", updated)}
          onNext={() => markStepComplete(1)}
          onBack={() => handleBack(currentStep - 1)}

        />
      ),
    },
    {
      title: "Step 3",
      component: (
        <CampaignStep3
          campaignId={campaignId}
          data={campaignData.step3}
          onChange={(updated) => updateCampaignSection("step3", updated)}
          onNext={() => markStepComplete(2)}
          onBack={() => handleBack(currentStep - 1)}

        />
      ),
    },
    {
      title: "Categories", // 👈 NEW STEP
      component: (
        <CampaignCategorySection
          campaignId={campaignId}
          data={campaignData.categories || []} // 👈 you may need to adjust this based on saved data
          onNext={() => markStepComplete(3)}
          onBack={() => handleBack(currentStep - 1)}

        />
      ),
    },
    {
      title: "Step 4",
      component: (
        <CampaignStep4
          campaignId={campaignId}
          data={campaignData.step4}
          onChange={(updated) => updateCampaignSection("step4", updated)}
          onNext={() => markStepComplete(4)}
          onBack={() => handleBack(currentStep - 1)}

        />
      ),
    },
    {
      title: "Step 5",
      component: (
        <CampaignStep5
          campaignId={campaignId}
          data={campaignData.step5}
          onChange={(updated) => updateCampaignSection("step5", updated)}
          onNext={() => markStepComplete(5)}
          onBack={() => handleBack(currentStep - 1)}

        />
      ),
    },
  ];


  return (
    <div className="flex flex-col gap-4">
      {currentStep === "review" ? (
        <CampaignReviewStep
  campaignData={campaignData}
  onEdit={async () => {
    await getCampaignData(); // fetch latest from Redis
    setCurrentStep(0); // go to first step
  }}
/>

      ) : (
        steps[currentStep]?.component
      )}
    </div>
  );
};

export default CampaignWizard;
