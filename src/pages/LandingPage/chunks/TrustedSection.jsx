export function TrustedSection() {
  return (
    <section className="relative px-6 py-24 bg-gradient-to-br from-white via-indigo-50 to-purple-50 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-4xl opacity-30 -z-10"></div>

      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Trusted by Industry Leaders
        </h2>
        <p className="text-indigo-700 text-lg font-medium mt-4 leading-relaxed">
          Join thousands of successful brands and creators already using our platform.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-center">
        {/* Stat Card */}
        <div className="group bg-white/70 backdrop-blur-sm rounded-2xl px-10 py-8 shadow-lg hover:shadow-indigo-300 transition-all duration-300 w-64">
          <p className="text-5xl mb-3 font-extrabold text-indigo-600 group-hover:scale-110 transition-transform">
            10K+
          </p>
          <p className="text-gray-600 font-medium">Active Campaigns</p>
        </div>

        <div className="group bg-white/70 backdrop-blur-sm rounded-2xl px-10 py-8 shadow-lg hover:shadow-purple-300 transition-all duration-300 w-64">
          <p className="text-5xl mb-3 font-extrabold text-purple-600 group-hover:scale-110 transition-transform">
            50K+
          </p>
          <p className="text-gray-600 font-medium">Verified Influencers</p>
        </div>

        <div className="group bg-white/70 backdrop-blur-sm rounded-2xl px-10 py-8 shadow-lg hover:shadow-green-300 transition-all duration-300 w-64">
          <p className="text-5xl mb-3 font-extrabold text-green-600 group-hover:scale-110 transition-transform">
            5K+
          </p>
          <p className="text-gray-600 font-medium">Partner Brands</p>
        </div>

        <div className="group bg-white/70 backdrop-blur-sm rounded-2xl px-10 py-8 shadow-lg hover:shadow-orange-300 transition-all duration-300 w-64">
          <p className="text-5xl mb-3 font-extrabold text-orange-500 group-hover:scale-110 transition-transform">
            $2M+
          </p>
          <p className="text-gray-600 font-medium">Creator Earnings</p>
        </div>
      </div>
    </section>
  );
}
