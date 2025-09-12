import React from 'react';

const TopContent = () => {
  const contentData = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=500", 
    views: "1.2k Views",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500", 
    views: "1.2k Views",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500", 
    views: "1.2k Views",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=500", 
    views: "1.2k Views",
  },
];

  return (
    <div className="bg-white rounded-2xl p-5 w-full">
      {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-lg font-bold text-gray-900">
            Top Content
          </h2>
          <div className="flex flex-wrap gap-2">
            <select className="border rounded-full px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
              <option>Instagram</option>
              <option>Facebook</option>
              <option>TikTok</option>
            </select>
            <select className="border rounded-full px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Yearly</option>
            </select>
          </div>
      </div>

      {/* Image cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {contentData.map((item) => (
          <div
            key={item.id}
            className="relative rounded-xl overflow-hidden group"
          >
            <img
              src={item.img}
              alt="content"
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full">
              {item.views}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopContent;
