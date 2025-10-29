import { RiLightbulbFlashLine } from '@remixicon/react';

export function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 py-10 text-gray-400 text-sm flex flex-col md:flex-row justify-between">
      <div className="mb-6 md:mb-0 flex items-center gap-2 font-semibold text-white">
        <RiLightbulbFlashLine size={24} />
        InfluenceHub
      </div>

      <div className="flex flex-col sm:flex-row gap-12">
        <div>
          <h4 className="mb-2 font-semibold text-white">Platform</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-white">For Brands</a></li>
            <li><a href="#" className="hover:text-white">For Influencers</a></li>
            <li><a href="#" className="hover:text-white">Pricing</a></li>
            <li><a href="#" className="hover:text-white">Success Stories</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-white">Support</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-white">Connect</h4>
          <div className="flex gap-4 text-gray-400">
            {/* Twitter */}
            <a href="#" aria-label="Twitter" className="hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M24 4.557a9.816 9.816 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.862 9.862 0 01-3.127 1.195 4.92 4.92 0 00-8.38 4.482 13.953 13.953 0 01-10.141-5.144 4.917 4.917 0 001.523 6.574 4.902 4.902 0 01-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.417A9.867 9.867 0 010 19.54a13.9 13.9 0 007.548 2.212c9.056 0 14.009-7.514 14.009-14.02 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z" />
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" aria-label="Facebook" className="hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.466.099 2.797.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.312h3.59l-.467 3.622h-3.123V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M7.75 2h8.5C19.55 2 22 4.45 22 7.75v8.5c0 3.3-2.45 5.75-5.75 5.75h-8.5C4.45 22 2 19.55 2 16.25v-8.5C2 4.45 4.45 2 7.75 2zm0 2C5.68 4 4 5.68 4 7.75v8.5C4 18.32 5.68 20 7.75 20h8.5c2.07 0 3.75-1.68 3.75-3.75v-8.5C20 5.68 18.32 4 16.25 4h-8.5zm8.5 1.5a1 1 0 110 2 1 1 0 010-2zm-4.25 1a4.75 4.75 0 110 9.5 4.75 4.75 0 010-9.5zm0 2a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" aria-label="LinkedIn" className="hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M20.447 20.452H16.89v-5.569c0-1.328-.025-3.039-1.852-3.039-1.854 0-2.137 1.447-2.137 2.941v5.667H9.337V9h3.415v1.561h.049c.476-.9 1.637-1.852 3.368-1.852 3.6 0 4.266 2.37 4.266 5.455v6.288zM5.337 7.433a1.978 1.978 0 11.002-3.957 1.978 1.978 0 01-.002 3.957zM6.921 20.452H3.754V9h3.167v11.452zM22.225 0H1.771C.792 0 0 .77 0 1.723v20.555C0 23.23.792 24 1.771 24h20.451c.978 0 1.778-.77 1.778-1.722V1.723C24 .77 23.203 0 22.225 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
