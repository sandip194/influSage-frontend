import { RiLightbulbFlashLine } from '@remixicon/react';
import { Button } from 'antd';
import { useEffect, useState } from 'react';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white overflow-hidden px-6 py-24 flex items-center justify-center">
      {/* Glowing blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse hidden md:block"></div>
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse hidden md:block"></div>

      <div className="container max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16 md:gap-24">
        {/* Text Content */}
        <div
          className={`flex-1 max-w-xl transition-all duration-1000 ease-in-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Connect Brands with{' '}
            <span className="text-yellow-400">Authentic Influencers</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
            Transform your marketing strategy through targeted campaigns and meaningful
            collaborations that drive real engagement and growth.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button
              type="primary"
              size="large"
              icon={<RiLightbulbFlashLine />}
              className="!bg-yellow-400 !border-none !text-gray-900 !font-semibold hover:!bg-yellow-300 transition-all duration-300"
            >
              Get Started
            </Button>
            <Button
              ghost
              size="large"
              className="!text-white !border-white/40 hover:!bg-white/20 transition-all duration-300"
            >
              Join as Influencer
            </Button>
          </div>
        </div>

        {/* Illustration */}
        <div
          className={`flex-1 relative max-w-lg w-full transition-all duration-1000 ease-in-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}
        >
          <div className="relative rounded-3xl shadow-2xl overflow-hidden border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80"
              alt="Modern brand influencer collaboration"
              className="w-full h-96 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/60 to-transparent"></div>
          </div>

          
        </div>
      </div>
    </section>
  );
}
