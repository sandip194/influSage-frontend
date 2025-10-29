import { ReactNode } from 'react';

export function HowItWorksStep({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center gap-1 max-w-xs text-center border-b border-gray-200 p-4 rounded-2xl">
      <div className="text-gray-400">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}
