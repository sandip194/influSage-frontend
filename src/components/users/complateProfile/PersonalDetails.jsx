import React, { useState, useRef } from 'react';
import { Input, DatePicker, Select, Button } from 'antd';
import { RiImageAddLine } from 'react-icons/ri';
import LocationSelect from './LocationSelect';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

export const PersonalDetails = ({ onNext }) => {
  const [location, setLocation] = useState({ country: '', state: '', city: '' });
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    onNext(); // go to next step
  };

  return (
    <div className="personal-details-container bg-white p-6 rounded-3xl text-inter">
      <h2 className="text-2xl font-semibold">Personal Details</h2>
      <p className="text-gray-600">Please provide your personal details to complete your profile.</p>

      <form className="mt-6" onSubmit={handleContinue}>
        {/* Profile image upload */}
        <div className="p-[10px] relative rounded-full w-36 h-36 border-2 border-dashed border-[#c8c9cb]">
          <div className="relative m-auto w-30 h-30 rounded-full overflow-hidden bg-[#0D132D0D] hover:opacity-90 cursor-pointer border border-gray-100 
           group">
            {preview ? (
              <img src={preview} alt="Profile preview" className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-800 opacity-50">
                <RiImageAddLine className="w-8 h-8" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* First Name */}
          <div className="w-full">
            <label className="block mb-1">First Name</label>
            <Input
              id="firstName"
              size='large'
              value="Sandip"
              disabled
              className="rounded-xl"
            />
          </div>

          {/* Last Name */}
          <div className="w-full">
            <label className="block mb-1">Last Name</label>
            <Input
              id="lastName"
              value="Kumar"
              size='large'
              disabled
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Gender */}
          <div className="w-full">
            <label className="block mb-1">Gender</label>
            <Select
              size='large'
              id="gender"
              placeholder="Select Gender"
              className="w-full rounded-xl"
            >
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </div>

          {/* Birth Date */}
          <div className="w-full">
            <label className="block mb-1">Birth Date</label>
            <DatePicker
              id="birthDate"

              className="w-full rounded-xl"
              style={{ height: 40 }} // match height with inputs
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current > dayjs().endOf('day')}
            />
          </div>
        </div>

        {/* Address */}
        <div className="mt-6">
          <label className="block mb-1">Address</label>
          <Input
            id="address"
            size='large'
            placeholder="Enter your address"
            className="w-full rounded-xl"
          />
        </div>

        {/* Location Select */}
        <div className="mt-6">
          <LocationSelect onChange={setLocation} />
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className="block mb-1">Bio</label>
          <TextArea
            id="bio"
            size='large'
            rows={4}
            showCount
            maxLength={100}
            placeholder="Tell us about yourself..."
            className="rounded-xl"
          />
        </div>

        {/* Continue Button */}
        
        <button
          type='submit'
          className="mt-6 bg-[#121A3F] cursor-pointer text-white px-8 py-3 rounded-full hover:bg-[#0D132D] transition-colors"
        >
          Continue
        </button>
      </form>
    </div>
  );
};
