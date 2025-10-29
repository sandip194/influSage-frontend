
export function HowItWorksStep({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center max-w-xs text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-indigo-300 transition-shadow duration-300">
      <div>{icon}</div>
      <h3 className="font-extrabold text-xl mt-6 mb-3 text-gray-900 tracking-wide">
        {title}
      </h3>
      <p className="text-gray-600 text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
}

