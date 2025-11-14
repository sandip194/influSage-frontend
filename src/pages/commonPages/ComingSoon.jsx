import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center  px-6">

      {/* Animated Illustration */}
      <motion.img
        src="https://cdn.pixabay.com/photo/2019/08/12/11/38/under-construction-4401023_1280.png" 
        alt="Under Construction Illustration"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          y: [0, -10, 0], // floating animation
        }}
        transition={{
          opacity: { duration: 0.8 },
          y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
        }}
        className="w-20 md:w-32"
      />

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-[#0D132D] mt-6"
      >
        Something Awesome Is Coming
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="text-gray-600 max-w-md text-center mt-3"
      >
        We’re actively working on this feature.  
        It will be available soon — stay tuned!
      </motion.p>

      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-8 px-7 py-2.5 bg-[#0D132D] text-white rounded-full 
                   font-medium shadow-lg hover:bg-[#151c3c] transition-all"
      >
        Go Back
      </motion.button>
    </div>
  );
}
