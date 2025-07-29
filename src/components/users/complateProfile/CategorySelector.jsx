import React, { useState, useEffect } from 'react';
import { CheckOutlined } from '@ant-design/icons';

const categories = [
  { key: 'beauty', name: 'Beauty', image: './public/assets/imgs/beauty.png' },
  { key: 'fashion', name: 'Fashion', image: './public/assets/imgs/fashion.png' },
  { key: 'technology', name: 'Technology', image: './public/assets/imgs/technology.png' },
  { key: 'fitness', name: 'Fitness', image: './public/assets/imgs/fitness.png' },
  { key: 'gaming', name: 'Gaming', image: './public/assets/imgs/gaming.png' },
  { key: 'health', name: 'Health', image: './public/assets/imgs/health.png' },
  { key: 'cooking', name: 'Cooking', image: './public/assets/imgs/cooking.png' },
  { key: 'travel', name: 'Travel', image: './public/assets/imgs/travel.png' },
];

export const CategorySelector = ({ onBack, onNext }) => {
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("selectedCategories");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSelected(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved categories", e);
      }
    }
  }, []);

  const toggleCategory = (key) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
    setError(false);
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      setError(true);
      return;
    }
    localStorage.setItem("selectedCategories", JSON.stringify(selected)); // ✅ Save
    setError(false);
    console.log('Selected Categories:', selected);
    if (onNext) onNext();
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Categories</h2>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">Choose Categories as per your preferences</p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-8">
        {categories.map((cat) => (
          <div
            key={cat.key}
            className={`relative rounded-3xl overflow-hidden cursor-pointer group h-22 sm:h-26 md:h-28 lg:h-34`}
            onClick={() => toggleCategory(cat.key)}
          >
            <img
              src={cat.image}
              alt={cat.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                selected.includes(cat.key) ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'
              }`}
            />
            <div className="absolute inset-0 bg-[#00000054] bg-opacity-40 flex p-3 items-end justify-start">
              <p className="text-white text-md font-semibold">{cat.name}</p>
            </div>
            {selected.includes(cat.key) && (
              <div className="absolute top-3 right-3 bg-white rounded px-1">
                <CheckOutlined className="text-black text-lg" />
              </div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="text-red-500 text-sm font-base">
          Please select at least one category to continue.
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 ">
        <button
          onClick={onBack}
          className="bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#121A3F] text-white cursor-pointer inset-shadow-sm inset-shadow-gray-500 px-8 py-3 rounded-full hover:bg-[#0D132D]"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
