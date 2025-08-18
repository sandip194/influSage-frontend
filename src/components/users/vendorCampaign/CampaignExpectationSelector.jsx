import React, { useEffect, useState } from 'react';
import { Input } from 'antd';

const options = [
  {
    id: '1',
    text: 'Post my existing content (video & Images) on their social media without creating any content on their own',
  },
  {
    id: '2',
    text: 'Create content (Video or Images) on their own as well as publishing them on their social media',
  },
  {
    id: '3',
    text: 'Only create content (Video or Images) for me.',
  },
];

const CampaignExpectationSelector = ({ data, onNext }) => {
  const [selected, setSelected] = useState(data?.contentExpectation || '');
  const [durationDays, setDurationDays] = useState(data?.durationDays || '');
  const [addLinkToBio, setAddLinkToBio] = useState(
    typeof data?.addLinkToBio === 'boolean' ? data.addLinkToBio : null
  );

  const [errors, setErrors] = useState({
    contentExpectation: false,
    durationDays: false,
    addLinkToBio: false,
  });

  useEffect(() => {
    if (data?.contentExpectation) setSelected(data.contentExpectation);
    if (data?.durationDays) setDurationDays(data.durationDays);
    if (typeof data?.addLinkToBio === 'boolean') setAddLinkToBio(data.addLinkToBio);
  }, [data]);

  const handleContinue = () => {
    const newErrors = {
      contentExpectation: !selected,
      durationDays: !durationDays || isNaN(durationDays) || Number(durationDays) <= 0,
      addLinkToBio: addLinkToBio === null,
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e);

    if (hasError) return;

    onNext({
      contentExpectation: selected,
      durationDays: Number(durationDays),
      addLinkToBio,
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl">
      {/* Content Expectation */}
      <h2 className="text-xl font-semibold mb-6">
        What do you expect influencers to do for your campaign?
      </h2>

      <div className="space-y-2 mb-1">
        {options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => {
              setSelected(opt.id);
              setErrors((prev) => ({ ...prev, contentExpectation: false }));
            }}
            className={`px-5 py-3 rounded-xl border cursor-pointer ${
              selected === opt.id ? 'border-gray-800 bg-gray-50' : 'border-gray-200'
            }`}
          >
            {opt.text}
          </div>
        ))}
      </div>
      {errors.contentExpectation && (
        <div className="text-red-500 text-sm mb-4">Please select at least one option</div>
      )}

      <hr className="my-6 border-gray-200" />

      {/* Post Duration */}
      <h2 className="text-xl font-semibold mb-4">
        How long would you like the post to stay on the influencer’s social accounts?
      </h2>
      <div className="flex items-center gap-2 mb-2">
        <Input
          type="number"
          min={1}
          value={durationDays}
          onChange={(e) => {
            setDurationDays(e.target.value);
            setErrors((prev) => ({ ...prev, durationDays: false }));
          }}
          style={{ width: 100 }}
          placeholder="Enter"
        />
        <span className="text-sm font-medium">Days</span>
      </div>
      {errors.durationDays && (
        <div className="text-red-500 text-sm mb-4">Please enter a valid number of days</div>
      )}

      <hr className="my-6 border-gray-200" />

      {/* Add Link to Bio */}
      <h2 className="text-xl font-semibold mb-4">
        Would you like to have influencers add your link in their bio when publishing your campaign?
      </h2>
      <div className="flex gap-4 mb-2">
        {[{ label: 'Yes', value: true }, { label: 'No', value: false }].map(({ label, value }) => (
          <button
            key={label}
            onClick={() => {
              setAddLinkToBio(value);
              setErrors((prev) => ({ ...prev, addLinkToBio: false }));
            }}
            className={`border px-6 py-2 rounded-xl capitalize ${
              addLinkToBio === value ? 'border-[#0D132D] font-semibold' : 'border-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {errors.addLinkToBio && (
        <div className="text-red-500 text-sm mb-4">Please select Yes or No</div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          className="bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
          disabled
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="bg-[#121A3F] text-white cursor-pointer inset-shadow-sm inset-shadow-gray-500 px-8 py-3 rounded-full hover:bg-[#0D132D]"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CampaignExpectationSelector;
