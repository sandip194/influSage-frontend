import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, DatePicker, Select, message, Spin } from 'antd';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { RiImageAddLine } from 'react-icons/ri';
import dayjs from 'dayjs';
import axios from 'axios';
import postalRegexList from './postalRegex.json';
import { useSelector } from 'react-redux';
// import { Country, State, City } from 'country-state-city';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { toast } from 'react-toastify';
dayjs.extend(customParseFormat);

const { TextArea } = Input;
const { Option } = Select;

export const PersonalDetails = ({ onNext, data, showControls, showToast, onSave }) => {
  const [form] = Form.useForm();
  const [preview, setPreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [countries, setCountries] = useState([]);
  const [gender, setGender] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState({ countries: false, states: false, cities: false });
  const [existingPhotoPath, setExistingPhotoPath] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const { token, name } = useSelector((state) => state.auth);

  const getRegexForCountry = (iso) => {
    const entry = postalRegexList.find((e) => e.ISO === iso);
    return entry?.Regex ? new RegExp(entry.Regex) : null;
  };

  const getGender = async () => {
    try {
      const res = await axios.get('genders');
      if (res) setGender(res.data.genders);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getGender();
  }, []);

  // Load countries from country-state-city
  useEffect(() => {
    setLoading((prev) => ({ ...prev, countries: true }));
    const countryList = Country.getAllCountries();
    setCountries(countryList);
    setLoading((prev) => ({ ...prev, countries: false }));
  }, []);

  const fetchStates = (countryCode) => {
    setLoading((prev) => ({ ...prev, states: true }));
    const stateList = State.getStatesOfCountry(countryCode);
    setStates(stateList);
    setLoading((prev) => ({ ...prev, states: false }));
  };

  const fetchCities = (countryCode, stateCode) => {
    setLoading((prev) => ({ ...prev, cities: true }));
    const cityList = City.getCitiesOfState(countryCode, stateCode);
    setCities(cityList);
    setLoading((prev) => ({ ...prev, cities: false }));
  };

  const fileInputRef = useRef();

  // Load form values from data
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    const hasValidData = Object.values(data).some((value) => value !== undefined && value !== null);

    if (hasValidData) {
      const safe = (val) => (val !== null && val !== undefined ? val : undefined);

      form.setFieldsValue({
        gender: safe(data.genderid),
        birthDate: data.dob ? dayjs(data.dob, 'DD-MM-YYYY') : undefined,
        phone: safe(data.phonenumber),
        address: safe(data.address1),
        country: safe(data.countryname),
        state: safe(data.statename),
        city: safe(data.city),
        zipCode: safe(data.zip),
        bio: safe(data.bio),
      });

      if (data.countryname) {
        const countryObj = countries.find((c) => c.name === data.countryname);
        if (countryObj) {
          setSelectedCountry(countryObj.isoCode);
          fetchStates(countryObj.isoCode);
        }
      }

      if (data.countryname && data.statename) {
        const countryObj = countries.find((c) => c.name === data.countryname);
        const stateObj = State.getStatesOfCountry(countryObj?.isoCode).find(
          (s) => s.name === data.statename
        );
        if (countryObj && stateObj) {
          setSelectedState(stateObj.isoCode);
          fetchCities(countryObj.isoCode, stateObj.isoCode);
        }
      }

      if (data.photopath) {
        const fullUrl = data.photopath.startsWith('http')
          ? data.photopath
          : `http://localhost:3001/${data.photopath.replace(/^\/+/, '')}`;
        setPreview(fullUrl);
        setExistingPhotoPath(data.photopath);
      }
    }
  }, [data, form, countries]);

  // Load first and last name
  useEffect(() => {
    if (!data && !name) return;

    let firstName = data?.firstname || '';
    let lastName = data?.lastname || '';

    if ((!firstName || !lastName) && name) {
      const parts = name.trim().split(' ');
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }

    const currentValues = form.getFieldsValue();
    if (!currentValues.firstName && !currentValues.lastName) {
      form.setFieldsValue({ firstName, lastName });
    }
  }, [form, data, name]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setProfileError('Only JPG, JPEG, or WEBP files are allowed.');
      setProfileImage(null);
      setPreview(null);
      return;
    }

    setProfileError('');
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
    setIsFormChanged(true);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (!profileImage && !preview) {
        setProfileError('Please select profile image! Profile image is required.');
        return;
      }

      const values = await form.validateFields();

      const profilePayload = {
        photopath: profileImage ? null : existingPhotoPath,
        genderid: values.gender,
        dob: values.birthDate.format('DD-MM-YYYY'),
        phonenumber: values.phone,
        address1: values.address,
        countryname: values.country,
        statename: values.state,
        city: values.city,
        zip: values.zipCode,
        bio: values.bio || '',
      };

      const formData = new FormData();
      formData.append('profilejson', JSON.stringify(profilePayload));
      formData.append('photo', profileImage);

      const response = await axios.post('user/complete-profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        if (showToast) toast.success('Profile updated successfully!');
        setIsFormChanged(false);
        if (onNext) onNext();
        if (onSave) onSave(profilePayload);
      } else {
        message.error('Failed to submit form, please try again.');
      }
    } catch (errorInfo) {
      console.error('❌ Validation Failed or API Error:', errorInfo);
      message.error('Submission failed, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="personal-details-container bg-white p-2 rounded-3xl text-inter">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Personal Details</h2>
      <p className="text-gray-600">Please provide your personal details to complete your profile.</p>

      <Form form={form} layout="vertical" className="mt-6" onValuesChange={() => setIsFormChanged(true)}>
        {/* Profile Image */}
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
              accept=".jpg,.jpeg,.webp"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
        {profileError && <p className="text-red-500 text-sm mb-3">{profileError}</p>}

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
          <Form.Item name="firstName" label={<b>First Name</b>}>
            <Input size="large" disabled className="rounded-xl" />
          </Form.Item>
          <Form.Item name="lastName" label={<b>Last Name</b>}>
            <Input size="large" disabled className="rounded-xl" />
          </Form.Item>
        </div>

        {/* Gender & DOB */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
          <Form.Item
            name="gender"
            label={<b>Gender</b>}
            rules={[{ required: true, message: 'Please select your gender' }]}
          >
            <Select size="large" placeholder="Select Gender" className="rounded-xl">
              {gender.map((g) => (
                <Option key={g.id} value={g.id}>
                  {g.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
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
              disabledDate={(current) => {
                if (!current) return false;
                const today = dayjs();
                const fiveYearsAgo = today.subtract(5, 'year').endOf('year');
                return current > today.endOf('day') || current >= fiveYearsAgo;
              }}
            />
          </Form.Item>
        </div>

        {/* Phone */}
        <Form.Item
          label={<b>Phone Number</b>}
          name="phone"
          rules={[
            { required: true, message: 'Please enter your phone number' },
            {
              validator: (_, value) => {
                if (!value || value.trim() === '') return Promise.resolve();
                return value.length >= 10
                  ? Promise.resolve()
                  : Promise.reject(new Error('Enter a valid phone number (at least 10 digits)'));
              },
            },
          ]}
        >
          <PhoneInput
            country={'in'}
            enableSearch
            inputStyle={{ width: '100%', height: '40px', borderRadius: '8px' }}
            containerStyle={{ width: '100%' }}
            specialLabel=""
          />
        </Form.Item>

        {/* Address */}
        <Form.Item
          name="address"
          label={<b>Address</b>}
          rules={[{ required: true, message: 'Please enter your address' }]}
        >
          <Input size="large" placeholder="Enter your address" className="rounded-xl" />
        </Form.Item>

        {/* Country / State / City */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
          {/* Country */}
          <Form.Item label={<b>Country</b>} name="country" rules={[{ required: true, message: 'Please select a country' }]}>
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
              filterOption={(input, option) => option?.children?.toLowerCase().includes(input.toLowerCase())}
            >
              {countries.map((country) => (
                <Option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* State */}
          <Form.Item label={<b>State</b>} name="state" rules={[{ required: true, message: 'Please select a state' }]}>
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
              filterOption={(input, option) => option?.children?.toLowerCase().includes(input.toLowerCase())}
            >
              {states.map((state) => (
                <Option key={state.isoCode} value={state.isoCode}>
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
              filterOption={(input, option) => option?.children?.toLowerCase().includes(input.toLowerCase())}
            >
              {cities.map((city, i) => (
                <Option key={i} value={city.name}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* ZIP */}
        <Form.Item
          label={<b>ZIP / PIN Code</b>}
          name="zipCode"
          rules={[
            { required: true, message: 'Please enter your ZIP or PIN Code' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const iso = selectedCountry;
                const regex = getRegexForCountry(iso);
                if (!value) return Promise.resolve();
                if (regex && !regex.test(value.trim())) return Promise.reject(new Error('Invalid ZIP/PIN code'));
                return Promise.resolve();
              },
            }),
          ]}
          className="md:col-span-3"
        >
          <Input size="large" placeholder="Enter ZIP or PIN" className="rounded-xl" />
        </Form.Item>

        {/* Bio */}
        <Form.Item name="bio" label={<b>Bio</b>} rules={[{ required: true, message: 'Please enter your bio' }]}>
          <TextArea rows={4} showCount maxLength={500} placeholder="Tell us about yourself..." className="rounded-xl" />
        </Form.Item>

        {/* Submit */}
        {(showControls || onNext) && (
          <div className="flex justify-start mt-6">
            <button
              onClick={handleSubmit}
              disabled={onNext ? isSubmitting : !isFormChanged || isSubmitting}
              className={`px-8 py-3 rounded-full text-white font-medium transition ${
                !isSubmitting && (onNext || isFormChanged)
                  ? 'bg-[#121A3F] hover:bg-[#0D132D] cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? <Spin size="small" /> : onNext ? 'Continue' : 'Save Changes'}
            </button>
          </div>
        )}
      </Form>
    </div>
  );
};
