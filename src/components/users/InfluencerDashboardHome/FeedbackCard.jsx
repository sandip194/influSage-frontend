import React from 'react';
import 'remixicon/fonts/remixicon.css';

const feedbacks = [
  {
    id: 1,
    name: 'Brooklyn Simmons',
    time: '5 Mins Ago',
    rating: 4,
    feedback:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 2,
    name: 'Dianne Russell',
    time: '5 Mins Ago',
    rating: 4,
    feedback:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 3,
    name: 'Brooklyn Simmons',
    time: '5 Mins Ago',
    rating: 3,
    feedback:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
];

const FeedbackCard = () => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          Recent Feedbacks From Brands
        </h2>
        <button className="text-sm cursor-pointer text-gray-700 hover:underline">
          View All
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {feedbacks.map((fb) => (
          <div
            key={fb.id}
            className="border border-gray-200 rounded-2xl p-4 flex flex-col justify-between h-full"
          >
            {/* Rating */}
            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`ri-star-${i < fb.rating ? 'fill' : 'line'} text-lg sm:text-xl ${
                    i < fb.rating ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                ></i>
              ))}
            </div>

            {/* Feedback Text */}
            <p className="text-sm text-gray-700 mb-4 text-justify">{fb.feedback}</p>


            {/* Author Info */}
            <div className="flex items-center gap-3 mt-auto">
              <img
                src={fb.avatar}
                alt={fb.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm sm:text-base font-bold text-gray-800">{fb.name}</p>
                <p className="text-xs sm:text-sm text-gray-500">{fb.time}</p>
              </div>
            </div>  
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackCard;
