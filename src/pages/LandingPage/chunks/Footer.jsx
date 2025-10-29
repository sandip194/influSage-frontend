import { RiLightbulbFlashLine, RiTwitterXLine, RiFacebookBoxLine, RiInstagramLine, RiLinkedinBoxLine } from '@remixicon/react';

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-400 text-sm overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row justify-between gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 font-bold text-white text-lg mb-4">
            <RiLightbulbFlashLine size={26} className="text-yellow-400" />
            InfluSage
          </div>
          <p className="max-w-xs text-gray-400 text-sm leading-relaxed">
            Connecting brands with authentic influencers for powerful, data-driven campaigns that deliver real results.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-12 md:gap-16">
          <div>
            <h4 className="mb-3 font-semibold text-white tracking-wide">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">For Brands</a></li>
              <li><a href="#" className="hover:text-white transition-colors">For Influencers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-white tracking-wide">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-white tracking-wide">Connect</h4>
            <div className="flex gap-4 text-gray-400">
              <a href="#" className="hover:text-indigo-400 transition-colors"><RiTwitterXLine size={22} /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><RiFacebookBoxLine size={22} /></a>
              <a href="#" className="hover:text-pink-500 transition-colors"><RiInstagramLine size={22} /></a>
              <a href="#" className="hover:text-sky-500 transition-colors"><RiLinkedinBoxLine size={22} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>© 2025 InfluenceHub. All rights reserved.</p>
        <p className="mt-2 md:mt-0">
          Made with ❤️ by <span className="text-indigo-400 font-medium">InfluenceHub Team</span>
        </p>
      </div>
    </footer>
  );
}
