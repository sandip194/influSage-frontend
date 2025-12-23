import { useSelector } from "react-redux";

const GlobalLoader = () => {
  const loadingCount = useSelector((state) => state.ui.loadingCount);

  if (loadingCount === 0) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/30 flex items-center justify-center">
      <div className="grid grid-cols-2 gap-2">
        {/* Dot 1 (Red) */}
        <span className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />

        {/* Dot 2 */}
        <span className="w-4 h-4 rounded-full bg-black animate-[pulse_1.2s_ease-in-out_infinite_150ms]" />

        {/* Dot 3 */}
        <span className="w-4 h-4 rounded-full bg-black animate-[pulse_1.2s_ease-in-out_infinite_300ms]" />

        {/* Dot 4 */}
        <span className="w-4 h-4 rounded-full bg-black animate-[pulse_1.2s_ease-in-out_infinite_450ms]" />
      </div>
    </div>
  );
};

export default GlobalLoader;
