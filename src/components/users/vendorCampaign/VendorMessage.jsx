import React from 'react';
import {
  RiMoreFill,
  RiStarLine,
  RiEmotionLine,
  RiAttachment2,
  RiSendPlane2Line,
} from '@remixicon/react';


const VendorMessage = () => {

  return (
    <div>
      {/* Message Section */}
      <div className="bg-white p-4 rounded-2xl mt-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900">John Doe</h3>
              <p className="text-xs text-gray-500">
                Last Seen : 45 Mins Ago
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RiStarLine className="text-gray-500 w-5 h-5" />
            <RiMoreFill className="text-gray-500 w-5 h-5" />
          </div>
        </div>

        {/* Chat Body */}
        <div className="py-4 space-y-6">
          {/* Message - Left */}
          <div className="flex items-start gap-3">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="John"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-xs text-gray-500 mb-1">John Doe</p>
              <div className="bg-gray-100 px-4 py-2 rounded-xl inline-block text-gray-800">
                Hi How Are You?
              </div>
              <p className="text-[11px] text-gray-400 mt-1">12:28 PM</p>
            </div>
          </div>

          {/* Message - Right */}
          <div className="flex items-end justify-end">
            <div className="text-right">
              <div className="bg-[#0f122f] text-white px-4 py-2 rounded-xl inline-block">
                Nice to Meet you. Let's talk about the project
              </div>
              <p className="text-[11px] text-gray-400 mt-1">12:28 PM</p>
            </div>
            <img
              src="https://randomuser.me/api/portraits/men/76.jpg"
              alt="Me"
              className="w-8 h-8 rounded-full ml-2"
            />
          </div>

          {/* Message - Left with image */}
          <div className="flex items-start gap-3">
            <img
              src="https://randomuser.me/api/portraits/men/33.jpg"
              alt="Sean"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-xs text-gray-500 mb-1">Sean Smith</p>
              <div className="bg-gray-100 p-3 rounded-xl max-w-xs space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <img
                    src="https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg"
                    className="w-full h-20 object-cover rounded-lg"
                    alt="attached"
                  />
                  <img
                    src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                    className="w-full h-20 object-cover rounded-lg"
                    alt="attached"
                  />
                  <img
                    src="https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg"
                    className="w-full h-20 object-cover rounded-lg"
                    alt="attached"
                  />
                  <img
                    src="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg"
                    className="w-full h-20 object-cover rounded-lg"
                    alt="attached"
                  />
                </div>
                <p className="text-gray-800 text-sm mt-2">
                  Here is the screenshot attached for it
                </p>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">12:28 PM</p>
            </div>
          </div>

          {/* Message - Right */}
          <div className="flex items-end justify-end">
            <div className="text-right">
              <div className="bg-[#0f122f] text-white px-4 py-2 rounded-xl inline-block">
                Thanks for sharing the details
              </div>
              <p className="text-[11px] text-gray-400 mt-1">12:28 PM</p>
            </div>
            <img
              src="https://randomuser.me/api/portraits/men/76.jpg"
              alt="Me"
              className="w-8 h-8 rounded-full ml-2"
            />
          </div>
        </div>

        {/* Input Box */}
        <div className="pt-3">
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
            <input
              type="text"
              placeholder="Write Your Message"
              className="flex-1 bg-transparent focus:outline-none text-sm placeholder-gray-500"
            />
            <div className="flex items-center gap-3 ml-2">
              <RiEmotionLine className="text-gray-500 w-5 h-5 cursor-pointer" />
              <RiAttachment2 className="text-gray-500 w-5 h-5 cursor-pointer" />
              <button className="bg-[#0f122f] text-white p-2 rounded-full">
                <RiSendPlane2Line className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorMessage;
