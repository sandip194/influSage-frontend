import { RiLightbulbFlashLine } from '@remixicon/react';
import { Button } from 'antd';

export function HeroSection() {
  return (
    <section
      className="relative px-6 py-16 flex flex-col md:flex-row items-center gap-10 md:gap-24"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg max-w-md shadow-lg text-left">
        <h1 className="text-3xl font-extrabold mb-4">Connect Brands with Authentic Influencers</h1>
        <p className="mb-6 text-gray-700 text-sm">
          The ultimate platform where vendors create targeted campaigns and influencers discover meaningful brand partnerships. Transform your marketing strategy with authentic collaborations that drive real results.
        </p>
        <div className="flex gap-3">
          <Button type="primary" icon={<RiLightbulbFlashLine />}>Start Your Campaign</Button>
          <Button>Join as Influencer</Button>
        </div>
      </div>
    </section>
  );
}
