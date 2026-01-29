// import { RiLightbulbFlashLine, RiTrophyLine, RiUser2Line } from '@remixicon/react';
// import { HowItWorksStep } from './HowItWorksStep';

// export function HowItWorksSection() {
//   return (
//     <section className="bg-indigo-50 px-6 py-20">
//       <div className="text-center max-w-3xl mx-auto mb-16">
//         <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
//           How It Works
//         </h2>
//         <p className="mt-4 text-indigo-700 text-lg font-medium">
//           Simple, efficient, and effective. Get started in three easy steps.
//         </p>
//       </div>

//       <div className="flex flex-col md:flex-row justify-center gap-12 max-w-6xl mx-auto">
//         <HowItWorksStep
//           icon={
//             <RiLightbulbFlashLine 
//               size={56} 
//               className="text-indigo-600 bg-indigo-100 rounded-full p-4 shadow-lg" 
//             />
//           }
//           title="1. Create Campaign"
//           description="Vendors create detailed campaigns with specific requirements, target audience, budget, and deliverables to attract the right influencers."
//         />
//         <HowItWorksStep
//           icon={
//             <RiUser2Line 
//               size={56} 
//               className="text-purple-600 bg-purple-100 rounded-full p-4 shadow-lg" 
//             />
//           }
//           title="2. Apply & Match"
//           description="Influencers browse available campaigns, apply to those that align with their audience and values, creating perfect brand partnerships."
//         />
//         <HowItWorksStep
//           icon={
//             <RiTrophyLine 
//               size={56} 
//               className="text-green-600 bg-green-100 rounded-full p-4 shadow-lg" 
//             />
//           }
//           title="3. Collaborate & Succeed"
//           description="Successful matches collaborate seamlessly, track performance metrics, and achieve outstanding results for both brands and creators."
//         />
//       </div>
//     </section>
//   );
// }


import { RiPlayFill } from "@remixicon/react";
import { useRef, useState } from "react";

export function HowItWorksSection() {
  const steps = [
    {
      title: "Define Campaign Goals",
      desc: "Set your objectives, target audience, and budget. Start your campaign with clear intent.",
      video: "/CreateCampaign.mp4", // Video for step 1
    },
    {
      title: "Discover Influencers",
      desc: "AI suggests creators that perfectly match your brand values. Review their profiles and performance stats.",
      video: "/CreateCampaign.mp4", // Video for step 1
    },
    {
      title: "Launch & Monitor",
      desc: "Activate your campaign and track ROI in real-time. Adjust your strategy for maximum impact.",
      video: "/CreateCampaign.mp4", // Video for step 1
    },
  ];

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <section className="py-32 bg-[#0D132D1A]/20 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 text-[#0D132D]">
              How Brands Create Campaigns
            </h2>
            <p className="text-xl text-[#0D132D80]">
              From setting goals to launching campaigns, see how easy it is to reach your ideal audience.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group lg:mt-idx*6">
              <div className="text-[12rem] font-black text-[#0D132D]/5 absolute -top-24 -left-8 leading-none select-none group-hover:text-[#335CFF]/10 transition-colors">
                {`0${idx + 1}`}
              </div>
              <div className="relative z-10 pt-16">
                <h4 className="text-2xl font-bold mb-4 text-[#0D132D]">{step.title}</h4>
                <p className="text-[#0D132D80] leading-relaxed mb-8">{step.desc}</p>

                {/* Show video if step has video, else show image */}
                {step.video ? (
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-black">
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        src={step.video}
                        muted
                        loop
                        autoPlay={false}
                      />
                      {!isPlaying && (
                        <button
                          onClick={handlePlay}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#335CFF]/80 hover:bg-[#335CFF]/90 shadow-lg shadow-[#335CFF]/50 cursor-pointer transition-transform transform hover:scale-110 animate-pulse">
                            <RiPlayFill className="text-white ml-0.5" size={30} />
                            {/* Optional: subtle ring effect */}
                            <span className="absolute w-16 h-16 rounded-full border border-[#335CFF]/30 animate-ping"></span>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-xl group-hover:-translate-y-2 transition-transform duration-500">
                    <img
                      alt={step.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      src={step.img}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
