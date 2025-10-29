export function TrustedSection() {
  return (
    <section className="px-6 py-16 bg-gray-50 rounded-lg">
      <div className="text-center mb-10">
        <h2 className="text-xl font-semibold">Trusted by Industry Leaders</h2>
        <p className="text-gray-500 text-sm mt-2">Join thousands of successful brands and creators already using our platform</p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 mb-12 text-center">
        <div className="bg-white rounded-lg px-6 py-5 shadow w-64">
          <p className="text-lg font-bold">10K+</p>
          <p className="text-xs text-gray-400">Active Campaigns</p>
        </div>
        <div className="bg-white rounded-lg px-6 py-5 shadow w-64 text-purple-600">
          <p className="text-lg font-bold">50K+</p>
          <p className="text-xs">Verified Influencers</p>
        </div>
        <div className="bg-white rounded-lg px-6 py-5 shadow w-64 text-green-600">
          <p className="text-lg font-bold">5K+</p>
          <p className="text-xs">Partner Brands</p>
        </div>
        <div className="bg-white rounded-lg px-6 py-5 shadow w-64 text-orange-500">
          <p className="text-lg font-bold">$2M+</p>
          <p className="text-xs">Creator Earnings</p>
        </div>
      </div>
    </section>
  );
}
