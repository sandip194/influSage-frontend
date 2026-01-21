import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, DatePicker, Select, message, Spin } from 'antd';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { RiImageAddLine } from 'react-icons/ri';
import dayjs from 'dayjs';
import axios from 'axios';
import postalRegexList from './postalRegex.json';
import { useSelector } from 'react-redux';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { toast } from 'react-toastify';
dayjs.extend(customParseFormat);

const { TextArea } = Input;
const { Option } = Select;

export const PersonalDetails = ({ onNext, data, showControls, showToast, onSave, onChange }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [form] = Form.useForm();
  const [preview, setPreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profileError, setProfileError] = useState('');
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

  const loadCountries = async () => {
    try {
      setLoading((p) => ({ ...p, countries: true }));

      const res = await axios.get("/countries");

      setCountries(Array.isArray(res?.data?.countries) ? res.data.countries : []);
    } catch (err) {
      console.error(err);
      setCountries([]);
    } finally {
      setLoading((p) => ({ ...p, countries: false }));
    }
  };

  const loadStates = async (countryName) => {
    try {
      setLoading(p => ({ ...p, states: true }));

      const countryObj = countries.find(c => c.name === countryName);
      if (!countryObj) {
        setStates([]);
        return;
      }

      const res = await axios.get(`/states/${countryObj.id}`);
      setStates(Array.isArray(res?.data?.states) ? res.data.states : []);
    } catch (err) {
      console.error(err);
      setStates([]);
    } finally {
      setLoading(p => ({ ...p, states: false }));
    }
  };


  const loadCities = async (stateName) => {
    try {
      setLoading(p => ({ ...p, cities: true }));

      const stateObj = states.find(s => s.name === stateName);
      if (!stateObj) {
        setCities([]);
        return;
      }

      const res = await axios.get(`/cities/${stateObj.id}`);
      setCities(Array.isArray(res?.data?.cities) ? res.data.cities : []);
    } catch (err) {
      console.error(err);
      setCities([]);
    } finally {
      setLoading(p => ({ ...p, cities: false }));
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const fileInputRef = useRef();

  // Load form values from data after countries are loaded
  useEffect(() => {
    if (!data || Object.keys(data).length === 0 || countries.length === 0) return;

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
      loadStates(data.countryname);
    }

    if (data.statename) {
      loadCities(data.statename);
    }

    if (data.photopath) {
      const fullUrl = data.photopath.startsWith('http')
        ? data.photopath
        : `${BASE_URL}${data.photopath.replace(/^\/+/, '')}`;
      setPreview(fullUrl);
      setExistingPhotoPath(data.photopath);
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

  const syncToParent = () => {
    if (!onChange) return;

    const values = form.getFieldsValue();

    onChange({
      ...data,
      photopath: existingPhotoPath,
      genderid: values.gender,
      dob: values.birthDate ? values.birthDate.format('DD-MM-YYYY') : null,
      phonenumber: values.phone,
      address1: values.address,
      countryname: values.country,
      statename: values.state,
      city: values.city,
      zip: values.zipCode,
      bio: values.bio || '',
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/webp'];

    //  File type check
    if (!allowedTypes.includes(file.type)) {
      setProfileError('Only JPG, JPEG, or WEBP files are allowed.');
      setProfileImage(null);
      setPreview(null);
      return;
    }

    //  File SIZE check — MAX 5 MB
    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
    if (file.size > maxSize) {
      setProfileError('File size must be less than 5 MB.');
      setProfileImage(null);
      setPreview(null);
      return;
    }

    // ✔ Passed all validation
    setProfileError('');
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
    setIsFormChanged(true);

    if (onChange) {
      onChange({
        ...data,
        photopath: null,
        photoPreview: previewUrl,
        photoFile: file,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    if (data?.statename && states.length) {
      loadCities(data.statename);
    }
  }, [states]);



  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (!profileImage && !existingPhotoPath) {
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
        const successMessage =
          response?.data?.message || "Profile updated successfully";

        if (showToast) toast.success(successMessage);

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

      <Form form={form} layout="vertical" className="mt-6" onValuesChange={() => {setIsFormChanged(true); syncToParent();
      }}>
        {/* Profile Image */}
        <div className="p-[10px] relative rounded-full w-36 h-36 border-2 border-dashed border-[#c8c9cb] my-6">
          <div className="relative m-auto w-30 h-30 rounded-full overflow-hidden bg-[#0D132D0D] hover:opacity-90 cursor-pointer border border-gray-100 group">
            {preview ? (
              <img 
              src={preview} 
              alt="Profile preview" 
              className="object-cover w-full h-full"
               onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
               />
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
                if (!value) return Promise.resolve();

                const digits = value.replace(/\D/g, '');
                if (digits.length < 12 || digits.length > 15) {
                  return Promise.reject(
                    new Error('Enter a valid phone number')
                  );
                }
                return Promise.resolve();
              }
            }
            ,
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
          rules={[
            { required: true, message: 'Please enter your address' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();

                const trimmedValue = value.trim(); // Trim leading/trailing spaces

                // Check length
                if (trimmedValue.length < 5 || trimmedValue.length > 100) {
                  return Promise.reject(
                    new Error('Address must be between 5 and 100 characters')
                  );
                }

                // Allow letters, numbers, spaces, comma, period, hyphen
                // const pattern = /^[a-zA-Z0-9\s,.\-]+$/;
                // if (!pattern.test(trimmedValue)) {
                //   return Promise.reject(
                //     new Error('Address contains invalid characters')
                //   );
                // }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            size="large"
            placeholder="Enter your address"
            className="rounded-xl"
            onBlur={e => {
              const trimmed = e.target.value.trim();
              form.setFieldsValue({ address: trimmed });
            }}
          />
        </Form.Item>



        {/* Country / State / City */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
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
              loading={loading.countries}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              onChange={(name) => {
                form.setFieldsValue({ state: undefined, city: undefined });
                loadStates(name);
              }}
            >
              {countries.map((country) => (
                <Option key={country.id} value={country.name}>
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
              disabled={!states.length}
              loading={loading.states}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              onChange={(name) => {
                form.setFieldsValue({ city: undefined });
                loadCities(name);
              }}
            >
              {states.map((state) => (
                <Option key={state.id} value={state.name}>
                  {state.name}
                </Option>
              ))}
            </Select>
          </Form.Item>


          {/* City */}
          <Form.Item
            label={<b>City</b>}
            name="city"
            // rules={[{ required: true, message: "Please select a City" }]}
          >
            <Select
              showSearch
              size="large"
              placeholder="Select City"
              disabled={!cities.length && !form.getFieldValue('city')}
              loading={loading.cities}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {cities.map((city) => (
                <Option key={city.id} value={city.name}>
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
                if (!value) return Promise.resolve();

                const countryName = getFieldValue('country');
                const iso = countries.find(c => c.name === countryName)?.iso2;
                const regex = getRegexForCountry(iso);

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
        <Form.Item name="bio" label={<b>Bio</b>} rules={[{ required: true, message: 'Please enter your bio' }]}>
          <TextArea rows={4} showCount maxLength={500} placeholder="Tell us about yourself..." className="rounded-xl" />
        </Form.Item>

        {/* Submit */}
        {(showControls || onNext) && (
          <div className="flex justify-start mt-6">
            <button
              onClick={handleSubmit}
              disabled={onNext ? isSubmitting : !isFormChanged || isSubmitting}
              className={`px-8 py-3 rounded-full text-white font-medium transition ${!isSubmitting && (onNext || isFormChanged)
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
