import { SuccessCard } from './SuccessCard';

export function SuccessSection() {
  const vendorFeatures = [
    'Create targeted campaigns with specific requirements',
    'Find the perfect influencers for your brand',
    'Track performance metrics and ROI in real-time',
    'Manage multiple campaigns from one dashboard',
  ];

  const influencerFeatures = [
    'Discover brand partnerships that match your niche',
    'Monetize your content and grow your income',
    'Build long-term relationships with quality brands',
    'Access exclusive campaign opportunities',
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 space-y-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Built for Success on Both Sides
        </h2>
        <p className="text-indigo-600 text-lg mt-4 leading-relaxed font-medium">
          Whether you&apos;re a brand looking to amplify your message or an influencer ready to monetize your audience, we&apos;ve got you covered.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        <SuccessCard title="For Vendors & Brands" features={vendorFeatures} />
        <SuccessCard
          title="For Influencers & Creators"
          features={influencerFeatures}
          iconColor="text-indigo-600"
        />
      </div>
    </section>
  );
}
