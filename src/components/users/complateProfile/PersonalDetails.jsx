import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Button, message } from 'antd';
import { RiImageAddLine } from 'react-icons/ri';
import dayjs from 'dayjs';
import axios from "axios";
import postalRegexList from './postalRegex.json'
import { useSelector } from 'react-redux';

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const { TextArea } = Input;
const { Option } = Select;



export const PersonalDetails = ({ onNext, data, onChange }) => {


  const [form] = Form.useForm();
  const [preview, setPreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState({ countries: false, states: false, cities: false });

  const { token, userId, firstName, lastName } = useSelector(state => state.auth);


  const countryAPI = "https://countriesnow.space/api/v0.1/countries/positions";
  const stateAPI = "https://countriesnow.space/api/v0.1/countries/states";
  const cityAPI = "https://countriesnow.space/api/v0.1/countries/state/cities";

  const getRegexForCountry = (iso) => {
    const entry = postalRegexList.find(e => e.ISO === iso);
    return entry?.Regex ? new RegExp(entry.Regex) : null;
  };

  useEffect(() => {
    setLoading(prev => ({ ...prev, countries: true }));
    axios.get(countryAPI)
      .then(res => setCountries(res.data.data))
      .finally(() => setLoading(prev => ({ ...prev, countries: false })));
  }, []);

  const fetchStates = (country) => {
    setLoading(prev => ({ ...prev, states: true }));
    axios.post(stateAPI, { country })
      .then(res => setStates(res.data.data.states || []))
      .finally(() => setLoading(prev => ({ ...prev, states: false })));
  };

  const fetchCities = (country, state) => {
    setLoading(prev => ({ ...prev, cities: true }));
    axios.post(cityAPI, { country, state })
      .then(res => setCities(res.data.data || []))
      .finally(() => setLoading(prev => ({ ...prev, cities: false })));
  };


  const fileInputRef = useRef();

  // Load form values from localStorage
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    const hasValidData = Object.values(data).some(value => value !== undefined && value !== null);

    if (hasValidData) {
      const safe = (val) => (val !== null && val !== undefined ? val : undefined);

      form.setFieldsValue({
        gender: safe(data.genderid),
        birthDate: data.dob ? dayjs(data.dob) : undefined,
        address: safe(data.address1),
        country: safe(data.countryname),
        state: safe(data.statename),
        city: safe(data.city),
        zipCode: safe(data.zipCode),
        bio: safe(data.bio),
      });

      // Load profile image preview if provided
      if (data.photopath && !profileImage) {
        setPreview('http://localhost:3001/' + data.photopath); // 👈 photopath should be a full image URL
      }

      if (data.countryname) {
        setSelectedCountry(data.countryname);
        fetchStates(data.countryname);
      }

      if (data.countryname && data.statename) {
        setSelectedState(data.statename);
        fetchCities(data.countryname, data.statename);
      }
    }
  }, [data, form]);



  useEffect(() => {
    form.setFieldsValue({
      firstName: firstName,
      lastName: lastName,
    })
  }, [])




  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/webp']; // Add more if needed

    if (!allowedTypes.includes(file.type)) {
      setProfileError('Only JPG, JPEG, or WEBP files are allowed. PNG is not allowed.');
      setProfileImage(null);
      setPreview(null);
      return;
    }

    setProfileError('');
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };


  const handleSubmit = async () => {
    try {
      if (!profileImage && !preview) {
        setProfileError("Please select profile image! Profile image is required.");
        return;
      }

      const values = await form.validateFields();

      // Format data as per API structure
      const profilePayload = {
        genderid: values.gender,
        dob: values.birthDate.format('DD-MM-YYYY'),
        address1: values.address,
        countryname: values.country,
        statename: values.state,
        bio: values.bio || '',
        city: values.city,
        zipCode: values.zipCode,
      };
      const formData = new FormData();
      formData.append('profilejson', JSON.stringify(profilePayload));
      formData.append('photo', profileImage);

      // Example API call
      const response = await axios.post("user/complete-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Auth header
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log(response.data)
      }

      console.log('✅ API Response:', response.data);
      message.success('Form submitted successfully!');
      onNext();
    } catch (errorInfo) {
      console.log('❌ Validation Failed or API Error:', errorInfo);
      message.error('Submission failed, please try again.');
    }
  };



  return (
    <div className="personal-details-container bg-white p-6 rounded-3xl text-inter">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Personal Details</h2>
      <p className="text-gray-600">Please provide your personal details to complete your profile.</p>

      <Form
        form={form}
        layout="vertical"
        className="mt-6"

      >
        {/* Profile Image Upload */}
        <div className="p-[10px] relative rounded-full w-36 h-36 border-2 border-dashed border-[#c8c9cb] my-6">
          <div className="relative m-auto w-30 h-30 rounded-full overflow-hidden bg-[#0D132D0D] hover:opacity-90 cursor-pointer border border-gray-100 group">
            {preview ? (
              <img src={preview} alt="Profile preview" className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-800 opacity-50">
                <RiImageAddLine className="w-8 h-8" />
              </div>
            )}
            <input
              type="file"
              accept=".jpg,.jpeg,.webp" // no .png here
              ref={fileInputRef}
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

          </div>
        </div>
        {profileError && (
          <p className="text-red-500 text-sm mb-3">{profileError}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <Form.Item name="firstName" label={<b>First Name</b>}>
            <Input size="large" disabled className="rounded-xl" />
          </Form.Item>

          {/* Last Name */}
          <Form.Item name="lastName" label={<b>Last Name</b>}>
            <Input size="large" disabled className="rounded-xl" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender */}
          <Form.Item
            name="gender"
            label={<b>Gender</b>}
            rules={[{ required: true, message: 'Please select your gender' }]}
          >
            <Select size="large" placeholder="Select Gender" className="rounded-xl">
              <Option value={1}>Male</Option>
              <Option value={2}>Female</Option>
              <Option value={3}>Other</Option>
            </Select>
          </Form.Item>

          {/* Birth Date */}
          <Form.Item
            name="birthDate"
            label={<b>Birth Date</b>}
            rules={[{ required: true, message: 'Please select your birth date' }]}
          >
            <DatePicker
              size="large"
              className="w-full rounded-xl"
              format="DD-MM-YYYY"
              style={{ height: 40 }}
              disabledDate={(current) => current && current > dayjs().endOf('day')}
            />
          </Form.Item>
        </div>

        {/* Address */}
        <Form.Item
          name="address"
          label={<b>Address</b>}
          rules={[{ required: true, message: 'Please enter your address' }]}
        >
          <Input size="large" placeholder="Enter your address" className="rounded-xl" />
        </Form.Item>

        {/* Location */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Country */}
          <Form.Item
            label={<b>Country</b>}
            name="country"

            rules={[{ required: true, message: 'Please select a country' }]}
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
            rules={[{ required: true, message: 'Please select a state' }]}
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
          size="large"

          error="ZIP Or PIN Code Is Required"
          name="zipCode"
          rules={[{ message: 'Please enter your ZIP or PIN Code' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              const iso = countries.find(c => c.name === getFieldValue('country'))?.iso2;
              const regex = getRegexForCountry(iso);
              if (!value) return Promise.resolve();
              if (regex && !regex.test(value.trim())) {
                return Promise.reject(new Error('Invalid ZIP/PIN code'));
              }
              return Promise.resolve();
            }
          })
          ]}
          className="md:col-span-3"
        >
          <Input size="large" placeholder="Enter ZIP or PIN" className="rounded-xl" />
        </Form.Item>



        {/* Bio */}
        <Form.Item
          name="bio"
          label={<b>Bio</b>}
        >
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
          onClick={handleSubmit}
        >
          Continue
        </button>
      </Form>
    </div>
  );
};
