import { RiCheckboxCircleFill, RiDeleteBin6Line, RiFacebookBoxFill, RiInstagramFill, RiMenLine, RiMoneyRupeeCircleLine, RiStackLine, RiTranslate, RiYoutubeFill } from '@remixicon/react';
import React from 'react'


const Requirements = [
    { label: 'Shopify User: ', value: 'Yes' },
    { label: 'Expectation: ', value: 'Post my existing content Lorem Ipsum is simply dummy text of the printing and typesetting industry...' },
    { label: 'Due Date: ', value: '11 Jul 2025' },
    { label: 'Ship Products: ', value: 'Yes' },
    { label: 'Target Country: ', value: 'India' },
    { label: 'Duration: ', value: '2 Months' },
    { label: 'Offers: ', value: 'Allow Influencer to make offers' },
]

const CampaignReviewStep = () => {
    return (
        <div className="w-full text-sm overflow-x-hidden">
            <h1 className='text-2xl font-semibold mb-4'>Review Campaign</h1>
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
                            <h2 className="font-semibold text-lg mb-1">Instagram Campaign</h2>
                            <p className="text-gray-500">Tiktokstar</p>


                            <div className="flex flex-wrap md:justify-around mt-3 gap-6 border border-gray-200 rounded-2xl p-4">
                                <div className="flex-row items-center gap-2 ">
                                    <div className='flex gap-2 items-center justify-center mb-2 text-gray-400'>
                                        <RiStackLine className="w-5" />
                                        <span> Platforms</span>
                                    </div>
                                    <p>Instagram Reels</p>
                                    <p>Youtube Video</p>
                                </div>
                                <div className="flex-row items-center justify-center gap-2 ">
                                    <div className='flex gap-2 items-center justify-center mb-2 text-gray-400'>
                                        <RiMoneyRupeeCircleLine className="w-5" />
                                        <span> Budget </span>
                                    </div>
                                    <p>$120/Reel</p>
                                </div>
                                <div className="flex-row items-center justify-center gap-2 ">
                                    <div className='flex gap-2 items-center justify-center mb-2 text-gray-400'>
                                        <RiTranslate className="w-5" />
                                        <span> Language </span>
                                    </div>
                                    <p>English</p>
                                    <p>Hindi</p>
                                    <p>Gujarati</p>
                                    <p>Maliyalam</p>
                                    <p>Telugu</p>
                                </div>
                                <div className="flex-row items-center justify-center gap-2">
                                    <div className='flex gap-2 items-center justify-center mb-2 text-gray-400'>
                                        <RiMenLine className="w-5" />
                                        <span> Gender </span>
                                    </div>
                                    <p>Male</p>
                                    <p>Female</p>
                                    <p>Othere</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl">
                        {/* Description */}
                        <div className="campaign-description py-4 border-b-1 border-gray-200">
                            <h3 className="font-semibold text-lg mb-2">Campaign Description</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry...
                            </p>
                        </div>

                        {/* Requirements */}
                        <div className="requirements py-4 border-b-1 border-gray-200">
                            <h3 className="font-semibold text-lg mb-4">Requirements</h3>
                            <ul className="space-y-2 text-gray-700">
                                {Requirements.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <RiCheckboxCircleFill />
                                        <span>
                                            {item.label} <strong>{item.value}</strong>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {["Fixed Price", "Expert", "Beauty", "Micro Influencer"].map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs">{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* References */}
                        <div className="references py-4 border-b-1 border-gray-200">
                            <h3 className="font-semibold mb-4 text-lg">References</h3>
                            <div className="flex gap-4">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="relative w-48 h-40 rounded-2xl overflow-hidden">
                                        <img
                                            src={`https://images.pexels.com/photos/32429493/pexels-photo-32429493.jpeg?_gl=1*bt0pi*_ga*MTYyNzc2NDMzNi4xNzM2MTY4MzY0*_ga_8JE65Q40S6*czE3NTU1OTExMTYkbzMkZzEkdDE3NTU1OTExMjIkajU0JGwwJGgw`}
                                            alt="Reference"
                                            className="w-full h-full object-cover"
                                        />
                                        <button className="absolute cursor-pointer top-2 right-2 bg-gray-100 bg-opacity-10 text-black p-2 rounded-full">
                                            <RiDeleteBin6Line className='w-4 h-4' />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
                    {/* Campaign Details */}
                    <div className="bg-white p-4 rounded-2xl">
                        <h3 className="font-semibold text-lg">Campaign Details</h3>
                        <div className="felx py-4 border-b-1 border-gray-200">
                            <p className='text-sm text-gray-500 mb-1'>Campaign Number</p>
                            <p>#251HJ8888410Kl</p>
                        </div>
                        <div className="felx py-4 border-b-1 border-gray-200">
                            <p className='text-sm text-gray-500 mb-1'>About Brand</p>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero eveniet magnam, fugit laboriosam aut vel possimus est quidem dolorem, dolores, natus cum in!</p>
                        </div>
                        <div className="felx py-4 border-b-1 border-gray-200">
                            <p className='text-sm text-gray-500 mb-1'>Delivery Date</p>
                            <p>22 June, 2025</p>
                        </div>
                        <div className="felx py-4 border-b-1 border-gray-200">
                            <p className='text-sm text-gray-500 mb-1'>Total Price</p>
                            <p>250R</p>
                        </div>
                    </div>

                    {/* Platform Info */}
                    <div className="bg-white p-4 rounded-2xl">
                        <h3 className="font-semibold text-lg mb-4">Platform</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <RiInstagramFill />
                                Instagram - Reel
                            </li>
                            <li className="flex items-center gap-2">
                                <RiYoutubeFill />
                                YouTube - Short Video
                            </li>
                            <li className="flex items-center gap-2">
                                <RiFacebookBoxFill />
                                Facebook - Post
                            </li>
                        </ul>
                    </div>


                </div>
            </div>
            {/* Buttons */}
            <div className="flex max-w-sm gap-3 mt-3">
                <button className="flex-1 bg-white border border-gray-300 text-gray-800 rounded-md py-2 hover:bg-gray-100">
                    Edit Campaign
                </button>
                <button className="flex-1 bg-gray-900 text-white rounded-md py-2 hover:bg-gray-800">
                    Create Campaign
                </button>
            </div>
        </div>
    );
}

export default CampaignReviewStep
