import { RiLightbulbFlashLine, RiTrophyLine, RiUser2Line } from '@remixicon/react';
import { HowItWorksStep } from './HowItWorksStep';

export function HowItWorksSection() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <p className="text-gray-500 text-sm mt-2">
          Simple, efficient, and effective. Get started in three easy steps.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-12 text-center max-w-4xl mx-auto">
        <HowItWorksStep
          icon={<RiLightbulbFlashLine size={48} className="text-gray-900 bg-blue-100 rounded-full p-3" />}
          title="1. Create Campaign"
          description="Vendors create detailed campaigns with specific requirements, target audience, budget, and deliverables to attract the right influencers."
        />
        <HowItWorksStep
          icon={<RiUser2Line size={48} className="text-purple-900 bg-purple-100 rounded-full p-3" />}
          title="2. Apply & Match"
          description="Influencers browse available campaigns, apply to those that align with their audience and values, creating perfect brand partnerships."
        />
        <HowItWorksStep
          icon={<RiTrophyLine size={48} className="text-green-900 bg-green-100 rounded-full p-3" />}
          title="3. Collaborate & Succeed"
          description="Successful matches collaborate seamlessly, track performance metrics, and achieve outstanding results for both brands and creators."
        />
      </div>
    </section>
  );
}
