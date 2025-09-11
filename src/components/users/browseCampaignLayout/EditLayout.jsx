import {
  RiMessage2Line,
  RiMenLine,
  RiMoneyRupeeCircleLine,
  RiStackLine,
  RiTranslate,
  RiArrowLeftSLine,
  RiStarLine,
  RiArrowRightSLine,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
  RiSendPlane2Line,
  RiAttachment2,
  RiEmotionLine,
  RiMoreFill,
} from "@remixicon/react";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SimilarCampaigns = [
  {
    name: "Instagram Campaign",
    brand: "Tiktokstar",
    image: "https://cdn-icons-png.flaticon.com/512/1384/1384063.png",
  },
  {
    name: "Tiktok Campaign",
    brand: "Tiktokstar",
    image: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
  },
  {
    name: "Youtube Campaign",
    brand: "Tiktokstar",
    image: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
  },
  {
    name: "Facebook Campaign",
    brand: "Tiktokstar",
    image: "https://cdn-icons-png.flaticon.com/512/1384/1384053.png",
  },
];

const EditLayout = () => {

  const [campaignDetails, setCampaignDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null);


  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { campaignId } = useParams();

  const fetchCampaignDetails = useCallback(async () => {
    if (!campaignId || !token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`user/applied-campaign-details/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.data[0];
      console.log(data)
      setCampaignDetails(data);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch campaign details.");
    } finally {
      setLoading(false);
    }
  }, [campaignId, token, BASE_URL]);

  useEffect(() => {
    fetchCampaignDetails();
  }, [fetchCampaignDetails]);

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);


  return (
    <div className="w-full max-w-7xl mx-auto text-sm overflow-x-hidden">
      <button
        onClick={handleBack}
        className="text-gray-600 flex items-center gap-2 hover:text-gray-900 transition"
      >
        <RiArrowLeftSLine /> Back
      </button>
      <h1 className="text-2xl font-semibold mb-4">Campaign Details</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Side */}
        <div className="flex-1 space-y-4">
          {/* Banner */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="relative h-40">
              <img
                src="https://images.pexels.com/photos/33350497/pexels-photo-33350497.jpeg?_gl=1*1dx09le*_ga*MTYyNzc2NDMzNi4xNzM2MTY4MzY0*_ga_8JE65Q40S6*czE3NTU1ODI1NDQkbzIkZzEkdDE3NTU1ODMzNzgkajUyJGwwJGgw"
                alt="Banner"
                className="w-full h-28 object-cover"
              />
              <img
                src="https://images.pexels.com/photos/25835001/pexels-photo-25835001.jpeg?_gl=1*vflnmv*_ga*MTYyNzc2NDMzNi4xNzM2MTY4MzY0*_ga_8JE65Q40S6*czE3NTU1ODI1NDQkbzIkZzEkdDE3NTU1ODI2ODEkajUwJGwwJGgw"
                alt="Logo"
                className="absolute rounded-full top-18 left-4 w-22 h-22 "
              />
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="font-semibold text-lg">
                      Instagram Campaign
                    </h2>
                    <p className="text-gray-500 text-sm">Tiktokstar</p>
                  </div>
                </div>

                {/* Right: Buttons */}
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-full border border-gray-300 text-gray-500 hover:text-black hover:border-gray-500">
                    <RiMessage2Line className="w-4 h-4" />
                  </button>
                  <button className="bg-[#0f122f] text-white font-semibold rounded-full px-6 py-2 hover:bg-[#23265a] transition">
                    Edit Application
                  </button>
                </div>
              </div>

              {/* Campaign Details Section */}
              <div className="flex flex-wrap md:justify-around mt-3 gap-6 border border-gray-200 rounded-2xl p-4">
                <div className="flex-row items-center gap-2">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiStackLine className="w-5" />
                    <span>Platform</span>
                  </div>
                  <p>Instagram Reels</p>
                  <p>Youtube Video</p>
                </div>
                <div className="flex-row items-center justify-center gap-2">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiMoneyRupeeCircleLine className="w-5" />
                    <span>Budget</span>
                  </div>
                  <p>$120-$150/Reel</p>
                </div>
                <div className="flex-row items-center justify-center gap-2">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiTranslate className="w-5" />
                    <span>Language</span>
                  </div>
                  <p>English</p>
                  <p>Hindi</p>
                  <p>Gujarati</p>
                  <p>Maliyalam</p>
                  <p>Telugu</p>
                </div>
                <div className="flex-row items-center justify-center gap-2">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiMenLine className="w-5" />
                    <span>Gender</span>
                  </div>
                  <p>Male</p>
                  <p>Female</p>
                  <p>Othere</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl">
            {/* Campaign Description */}
            <div>
              <h2 className="font-bold text-base mb-2">
                Campaign Description
              </h2>
              <p className="text-gray-600 mb-4 my-3">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
              <hr className="my-4 border-gray-200" />
              <button className="font-bold flex items-center gap-1 text-sm font-medium hovrer:underline">
                View Campaign Details <RiArrowRightSLine />
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl">
            {/* Proposed Terms */}
            <div>
              <h4 className="font-bold text-base mb-2">Your proposed terms</h4>
              <div className="flex flex-wrap md:justify-around mt-3 gap-6 border border-gray-200 rounded-2xl p-4">
                <div className="flex-row items-center gap-2">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiStackLine className="w-5" />
                    <span>Platform</span>
                  </div>
                  <p>Instagram Reels</p>
                  <p>Youtube Video</p>
                </div>
                <div className="flex-row items-center justify-center gap-2">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiMoneyRupeeCircleLine className="w-5" />
                    <span>Budget</span>
                  </div>
                  <p>$120-$150/Reel</p>
                </div>
                <div className="flex-row items-center justify-center gap-2">
                  <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                    <RiCalendarLine className="w-5" />
                    <span>Deadline</span>
                  </div>
                  <p>11 jun, 2025</p>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h3 className="font-semibold text-base mb-2 my-4">Milestones</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map((_, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl p-4 space-y-2"
                  >
                    <p className="text-gray-600 text-sm">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Read More...
                    </p>
                    <hr className="my-2 border-gray-200 my-3" />
                    <div className="flex items-center text-gray-500 text-sm gap-2">
                      <RiMoneyDollarCircleLine className="w-4 h-4" />
                      <span className="text-gray-800 font-medium my-3">
                        120.25 / Video
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm gap-2">
                      <RiCalendarLine className="w-4 h-4" />
                      <span className="text-gray-800 font-medium">
                        11 Jun, 2025
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-base mb-2 my-4">Description</h3>
              <p className="text-gray-600">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl mt-4">
            {/* Header */}
            <h2 className="font-bold text-base mb-2">Messages</h2>
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 my-4">
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

        {/* Right Side */}
        <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
          <div className="bg-white rounded-2xl p-4 shadow-sm w-full text-sm">
            <h3 className="font-semibold text-lg mb-4">About Brand</h3>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500">Brand Name</p>
                <p className="font-medium text-gray-900">Tiktokstar</p>
              </div>

              <hr className="my-4 border-gray-200" />

              <div>
                <p className="text-gray-500">Industry</p>
                <p className="font-medium text-gray-900">Health & Beauty</p>
              </div>

              <hr className="my-4 border-gray-200" />

              <div>
                <p className="text-gray-500">Brand Location</p>
                <p className="font-medium text-gray-900">India</p>
              </div>

              <hr className="my-4 border-gray-200" />

              <div>
                <p className="text-gray-500">Total Campaign Posted</p>
                <p className="font-medium text-gray-900">118 Campaign posted</p>
              </div>

              <hr className="my-4 border-gray-200" />

              <div>
                <p className="text-gray-500 mb-1">Reviews</p>
                <div className="flex items-center gap-2 text-gray-800">
                  <div className="flex">
                    <span>
                      <RiStarLine size={20} />
                    </span>
                    <span>
                      <RiStarLine size={20} />
                    </span>
                    <span>
                      <RiStarLine size={20} />
                    </span>
                    <span>
                      <RiStarLine size={20} />
                    </span>
                    <span>
                      <RiStarLine size={20} />
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">4.8</span>
                  <span className="text-gray-500">(1,245 Reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Campaigns */}
          <div className="bg-white rounded-2xl p-4 text-sm w-full">
            <h3 className="font-bold mb-4 text-base">Similar Campaigns</h3>
            <div className="space-y-4">
              {SimilarCampaigns.map((campaign, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3">
                    <img
                      src={campaign.image}
                      alt={campaign.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {campaign.name}
                      </p>
                      <p className="text-gray-500 text-xs">{campaign.brand}</p>
                    </div>
                  </div>
                  {index !== SimilarCampaigns.length - 1 && (
                    <hr className="my-3 border-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLayout;
