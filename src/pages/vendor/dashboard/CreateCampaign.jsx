import React from 'react'
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    id: 1,
    title: "Define Influencer Criteria",
    description:
      "Provide our AI engine with specific criteria to find influencers who are relevant to your product. You can give clues such as the influencer type, desired following size, category, gender, language, country, and relevant hashtags frequently used in their social feed.",
  },
  {
    id: 2,
    title: "Determine Collaboration Terms",
    description:
      "Specify the campaign delivery dates or bio url and any conditions you have regarding the duration your content should stay on influencers' social channels.",
  },
  {
    id: 3,
    title: "Craft an Engaging Campaign Title and Requirements",
    description:
      "Craft an attention-grabbing title and description for your campaign effortlessly. Let our advanced AI engine generate the initial draft for you, saving you time and effort. Remember, the title serves as the first impression, capable of attracting thousands of proposals from influencers eager to collaborate with you.",
  },
];

const CreateCampaign = () => {
  const navigate = useNavigate();

  const handleCreateCampaign = () => {
    navigate('/vendor-dashboard/vendor-campaign/create-campaign');
  };

  return (
    <div className="create-campaign">
      <div className="campaign-header">
        <h3 className="text-lg sm:text-xl font-bold">Create Campaign</h3>
      </div>

      <div className="campain-content bg-white rounded-2xl p-5 mt-4">
        <h3 className="text-lg sm:text-xl font-bold mb-4">
          Create Your Campaign in 3 Simple Steps
        </h3>

        <div className="space-y-3">
          {steps.map(({ id, title, description }) => (
            <div
              key={id}
              className="border border-gray-200 rounded-2xl p-2 sm:p-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                {/* Step number */}
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 text-gray-900 font-semibold text-base sm:text-lg shrink-0">
                  {id}
                </div>

                {/* Step content */}
                <div>
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">
                    {title}
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-justify">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleCreateCampaign}
          className="bg-[#121A3F] mt-5 text-white cursor-pointer px-6 sm:px-8 py-3 rounded-full hover:bg-[#0D132D] w-full sm:w-auto"
        >
          Create New Campaign
        </button>
      </div>
    </div>
  );
};

export default CreateCampaign;
