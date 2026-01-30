// import { RiLightbulbFlashLine } from '@remixicon/react';
// import { Button } from 'antd';
// import { useEffect, useState } from 'react';

// export function HeroSection() {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     setIsVisible(true);
//   }, []);

//   return (
//     <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white overflow-hidden px-6 py-24 flex items-center justify-center">
//       {/* Glowing blobs */}
//       <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse hidden md:block"></div>
//       <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse hidden md:block"></div>

//       <div className="container max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16 md:gap-24">
//         {/* Text Content */}
//         <div
//           className={`flex-1 max-w-xl transition-all duration-1000 ease-in-out ${
//             isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
//           }`}
//         >
//           <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
//             Connect Brands with{' '}
//             <span className="text-yellow-400">Authentic Influencers</span>
//           </h1>
//           <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
//             Transform your marketing strategy through targeted campaigns and meaningful
//             collaborations that drive real engagement and growth.
//           </p>
//           <div className="flex gap-4 flex-wrap">
//             <Button
//               type="primary"
//               size="large"
//               icon={<RiLightbulbFlashLine />}
//               className="!bg-yellow-400 !border-none !text-gray-900 !font-semibold hover:!bg-yellow-300 transition-all duration-300"
//             >
//               Get Started
//             </Button>
//             <Button
//               ghost
//               size="large"
//               className="!text-white !border-white/40 hover:!bg-white/20 transition-all duration-300"
//             >
//               Join as Influencer
//             </Button>
//           </div>
//         </div>

//         {/* Illustration */}
//         <div
//           className={`flex-1 relative max-w-lg w-full transition-all duration-1000 ease-in-out ${
//             isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
//           }`}
//         >
//           <div className="relative rounded-3xl shadow-2xl overflow-hidden border border-white/10">
//             <img
//               src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80"
//               alt="Modern brand influencer collaboration"
//               className="w-full h-96 object-cover"
//               loading="lazy"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/60 to-transparent"></div>
//           </div>


//         </div>
//       </div>
//     </section>
//   );
// }



export function HeroSection() {
  return (
    <section className="py-32 lg:py-50 bg-[#0D132D] text-white relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#335CFF]/10 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative">
        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* ================= LEFT CONTENT ================= */}
          <div className="lg:col-span-7 space-y-12 relative z-10">

            <h1 className="text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight">
              Where <span className="text-[#335CFF] italic">Brands</span> &{" "}
              <span className="text-[#335CFF]">Influencers</span> Build Winning Partnerships
            </h1>

            <p className="text-lg text-white/60 leading-relaxed font-light">
              We connect brands with the right Influencers and help influencers collaborate
              with brands that actually fit — powered by data, trust, and performance.
            </p>

            <div className="flex flex-wrap gap-5">
              <button className="bg-[#335CFF] text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-[#0D132D] transition-all transform hover:scale-105 active:scale-95">
                Get Started as a Brand
              </button>
              <button className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-6 py-3 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                Join as an Influencer
              </button>
            </div>
          </div>

          {/* ================= RIGHT VIDEO SECTION ================= */}
          <div className="lg:col-span-5 relative flex flex-col items-center gap-8 pt-10">

            {/* Video Card */}
            <div className="relative w-full max-w-[620px] rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl shadow-blue-500/50 group">
              
              {/* Subtle Glow */}
              <div className="absolute -inset-6 bg-[#335CFF]/10 blur-3xl -z-10 hidden lg:block" />

              <video
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                src="/campaign overview.mp4"
                autoPlay
                muted
                loop
                playsInline
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D132D]/10 via-[#0D132D]/30 to-transparent" />
            </div>

            {/* ===== MOBILE / TABLET STACKED BADGES ===== */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:hidden">

              {/* Estimated Payout */}
              <div className="w-full sm:w-64 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                <p className="text-[10px] font-bold uppercase text-white/60 tracking-widest mb-1">
                  Estimated Payout
                </p>
                <p className="text-3xl font-black text-white">₹25,400</p>
                <p className="text-xs text-[#335CFF] mt-1">
                  Across selected creators
                </p>
              </div>

              {/* Campaign Info */}
              <div className="w-full sm:w-72 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <p className="text-[#335CFF] text-xs font-bold uppercase tracking-widest mb-2">
                  LIVE CAMPAIGN
                </p>
                <h3 className="text-xl font-bold">
                  Lifestyle Brand Collaboration
                </h3>

                <div className="grid grid-cols-2 gap-2 border-t border-white/10 ">
                  <div>
                    <p className="text-[11px] text-white/50 uppercase tracking-wider">
                      Avg Engagement
                    </p>
                    <p className="text-lg font-bold text-[#335CFF]">4.8%</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-white/50 uppercase tracking-wider">
                      Potential Reach
                    </p>
                    <p className="text-lg font-bold">1.2M+</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== DESKTOP FLOATING BADGES ===== */}

            {/* Top Right */}
            <div className="absolute -top-5 -right-20 w-48 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_30px_80px_rgba(51,92,255,0.25)] hidden lg:block">
              <p className="text-[10px] font-bold uppercase text-white/60 tracking-widest mb-1">
                Estimated Payout
              </p>
              <p className="text-2xl font-black text-white">₹25,400</p>
              <p className="text-xs text-[#335CFF] mt-1">
                Across selected creators
              </p>
            </div>

            {/* Bottom Left */}
            <div className="absolute -bottom-36 -left-40 w-64 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hidden xl:block">
              <p className="text-[#335CFF] text-xs font-bold uppercase tracking-widest mb-2">
                LIVE CAMPAIGN
              </p>
              <h3 className="text-2xl font-bold mb-4">
                Lifestyle Brand Collaboration
              </h3>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                <div>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider">
                    Avg Engagement
                  </p>
                  <p className="text-lg font-bold text-[#335CFF]">4.8%</p>
                </div>
                <div>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider">
                    Potential Reach
                  </p>
                  <p className="text-lg font-bold">1.2M+</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
