
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

    useEffect(() => {
        getCamapignDetails()
    }, [])

    return (
        <div className="w-full text-sm overflow-x-hidden bg-gray-50">
            <h1 className="text-2xl font-semibold mb-4">View Campaign Details</h1>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* LEFT SIDE */}
                <div className="flex-1 space-y-4">
                    {/* Campaign Header */}
                    <div className="bg-white rounded-2xl overflow-hidden">
                        {/* Banner placeholder */}
                        <div className="relative h-40 bg-gray-200">
                            <img
                                src={cmapignDetails?.photoPath}
                                alt="Logo"
                                className="absolute rounded-full top-14 left-4 w-20 h-20 border-4 border-white object-cover"
                            />
                        </div>

                        <div className="p-4">
                            {/* Title + Buttons Row */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                                <div>
                                    <h2 className="font-semibold text-lg">{cmapignDetails?.name || "Sample Campaign"}</h2>
                                    <p className="text-gray-500 text-sm">{cmapignDetails?.businessName || "ABC Marketing Pvt. Ltd."}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                                    <button
                                        type="button"
                                        className="w-full sm:w-auto bg-green-600 text-white font-semibold rounded-full px-6 py-2 hover:bg-green-700 transition"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        type="button"
                                        className="w-full sm:w-auto bg-red-500 text-white font-semibold rounded-full px-6 py-2 hover:bg-red-600 transition"
                                    >
                                        Reject
                                    </button>

                                    <button
                                        type="button"
                                        className="w-full sm:w-auto bg-gray-700 text-white font-semibold rounded-full px-6 py-2 hover:bg-gray-800 transition"
                                    >
                                        Block
                                    </button>
                                </div>
                            </div>

                            {/* Campaign Info Grid */}
                            <div className="flex flex-wrap justify-between gap-6 border border-gray-200 rounded-2xl p-4">
                                <div>
                                    <div className="flex gap-2 items-center text-gray-400 mb-2">
                                        <RiMoneyRupeeCircleLine className="w-5" />
                                        <span>Budget</span>
                                    </div>
                                    <p>₹{cmapignDetails?.estimatedBudget || "50,000"}</p>
                                </div>

                                <div>
                                    <div className="flex gap-2 items-center text-gray-400 mb-2">
                                        <RiTranslate className="w-5" />
                                        <span>Languages</span>
                                    </div>
                                    {cmapignDetails?.campaignLanguages?.map((lang) => (
                                        <p key={lang.languageId}>{lang.languageName}</p>
                                    )) || <p>English, Hindi</p>}
                                </div>

                                <div>
                                    <div className="flex gap-2 items-center text-gray-400 mb-2">
                                        <RiMenLine className="w-5" />
                                        <span>Gender</span>
                                    </div>
                                    {cmapignDetails?.campaignGenders?.map((gender) => (
                                        <p key={gender.genderId}>{gender.genderName}</p>
                                    )) || <p>Male, Female</p>}
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

                    {/* Vendor Info Card */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <h3 className="font-semibold text-lg">Vendor Details</h3>
                        <hr className="my-2 border-gray-200" />

                        {/* Profile Section */}
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src="https://images.pexels.com/photos/34547643/pexels-photo-34547643.jpeg?_gl=1*1g07vmo*_ga*MTc1NTg2NDU4MC4xNzYxNzIyNDQ3*_ga_8JE65Q40S6*czE3NjIzMjE3OTYkbzIkZzEkdDE3NjIzMjE4MjckajI5JGwwJGgw"
                                alt="Vendor Profile"
                                className="w-16 h-16 rounded-full object-cover border"
                            />
                            <div>
                                <p className="text-base font-semibold">John Doe</p>
                                <p className="text-sm text-gray-500">Vendor</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-semibold">Business Name</p>
                                <p className="text-gray-500">ABC Marketing Pvt. Ltd.</p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold">Email</p>
                                <p className="text-gray-500 break-words">johndoe@example.com</p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold">Phone</p>
                                <p className="text-gray-500">+91 9876543210</p>
                            </div>

                            <div className="pt-2 border-t border-gray-200">
                                <p className="text-sm font-semibold">Total Campaigns</p>
                                <p className="text-gray-500">12</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default CampaignDetailsView




