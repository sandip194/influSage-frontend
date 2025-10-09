import React, { useEffect, useState } from 'react';

const slides = [
  {
    image: 'https://images.pexels.com/photos/7081099/pexels-photo-7081099.jpeg',
    title: 'Empower Your Influence',
    description: 'Join top creators shaping brand stories globally.',
  },
  {
    image: 'https://images.pexels.com/photos/7081101/pexels-photo-7081101.jpeg',
    title: 'Connect. Create. Collaborate.',
    description: 'Fuel your passion by partnering with the best brands.',
  },
  {
    image: 'https://images.pexels.com/photos/7081095/pexels-photo-7081095.jpeg',
    title: 'Be Seen. Be Valued.',
    description: 'Let your creativity shine on a platform built for you.',
  },
  {
    image: 'https://images.pexels.com/photos/7081113/pexels-photo-7081113.jpeg',
    title: 'Level Up Your Content Game',
    description: 'Insights, tools, and connections — all in one place.',
  },
];

const SideImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // fade out text
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setFade(true); // fade in text
      }, 500); // matches CSS transition
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const { image, title, description } = slides[currentSlide];

  return (
    <>
      <img
        src={image}
        alt="Slide"
        className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000"
      />  

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d132da4] z-10" />
        {/* <div className="relative flex-1 min-h-full  md:flex items-start justify-start p-8 text-white">


          <div className="relative z-20 max-w-sm">
            <div className="mb-5">
              <img src="/influSage-logo.png" alt="Logo" className="h-8 w-auto" />
            </div>
            <div className={`branding ${fade ? '' : 'fade-out'}`}>
              <h1 className="text-md text-[#0f1533] font-bold mb-0">{title}</h1>
              <h1 className="text-sm text-[#0f1533] leading-relaxed">{description}</h1>
            </div>

          </div>

        </div> */}
    </>

  );
};

export default SideImageSlider;
