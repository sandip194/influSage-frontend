import { RiCheckLine, RiUser2Line } from '@remixicon/react';

export function SuccessCard({ title, iconColor = 'text-gray-900', features }) {
  return (
    <div className="bg-white shadow rounded p-6 flex-1">
      <h3 className={`font-semibold mb-4 flex items-center gap-2 ${iconColor}`}>
        <RiUser2Line size={20} />
        {title}
      </h3>
      <ul className="space-y-2 text-sm text-gray-600">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <RiCheckLine className="text-green-500" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
