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
    <section className="pt-40 pb-24 bg-[#0D132D] text-white relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#335CFF]/10 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative">
        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* Left Content */}
          <div className="lg:col-span-7 space-y-12 relative z-10">

            {/* Headline */}
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Where <span className="text-[#335CFF] italic">Brands</span> & <span className="text-[#335CFF]">Influencers</span> Build Winning Partnerships
            </h1>

            {/* OR alternative headline */}
            {/* <h1 className="text-4xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              The Smart Way for <span className="text-[#335CFF]">Brands</span> and <span className="text-[#335CFF]">Influencers</span> to Collaborate
            </h1> */}

            {/* Sub-headline */}
            <p className="text-lg text-white/60 max-w-xl leading-relaxed font-light">
              We connect brands with the right Influencers and help influencers collaborate with brands that actually fit — powered by data, trust, and performance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-5">
              <button className="bg-[#335CFF] text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-[#0D132D] transition-all transform hover:scale-105 active:scale-95">
                Get Started as a Brand
              </button>
              <button className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-6 py-3 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                Join as an Influencer
              </button>
            </div>
          </div>

          {/* Right Video Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl group">
              
              {/* Video */}
              <video
                className="w-full aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                src="/hero.mp4" // your local video path
                autoPlay
                muted
                loop
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D132D] via-transparent to-transparent" />

              {/* Card Content */}
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <p className="text-[#335CFF] text-sm font-bold uppercase tracking-widest mb-2">
                  Campaign Example
                </p>
                <h3 className="text-3xl font-bold mb-4">Summer Product Launch</h3>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-tighter">
                      Engagement
                    </p>
                    <p className="text-xl font-bold text-[#335CFF]">4.8%</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-tighter">
                      Reach
                    </p>
                    <p className="text-xl font-bold">1.2M+</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stat Card */}
            <div className="absolute -bottom-10 -left-20 w-64 p-6 bg-white rounded-2xl shadow-2xl hidden xl:block">
              <p className="text-[10px] font-bold uppercase text-[#0D132D]/50 mb-2 tracking-widest">
                Campaign Budget
              </p>
              <p className="text-4xl font-black text-[#0D132D]">25,400</p>
              <div className="flex items-center gap-2 text-[#335CFF] text-sm mt-2">
                <span>+12.4% vs last month</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
