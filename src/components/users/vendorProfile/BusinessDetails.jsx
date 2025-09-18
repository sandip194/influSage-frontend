import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Select, message } from 'antd';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { RiImageAddLine } from 'react-icons/ri';
import axios from "axios";
import postalRegexList from '../complateProfile/postalRegex.json';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const { TextArea } = Input;
const { Option } = Select;

export const BusinessDetails = ({ onNext, data = {}, showControls, showToast, onSave }) => {
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
    const [companySizes, setCompanySizes] = useState([]);
    const [existingPhotoPath, setExistingPhotoPath] = useState(null);


    const { token } = useSelector(state => state.auth);

    const countryAPI = "https://countriesnow.space/api/v0.1/countries/positions";
    const stateAPI = "https://countriesnow.space/api/v0.1/countries/states";
    const cityAPI = "https://countriesnow.space/api/v0.1/countries/state/cities";

    const fileInputRef = useRef();

    const getRegexForCountry = (iso) => {
        const entry = postalRegexList.find(e => e.ISO === iso);
        return entry?.Regex ? new RegExp(entry.Regex) : null;
    };

    const fetchCompanySizes = async () => {
        try {
            const response = await axios.get("vendor/company-sizes");
            if (response.status === 200) {
                setCompanySizes(response.data.companySizes || []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCountries = () => {
        setLoading(prev => ({ ...prev, countries: true }));
        axios.get(countryAPI)
            .then(res => {
                if (res.data?.data) {
                    setCountries(res.data.data); // ✅ 'data' is an array
                }
            })
            .catch((err) => {
                console.error("❌ Failed to fetch countries:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, countries: false }));
            });
    };


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

    const formatNumberCompact = (num) => {
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M';
        if (num >= 1_000) return (num / 1_000).toFixed(1).replace('.0', '') + 'k';
        return num.toString();
    };

    // Initialize form and load countries
    useEffect(() => {
        fetchCompanySizes();
        fetchCountries(countryAPI);

        if (data) {
            form.setFieldsValue({
                businessname: data.businessname,
                companysizeid: data.companysizeid,
                phone: data.phonenumber,
                address1: data.address1,
                countryname: data.countryname,
                statename: data.statename,
                bio: data.bio,
                zipCode: data.zip,
                city: data.city,
            });

            if (data.countryname) {
                setSelectedCountry(data.countryname);
                fetchStates(data.countryname);
            }
            if (data.countryname && data.statename) {
                setSelectedState(data.statename);
                fetchCities(data.countryname, data.statename);
            }

            if (data.photopath) {
                const fullUrl = data.photopath.startsWith('http')
                    ? data.photopath
                    : `http://localhost:3001/${data.photopath.replace(/^\/+/, '')}`;

                setPreview(fullUrl);
                setExistingPhotoPath(data.photopath)
            }

        }
    }, [data]);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setProfileError('Only image files are allowed.');
            return;
        }

        setPreview(URL.createObjectURL(file));
        setProfileImage(file);
        setProfileError('');
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (!profileImage && !preview) {
                setProfileError("Please Select Profile Image! Profile Image is required");
                return;
            }

            const profilejson = {
                photopath: profileImage ? null : existingPhotoPath,
                businessname: values.businessname,
                companysizeid: values.companysizeid,
                phonenumber: values.phone,
                address1: values.address1,
                countryname: values.countryname,
                statename: values.statename,
                city: values.city,
                zip: values.zipCode,
                bio: values.bio,
            };


            const formData = new FormData();
            formData.append('profilejson', JSON.stringify(profilejson));
            formData.append('photo', profileImage);

            const response = await axios.post("/vendor/complete-vendor-profile", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200 || response.status === 201) {
                if (showToast) toast.success('Profile updated successfully!');

                // Stepper: Go to next
                if (onNext) onNext();

                // Edit Profile: Custom save handler
                if (onSave) onSave(formData);
            } else {
                message.error("Failed to update profile.");
            }

        } catch (error) {
            console.error("❌ Validation or API error:", error);
            message.error("Please correct the form errors.");
        }
    };


    return (
        <div className="personal-details-container bg-white p-6 rounded-3xl text-inter">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Business Details</h2>
            <p className="text-gray-600">Please provide your Business details to complete your profile.</p>

            <Form form={form} layout="vertical" className="mt-6">
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
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
                {profileError && <p className="text-red-500 text-sm mb-3">{profileError}</p>}


                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
                    {/* Business Name */}
                    <Form.Item
                        name="businessname"
                        label={<b>Business Name</b>}
                        rules={[{ required: true, message: 'Please enter your Business Name' }]}
                    >
                        <Input size="large" placeholder="Enter your Business Name" className="rounded-xl" />
                    </Form.Item>


                    {/* Phone Number */}
                    <Form.Item
                        label={<b>Phone Number</b>}
                        name="phone"
                        rules={[
                            {
                                validator: (_, value) => {
                                    if (!value || value.trim() === "") {
                                        return Promise.resolve();
                                    }
                                    return value.length >= 10
                                        ? Promise.resolve()
                                        : Promise.reject(new Error("Enter a valid phone number (at least 10 digits)"));
                                },
                            },
                        ]}
                    >
                        <PhoneInput
                            country={"in"}
                            enableSearch
                            inputStyle={{
                                width: "100%",
                                height: "40px",
                                borderRadius: "8px",
                            }}
                            containerStyle={{ width: "100%" }}
                            specialLabel=""
                        />
                    </Form.Item>
                </div>


                {/* Company Size */}
                <Form.Item
                    name="companysizeid"
                    label={<b>How Large Is Your Company?</b>}
                    rules={[{ required: true, message: 'Please select your Company Size' }]}
                >
                    <Select size="large" placeholder="Select Company Size" className="rounded-xl">
                        {companySizes.map(size => (
                            <Option key={size.id} value={size.id}>
                                {size.name} ({size.maxemployees
                                    ? `${formatNumberCompact(size.minemployees)} - ${formatNumberCompact(size.maxemployees)} employees`
                                    : `${formatNumberCompact(size.minemployees)}+ employees`
                                })
                            </Option>
                        ))}
                    </Select>
                </Form.Item>



                {/* Address */}
                <Form.Item
                    name="address1"
                    label={<b>Business Address</b>}
                    rules={[{ required: true, message: 'Please enter your address' }]}
                >
                    <Input size="large" placeholder="Enter your address" className="rounded-xl" />
                </Form.Item>

                {/* Country / State / City */}
                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
                    <Form.Item
                        label={<b>Country</b>}
                        name="countryname"
                        rules={[{ required: true, message: 'Please select a country' }]}
                    >
                        <Select
                            showSearch
                            size="large"
                            placeholder="Select Country"
                            onChange={(val) => {
                                setSelectedCountry(val);
                                form.setFieldsValue({ statename: undefined, city: undefined });
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

                    <Form.Item
                        label={<b>State</b>}
                        name="statename"
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
                        >
                            {states.map((state) => (
                                <Option key={state.name} value={state.name}>
                                    {state.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="city" label={<b>City</b>}>
                        <Select
                            showSearch
                            size="large"
                            placeholder="Select City"
                            disabled={!selectedState}
                            loading={loading.cities}
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
                    rules={[
                        { message: 'Please enter your ZIP or PIN Code' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const iso = countries.find(c => c.name === getFieldValue('countryname'))?.iso2;
                                const regex = getRegexForCountry(iso);
                                if (!value) return Promise.resolve();
                                if (regex && !regex.test(value.trim())) {
                                    return Promise.reject(new Error('Invalid ZIP/PIN code'));
                                }
                                return Promise.resolve();
                            }
                        })
                    ]}
                >
                    <Input size="large" placeholder="Enter ZIP or PIN" className="rounded-xl" />
                </Form.Item>

                {/* Bio */}
                <Form.Item name="bio" label={<b>Bio</b>}>
                    <TextArea rows={4} showCount maxLength={100} placeholder="Tell us about your Business..." className="rounded-xl" />
                </Form.Item>

                {/* Submit Button */}
                {showControls && (
                    <div className="flex justify-start mt-6">
                        <button
                            className="bg-[#121A3F] text-white cursor-pointer inset-shadow-sm inset-shadow-gray-500 px-8 py-3 rounded-full hover:bg-[#0D132D]"
                            onClick={handleSubmit}
                        >
                            {onNext ? 'Continue' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </Form>
        </div>
    );
};
