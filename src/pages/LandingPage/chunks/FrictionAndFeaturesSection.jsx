import { RiBrainLine, RiCloseCircleLine, RiEmotionUnhappyLine, RiGroupLine, RiLineChartLine, RiSearchEyeLine, RiShieldCheckLine } from "@remixicon/react";

const features = [
    {
        icon: <RiBrainLine className="text-5xl text-[#335CFF] mb-6" />,
        title: "Smart Matching",
        desc: "AI finds creators whose audience perfectly aligns with your brand values through deep semantic analysis.",
    },
    {
        icon: <RiShieldCheckLine className="text-5xl text-[#335CFF] mb-6" />,
        title: "Verified Profiles",
        desc: "Every creator has authenticated social stats. No more fake followers, just real human influence.",
    },
    {
        icon: <RiLineChartLine className="text-5xl text-[#335CFF] mb-6" />,
        title: "Real-time Analytics",
        desc: "Live dashboard tracking impressions, clicks, and conversion ROI for every single post.",
    },
    {
        icon: <RiGroupLine className="text-5xl text-[#335CFF] mb-6" />,
        title: "Collaboration Tools",
        desc: "Manage contracts, briefs, and approvals in one central hub designed for creative synergy.",
    },
];

export default function FrictionAndFeaturesSection() {
    return (
        <>
            <section className="py-32 bg-white/50">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
                    <div className="mb-20 text-center max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-[#0D132D]">
                            Eliminating Friction in Influencer Marketing
                        </h2>
                        <p className="text-lg text-[#0D132D80] leading-relaxed">
                            We tackle the biggest bottlenecks for both sides of the creative economy, turning chaos into curated growth.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="relative group rounded-3xl overflow-hidden bg-[#0D132D1A]/50 p-12 transition-all hover:shadow-2xl">
                            <div className="relative z-10">
                                <div className="size-16 bg-[#335CFF]/10 text-[#335CFF] rounded-2xl flex items-center justify-center mb-8">
                                    <RiSearchEyeLine className="text-3xl" />
                                </div>
                                <h3 className="text-3xl font-bold mb-6 text-[#0D132D]">For Brands</h3>
                                <ul className="space-y-6">
                                    <li className="flex items-start gap-4">
                                        <RiCloseCircleLine className="text-[#335CFF] mt-1 text-xl" />
                                        <p className="text-[#0D132DBF] font-medium">
                                            Finding the right fit amidst millions of profiles without data.
                                        </p>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <RiCloseCircleLine className="text-[#335CFF] mt-1 text-xl" />
                                        <p className="text-[#0D132DBF] font-medium">
                                            Dealing with opaque pricing and unpredictable ROI.
                                        </p>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <RiCloseCircleLine className="text-[#335CFF] mt-1 text-xl" />
                                        <p className="text-[#0D132DBF] font-medium">
                                            Manual tracking of content and reporting hurdles.
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="relative group rounded-3xl overflow-hidden bg-[#335CFF]/5 border border-[#335CFF]/10 p-12 transition-all hover:shadow-2xl">
                            <div className="relative z-10">
                                <div className="size-16 bg-[#335CFF]/20 text-[#335CFF] rounded-2xl flex items-center justify-center mb-8">
                                    <RiEmotionUnhappyLine className="text-3xl" />
                                </div>
                                <h3 className="text-3xl font-bold mb-6 text-[#0D132D]">For Influencers</h3>
                                <ul className="space-y-6">
                                    <li className="flex items-start gap-4">
                                        <RiCloseCircleLine className="text-[#335CFF] mt-1 text-xl" />
                                        <p className="text-[#0D132DBF] font-medium">
                                            Dealing with manual contracts and unfair compensation.
                                        </p>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <RiCloseCircleLine className="text-[#335CFF] mt-1 text-xl" />
                                        <p className="text-[#0D132DBF] font-medium">
                                            Endless back-and-forth emails for simple updates.
                                        </p>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <RiCloseCircleLine className="text-[#335CFF] mt-1 text-xl" />
                                        <p className="text-[#0D132DBF] font-medium">
                                            Delayed payments and lack of partnership security.
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                {features.map(({ icon, title, desc }) => (
                                    <div
                                        key={title}
                                        className="bg-[#0D132D1A]/30 p-8 rounded-3xl
                   hover:bg-white border border-transparent
                   hover:border-[#0D132D1A] hover:shadow-xl
                   transition-all h-full"
                                    >
                                        {icon}
                                        <h4 className="text-2xl font-bold mb-3 text-[#0D132D]">
                                            {title}
                                        </h4>
                                        <p className="text-[#0D132D80] leading-relaxed">
                                            {desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="bg-[#0D132D] rounded-3xl p-10
                  flex flex-col justify-end
                  relative overflow-hidden
                  text-white min-h-[500px] h-full">

                                <div className="absolute inset-0 opacity-40">
                                    <img
                                        alt="Creator Story"
                                        className="w-full h-full object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzRLJwAtJkB3vDSjgmTS6eStCq90RfJj7ycqNqgeXfkVuQy-Midwc4N6-rxzCgTYJxaOLsuFqs6c6xcUw0BCXPw_rF1JnUKnuImA5f5AzxVtFS7sy00Byq3KTjDt-6mN1qx6eY47KS6wDFd7gFgjfOgWsvRDQK9MaYOt80SEFVQabbhxUJi9kNsjVDypFGV4qadyqMfbA3tv2Fj4ufz1ZvbJMLqutEdfXx093flrF22l0FgJrVEdrQph9RDGrAUHWrHTBKsUOohs4"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D132D] via-[#0D132D]/60 to-transparent" />
                                </div>

                                <div className="relative z-10">
                                    <span className="text-[#335CFF] font-bold text-xs uppercase tracking-[0.2em] mb-4 block">
                                        Success Story
                                    </span>
                                    <h3 className="text-3xl font-extrabold mb-6 leading-tight">
                                        "Scaling to 500+ micro-influencers was impossible manually. InfluencerSaaS made it a one-person job."
                                    </h3>

                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-full overflow-hidden border-2 border-[#335CFF]/30">
                                            <img
                                                alt="David Kim"
                                                className="w-full h-full object-cover"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsUkz4u0XOCnb1B2FTbiLQtb3eWqaWooJaUVlESZrGi60JKMnSVQOZMeL6q9T4S9jbmylCC6MVW6uGc89pwbhrXE5C4c1BwXakb3EGhrqF-KhXMLvbBJWrkTrEmYi0kSoZVWGocSt_SVOPVvc_fAG-8HeKq7tia8giD05HGQ0deQAz3YRIa5Gm0BV9fcVjuSfcIStKqekY71_e_lLcGVeHTEIf4FFNHwna9lQN7MqdQhpR_HLSh0RiIBAGwNtt9i_RyINxHXiGVl8"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold">David Kim</p>
                                            <p className="text-xs text-white/60">CEO of HydrateDirect</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
