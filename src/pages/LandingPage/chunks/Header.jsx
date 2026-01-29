import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/30 backdrop-blur-md shadow-sm"
          : "bg-white"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-18 flex items-center justify-between">
        
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/influSage-logo.png"
            alt="InfluSage Logo"
            className="h-9 w-auto object-contain"
          />
        </div>

        {/* Navigation (optional – easy to add later) */}
        <nav className="hidden lg:flex items-center gap-10">
          <span className="text-sm font-semibold text-[#0D132D] hover:text-[#335CFF] cursor-pointer">
            Solutions
          </span>
          <span className="text-sm font-semibold text-[#0D132D] hover:text-[#335CFF] cursor-pointer">
            Features
          </span>
          <span className="text-sm font-semibold text-[#0D132D] hover:text-[#335CFF] cursor-pointer">
            Pricing
          </span>
          <span className="text-sm font-semibold text-[#0D132D] hover:text-[#335CFF] cursor-pointer">
            Resources
          </span>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-semibold cursor-pointer px-5 py-2.5 rounded-xl text-[#0D132D] hover:bg-[#0D132D]/5 transition-colors"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/role")}
            className="bg-[#335CFF] text-white cursor-pointer text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-[#335CFF]/25 hover:-translate-y-0.5 transition-all"
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
