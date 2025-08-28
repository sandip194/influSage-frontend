import { useState } from 'react'
import { RiCheckLine } from 'react-icons/ri';

export const Home = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="p-6 flex gap-6">
      <div
        onClick={() => setChecked(!checked)}
        className={`flex w-100 justify-between items-center p-4 rounded border cursor-pointer transition-all ${checked ? "bg-[#0D132DE5] border-[#0D132DE5]" : "bg-white border-gray-300"
          }`}
      >
        <span className={`text-md ${checked ? "text-white" : "text-black"}`}>
          Checkbox 
        </span>

        {/* Custom Checkbox Icon */}
        <div
          className={`w-5 h-5 flex items-center justify-center rounded-full border transition-all ${checked
              ? "bg-white border-[#13297E] text-[#335CFFBF]"
              : "bg-transparent border-gray-400"
            }`}
        >
          {checked && <RiCheckLine />}
        </div>
      </div>

      <div
        onClick={() => setChecked(!checked)}
        className={`flex w-100 justify-between items-center p-4 rounded border cursor-pointer transition-all ${checked ? "bg-[#0D132D26] border-[#0D132DBF]" : "bg-white border-gray-300"
          }`}
      >
        <span className={`text-md ${checked ? "text-[#0D132D]" : "text-black"}`}>
          Checkbox 
        </span>

        {/* Custom Checkbox Icon */}
        <div
          className={`w-5 h-5 flex items-center justify-center rounded-full border transition-all ${checked
              ? "bg-[#0D132D] border-[#0D132D] text-white"
              : "bg-transparent border-gray-400"
            }`}
        >
          {checked && <RiCheckLine />}
        </div>
      </div>
    </div>

  );
}

export default Home;




