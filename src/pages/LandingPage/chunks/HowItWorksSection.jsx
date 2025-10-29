import { RiLightbulbFlashLine, RiTrophyLine, RiUser2Line } from '@remixicon/react';
import { HowItWorksStep } from './HowItWorksStep';

export function HowItWorksSection() {
  return (
    <section className="bg-indigo-50 px-6 py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          How It Works
        </h2>
        <p className="mt-4 text-indigo-700 text-lg font-medium">
          Simple, efficient, and effective. Get started in three easy steps.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-12 max-w-6xl mx-auto">
        <HowItWorksStep
          icon={
            <RiLightbulbFlashLine 
              size={56} 
              className="text-indigo-600 bg-indigo-100 rounded-full p-4 shadow-lg" 
            />
          }
          title="1. Create Campaign"
          description="Vendors create detailed campaigns with specific requirements, target audience, budget, and deliverables to attract the right influencers."
        />
        <HowItWorksStep
          icon={
            <RiUser2Line 
              size={56} 
              className="text-purple-600 bg-purple-100 rounded-full p-4 shadow-lg" 
            />
          }
          title="2. Apply & Match"
          description="Influencers browse available campaigns, apply to those that align with their audience and values, creating perfect brand partnerships."
        />
        <HowItWorksStep
          icon={
            <RiTrophyLine 
              size={56} 
              className="text-green-600 bg-green-100 rounded-full p-4 shadow-lg" 
            />
          }
          title="3. Collaborate & Succeed"
          description="Successful matches collaborate seamlessly, track performance metrics, and achieve outstanding results for both brands and creators."
        />
      </div>
    </section>
  );
}

