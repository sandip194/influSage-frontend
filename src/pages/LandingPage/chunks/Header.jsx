import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function Header() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    // Detect scroll to adjust background and button visibility
    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 30);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/10 backdrop-blur-md shadow-sm"
                    : "bg-white/10 backdrop-blur-md"
                }`}
        >
            <div className="px-2 sm:px-4 md:px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    <img
                        src="/influSage-logo.png"
                        alt="InfluSage Logo"
                        className={`h-9 w-auto object-contain transition-all duration-300 ${scrolled ? "" : "filter brightness-0 invert"
                            }`}
                    />

                </div>

                {/* Buttons */}
                <div className="space-x-3">
                    <button
                        onClick={() => navigate("/login")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${scrolled
                                ? "text-gray-800 border border-gray-300 hover:bg-gray-100"
                                : "text-white border border-white/40 hover:bg-white/20"
                            }`}
                    >
                        Login
                    </button>

                    <button
                        onClick={() => navigate("/role")}
                        className="px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 text-sm font-semibold hover:bg-yellow-300 transition-all"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </header>
    );
}
