import { RiCheckLine, RiUser2Line } from '@remixicon/react';

export function SuccessCard({ title, iconColor = 'text-gray-900', features }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 flex-1 transition-shadow hover:shadow-indigo-300">
      <h3 className={`font-extrabold text-xl mb-6 flex items-center gap-3 ${iconColor} tracking-wide`}>
        <RiUser2Line size={24} />
        {title}
      </h3>
      <ul className="space-y-4 text-gray-600 text-base leading-relaxed">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <RiCheckLine className="text-indigo-500 mt-1" size={20} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
