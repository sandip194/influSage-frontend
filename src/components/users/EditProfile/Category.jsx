import React, { useState } from 'react';
import { CheckOutlined } from '@ant-design/icons';

const categories = [
  { key: "beauty", name: "Beauty", image: "/assets/imgs/beauty.png" },
  { key: "fashion", name: "Fashion", image: "/assets/imgs/fashion.png" },
  { key: "technology", name: "Technology", image: "/assets/imgs/technology.png" },
  { key: "fitness", name: "Fitness", image: "/assets/imgs/fitness.png" },
  { key: "gaming", name: "Gaming", image: "/assets/imgs/gaming.png" },
  { key: "health", name: "Health", image: "/assets/imgs/health.png" },
  { key: "cooking", name: "Cooking", image: "/assets/imgs/cooking.png" },
  { key: "travel", name: "Travel", image: "/assets/imgs/travel.png" },
];

const Category = () => {
  const [selected, setSelected] = useState([]);

  const toggleCategory = (key) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Categories
      </h2>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        Choose Categories as per your preferences
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {categories.map((cat) => (
          <div
            key={cat.key}
            className="relative rounded-3xl overflow-hidden cursor-pointer group h-24 sm:h-28 md:h-32 lg:h-36"
            onClick={() => toggleCategory(cat.key)}
          >
            <img
              src={cat.image}
              alt={cat.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                selected.includes(cat.key)
                  ? "opacity-100"
                  : "opacity-30 group-hover:opacity-100"
              }`}
            />
            <div className="absolute inset-0 bg-[#00000054] flex p-3 items-end justify-start">
              <p className="text-white text-md font-semibold">{cat.name}</p>
            </div>
            {selected.includes(cat.key) && (
              <div className="absolute top-3 right-3 bg-white rounded px-1 shadow">
                <CheckOutlined className="text-black text-lg" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button className="bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors">
          Back
        </button>
        <button className="bg-[#121A3F] text-white cursor-pointer px-8 py-3 rounded-full hover:bg-[#0D132D] transition">
          Continue
        </button>
      </div>
    </div>
  );
};

export default Category;
