import React, { useState, useRef } from 'react'
import { RiCameraLine, RiImageAddLine } from 'react-icons/ri'
import LocationSelect from './LocationSelect'

export const PersonalDetails = ({ onNext }) => {
    const [location, setLocation] = useState({ country: '', state: '' });
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef();


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            // You can also save `file` to state if needed
        }
    };

    const handleContinue = (e) => {
    e.preventDefault();
    // Add validation if needed before proceeding
    onNext(); // move to next step
  };

    return (
            <div className="personal-details-container bg-white p-6 rounded-xl shadow-md text-inter">
                <h2 className="text-2xl font-semibold">Personal Details</h2>
                <p className="text-gray-600">Please provide your personal details to complete your profile.</p>

                <form className='mt-6' onSubmit={handleContinue}>
                    <div className="py-3 relative rounded-full w-34 h-34 border-2 border-dashed border-[#c8c9cb]">
                        <div className="relative w-28 h-28 rounded-full overflow-hidden bg-[#0D132D0D] hover:opacity-90 cursor-pointer border border-gray-100  mx-auto group">
                            {/* Preview Image */}
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Profile preview"
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                // Fallback camera icon
                                <div className="flex items-center justify-center w-full h-full text-gray-800 opacity-50">
                                    <RiImageAddLine className="w-8 h-8" />
                                </div>
                            )}

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="w-full">
                                <label htmlFor="name" className="mr-2 block">First Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="border p-3 rounded-xl border-gray-300 w-full disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                    disabled
                                    value={"Sandip"} />
                            </div>
                            <div className="w-full">
                                <label htmlFor="lastName" className="mr-2 block">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    className="border p-3 rounded-xl border-gray-300 w-full disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                    disabled
                                    value={"Kumar"} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mt-6">
                            {/* Gender Select */}
                            <div className="w-full">
                                <label htmlFor="gender" className="mr-2 block">Gender</label>
                                <select
                                    id="gender"
                                    className="block w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select</option>
                                    <option value="1">Male</option>
                                    <option value="2">Female</option>
                                </select>
                            </div>

                            {/* Birth Date Input */}
                            <div className="w-full">
                                <label htmlFor="birthDate" className="mr-2 block">Birth Date</label>
                                <input
                                    type="date"
                                    id="birthDate"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1  gap-6 mt-6 mt-6">
                            <div className="w-full">
                                <label htmlFor="address" className="mr-2 block">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    className="border p-3 rounded-xl border-gray-300 w-full"
                                />
                            </div>
                        </div>
                        <LocationSelect onChange={setLocation} />
                        <div className="grid grid-cols-1  gap-6 mt-6 mt-6">
                            <div className="w-full md:col-span-2">
                                <label htmlFor="bio" className="block mb-1">Bio</label>
                                <textarea
                                    id="bio"
                                    rows={4}
                                    placeholder="Tell us about yourself..."
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                        </div>

                        <button type='submit' className="mt-6 bg-[#121A3F] text-white px-8 py-3 rounded-full cursor-pointer hover:bg-[#0D132D] transition-colors">
                            Continue
                        </button>
                    </div>

                </form>
            </div>
    )
}
