
import axios from "axios";
import { useEffect, useState } from "react";
import {
    RiStackLine,
    RiMoneyRupeeCircleLine,
    RiTranslate,
    RiMenLine,
    RiCheckLine,
    RiDeleteBin6Line,
    RiCloseLine,
} from "react-icons/ri";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";



const CampaignDetailsView = () => {

    const { campaignId } = useParams();
    const { token } = useSelector((state) => state.auth);

    const [cmapignDetails, setCampaignDetails] = useState(null)
    const [loading, setLoading] = useState(false)

    const getCamapignDetails = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`/vendor/campaign/${campaignId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log(res.status)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        getCamapignDetails()
    },[])

    return (
        <div className="w-full text-sm overflow-x-hidden bg-gray-50">
            <h1 className="text-2xl font-semibold mb-4">View Campaign Details</h1>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* LEFT SIDE */}
                <div className="flex-1 space-y-4">
                    {/* Banner */}
                    <div className="bg-white rounded-2xl overflow-hidden">
                        <div className="relative h-40">
                            <img
                                src="https://via.placeholder.com/600x112"
                                alt="Banner"
                                className="w-full h-28 object-cover rounded-lg"
                            />
                            <img
                                src="https://via.placeholder.com/80"
                                alt="Campaign"
                                className="absolute object-cover rounded-full top-12 left-4 w-22 h-22"
                            />
                        </div>
                        <div className="p-4">
                            <h2 className="font-semibold text-lg mb-1">Sample Campaign</h2>
                            <p className="text-gray-500">Brand Details Here</p>

                            <div className="flex flex-wrap md:justify-around mt-3 gap-6 border border-gray-200 rounded-2xl p-4">
                                {/* Platforms */}
                                <div>
                                    <div className="flex gap-2 items-center mb-2 text-gray-500">
                                        <RiStackLine className="w-5" />
                                        <span> Platforms</span>
                                    </div>
                                    <p>Instagram</p>
                                    <p>Youtube</p>
                                </div>

                                {/* Budget */}
                                <div>
                                    <div className="flex gap-2 items-center mb-2 text-gray-500">
                                        <RiMoneyRupeeCircleLine className="w-5" />
                                        <span> Budget </span>
                                    </div>
                                    <p>₹50,000</p>
                                </div>

                                {/* Languages */}
                                <div>
                                    <div className="flex gap-2 items-center mb-2 text-gray-500">
                                        <RiTranslate className="w-5" />
                                        <span> Languages </span>
                                    </div>
                                    <p>English</p>
                                    <p>Hindi</p>
                                </div>

                                {/* Gender */}
                                <div>
                                    <div className="flex gap-2 items-center mb-2 text-gray-500">
                                        <RiMenLine className="w-5" />
                                        <span> Gender </span>
                                    </div>
                                    <p>Male</p>
                                    <p>Female</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description + Requirements */}
                    <div className="bg-white p-4 rounded-2xl">
                        {/* Categories */}
                        <div className="py-4 border-b border-gray-200">
                            <p className="font-semibold text-lg mb-2">Categories</p>
                            <div className="flex flex-wrap gap-2 my-2">
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                    Fashion
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                    Lifestyle
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="campaign-description py-4 border-b border-gray-200">
                            <h3 className="font-semibold text-lg mb-2">Campaign Description</h3>
                            <p className="text-gray-700 leading-relaxed text-justify">
                                This is a sample campaign description. Details about the campaign goals and expectations go here.
                            </p>
                        </div>

                        {/* Requirements */}
                        <div className="requirements py-4 border-b border-gray-200">
                            <h3 className="font-semibold text-lg mb-4">Requirements</h3>
                            <ul className="space-y-2 font-semibold">
                                <li className="flex items-center gap-2">
                                    <RiCheckLine size={20} className="text-gray-900 flex-shrink-0 border rounded" />
                                    <span>Post Duration: <span className="text-gray-500">7 days</span></span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <RiCheckLine size={20} className="text-gray-900 flex-shrink-0 border rounded" />
                                    <span>Include Vendor Profile Link: <span className="text-gray-500">Yes</span></span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <RiCheckLine size={20} className="text-gray-900 flex-shrink-0 border rounded" />
                                    <span>Product Shipping: <span className="text-gray-500">No</span></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
                    <div className="bg-white p-4 rounded-2xl">
                        <h3 className="font-semibold text-lg">Campaign Details</h3>
                        <hr className="my-2 border-gray-200" />
                        <div className="py-2 border-b border-gray-200">
                            <p className="text-sm mb-1 font-semibold">Campaign Dates</p>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm font-semibold mb-1 my-2">Start Date</p>
                                    <p className='text-gray-500'>01-11-2025</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold mb-1 my-2">End Date</p>
                                    <p className='text-gray-500'>30-11-2025</p>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 pb-2">
                            <p className="text-sm font-semibold mb-1">Total Budget</p>
                            <p className='text-gray-500'>₹50,000</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default CampaignDetailsView




