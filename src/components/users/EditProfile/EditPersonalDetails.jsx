import React, { useState, useRef } from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { RiImageAddLine } from 'react-icons/ri';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const EditPersonalDetails = () => {
  const [form] = Form.useForm();

  // Profile Image states
  const [preview, setPreview] = useState(null);
  const [profileError, setProfileError] = useState("");
  const fileInputRef = useRef(null);

  // Country/State/City mock states
  const [countries] = useState([{ name: "India" }, { name: "USA" }]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [loading] = useState({
    countries: false,
    states: false,
    cities: false,
  });

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setProfileError("Only image files are allowed.");
      return;
    }
    setProfileError("");
    setPreview(URL.createObjectURL(file));
  };

  // Mock fetch functions
  const fetchStates = (country) => {
    setStates([{ name: "Gujarat" }, { name: "Maharashtra" }]);
  };
  const fetchCities = (country, state) => {
    setCities(["Ahmedabad", "Surat", "Vadodara"]);
  };

  return (
    <div className="personal-details-container bg-white p-6 rounded-3xl text-inter">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Personal Details</h2>

      <Form form={form} layout="vertical" className="mt-6">
        {/* Profile Image Upload with Validation */}
        <Form.Item
          name="profileImage"
          valuePropName="file"
          rules={[{ required: true, message: "Please upload your profile photo" }]}
        >
          <div className="p-[10px] relative rounded-full w-36 h-36 border-2 border-dashed border-[#c8c9cb] my-3">
            <div className="relative m-auto w-30 h-30 rounded-full overflow-hidden bg-[#0D132D0D] hover:opacity-90 cursor-pointer border border-gray-100 group">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-800 opacity-50">
                  <RiImageAddLine className="w-8 h-8" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </Form.Item>
        
        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item name="firstName" label={<b>First Name</b>} rules={[{ required: true, message: "Please enter your First name" }]}>
            <Input size="large" placeholder="Firstname" className="rounded-xl" />
          </Form.Item>

          <Form.Item name="lastName" label={<b>Last Name</b>} rules={[{ required: true, message: "Please enter your Last name" }]}>
            <Input size="large" placeholder="Lastname" className="rounded-xl" />
          </Form.Item>
        </div>

        {/* Gender & DOB */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            name="gender"
            label={<b>Gender</b>}
            rules={[{ required: true, message: "Please select your gender" }]}
          >
            <Select size="large" placeholder="Select Gender" className="rounded-xl">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="birthDate"
            label={<b>Birth Date</b>}
            rules={[{ required: true, message: "Please select your birth date" }]}
          >
            <DatePicker
              size="large"
              className="w-full rounded-xl"
              format="DD-MM-YYYY"
              style={{ height: 40 }}
              disabledDate={(current) => current && current > dayjs().endOf("day")}
            />
          </Form.Item>
        </div>

        {/* Address */}
        <Form.Item
          name="address"
          label={<b>Address</b>}
          rules={[{ required: true, message: "Please enter your address" }]}
        >
          <Input size="large" placeholder="Enter your address" className="rounded-xl" />
        </Form.Item>

        {/* Country / State / City */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Country */}
          <Form.Item
            label={<b>Country</b>}
            name="country"
            rules={[{ required: true, message: "Please select a country" }]}
          >
            <Select
              showSearch
              size="large"
              placeholder="Select Country"
              onChange={(val) => {
                setSelectedCountry(val);
                form.setFieldsValue({ state: undefined, city: undefined });
                fetchStates(val);
              }}
              loading={loading.countries}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {countries.map((country) => (
                <Option key={country.name} value={country.name}>
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* State */}
          <Form.Item
            label={<b>State</b>}
            name="state"
            rules={[{ required: true, message: "Please select a state" }]}
          >
            <Select
              showSearch
              size="large"
              placeholder="Select State"
              onChange={(val) => {
                setSelectedState(val);
                form.setFieldsValue({ city: undefined });
                fetchCities(selectedCountry, val);
              }}
              disabled={!selectedCountry}
              loading={loading.states}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {states.map((state) => (
                <Option key={state.name} value={state.name}>
                  {state.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* City */}
          <Form.Item label={<b>City</b>} name="city">
            <Select
              showSearch
              size="large"
              placeholder="Select City"
              disabled={!selectedState}
              loading={loading.cities}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {cities.map((city, i) => (
                <Option key={i} value={city}>
                  {city}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* ZIP Code */}
        <Form.Item
          label={<b>ZIP / PIN Code</b>}
          name="zipCode"
          rules={[{ required: true, message: "Please enter your ZIP or PIN Code" }]}
          className="md:col-span-3"
        >
          <Input size="large" placeholder="Enter ZIP or PIN" className="rounded-xl" />
        </Form.Item>

        {/* Bio */}
        <Form.Item name="bio" label={<b>Bio</b>}>
          <TextArea
            rows={4}
            showCount
            maxLength={100}
            placeholder="Tell us about yourself..."
            className="rounded-xl"
          />
        </Form.Item>

         {/* Submit Button */}
        <button
          className="bg-[#121A3F] text-white cursor-pointer inset-shadow-sm inset-shadow-gray-500 px-8 py-3 rounded-full hover:bg-[#0D132D]"
        >
          Save Changes
        </button>
      </Form>
    </div>
  );
};

export default EditPersonalDetails;
