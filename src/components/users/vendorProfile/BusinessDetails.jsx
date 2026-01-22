import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Select, message, Spin } from 'antd';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { RiImageAddLine } from 'react-icons/ri';
import axios from "axios";
import postalRegexList from '../complateProfile/postalRegex.json';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const { TextArea } = Input;
const { Option } = Select;

export const BusinessDetails = ({ onNext, data = {}, showControls, showToast, onSave, onChange }) => {

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [form] = Form.useForm();
    const [preview, setPreview] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [profileError, setProfileError] = useState('');
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState({ countries: false, states: false, cities: false });
    const [companySizes, setCompanySizes] = useState([]);
    const [existingPhotoPath, setExistingPhotoPath] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);

    const { token } = useSelector(state => state.auth);
    const fileInputRef = useRef();
    const isHydratingRef = useRef(true);
    const hasHydratedRef = useRef(false);



    const getRegexForCountry = (iso) => {
        const entry = postalRegexList.find((e) => e.ISO === iso);
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

    const loadCountries = async () => {
        try {
            setLoading(p => ({ ...p, countries: true }));
            const res = await axios.get("/countries");
            setCountries(Array.isArray(res?.data?.countries) ? res.data.countries : []);
        } catch (err) {
            console.error(err);
            setCountries([]);
        } finally {
            setLoading(p => ({ ...p, countries: false }));
        }
    };

    const loadStates = async (countryName) => {
        try {
            setLoading(p => ({ ...p, states: true }));

            const countryObj = countries.find(c => c.name === countryName);
            if (!countryObj) return setStates([]);

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


    const formatNumberCompact = (num) => {
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M';
        if (num >= 1_000) return (num / 1_000).toFixed(1).replace('.0', '') + 'k';
        return num.toString();
    };

    useEffect(() => {
        loadCountries();
        fetchCompanySizes();
    }, []);

    // Initialize form and load countries
    useEffect(() => {
        if (
            hasHydratedRef.current ||
            !data ||
            Object.keys(data).length === 0 ||
            countries.length === 0
        ) {
            return;
        }

        hasHydratedRef.current = true;
        isHydratingRef.current = true;

        const safe = (val) => (val !== null && val !== undefined ? val : undefined);

        form.setFieldsValue({
            businessname: safe(data.businessname),
            companysizeid: safe(data.companysizeid),
            phone: safe(data.phonenumber),
            address1: safe(data.address1),
            countryname: safe(data.countryname),
            statename: safe(data.statename),
            city: safe(data.city),
            zipCode: safe(data.zip),
            bio: safe(data.bio),
        });

        const hydrate = async () => {
            if (data.countryname) {
                await loadStates(data.countryname);
            }
            if (data.statename) {
                await loadCities(data.statename);
            }
            isHydratingRef.current = false;
        };

        hydrate();
    }, [countries]);

    useEffect(() => {
        if (!data) return;

        // 1️⃣ Unsaved selected image (highest priority)
        if (data.photoFile && data.photoPreview) {
            setProfileImage(data.photoFile);
            setPreview(data.photoPreview);
            setExistingPhotoPath(null);
            return;
        }

        // 2️⃣ Existing backend image
        if (data.photopath) {
            const fullUrl = data.photopath.startsWith("http")
                ? data.photopath
                : `${BASE_URL}${data.photopath.replace(/^\/+/, "")}`;

            setPreview(fullUrl);
            setExistingPhotoPath(data.photopath);
            setProfileImage(null);
            return;
        }

        // 3️⃣ No image
        setPreview(null);
        setExistingPhotoPath(null);
        setProfileImage(null);
    }, [data, BASE_URL]);



    const syncToParent = () => {
        if (!onChange) return;

        const values = form.getFieldsValue();

        onChange({
            ...data,
            businessname: values.businessname,
            companysizeid: values.companysizeid,
            phonenumber: values.phone,
            address1: values.address1,
            countryname: values.countryname,
            statename: values.statename,
            city: values.city,
            zip: values.zipCode,
            bio: values.bio,
            photopath: existingPhotoPath,
            photoFile: profileImage,
            photoPreview: preview,
        });
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/webp'];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            setProfileError('Only JPG, JPEG, or WEBP files are allowed.');
            return;
        }

        if (file.size > maxSize) {
            setProfileError('File size must be less than 5 MB.');
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setProfileError('');
        setProfileImage(file);
        setPreview(previewUrl);
        setIsFormChanged(true);

        onChange?.({
            ...data,
            photopath: null,
            photoPreview: previewUrl,
            photoFile: file,
        });
    };

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);


    const handleSubmit = async () => {
        await form.validateFields();
        if (!profileImage && !existingPhotoPath) {
            setProfileError("Please select profile image! Profile image is required.");
            return;
        } else {
            setProfileError("");
        }
        try {
            setIsSubmitting(true);
            const values = form.getFieldsValue();
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
            if (profileImage) {
                formData.append('photo', profileImage);
            }

            const response = await axios.post("/vendor/complete-vendor-profile", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200 || response.status === 201) {
                if (showToast) toast.success('Profile updated successfully!');
                setIsFormChanged(false);

                console.log(response.data)
                const newPhotoPath = response?.data?.photopath || existingPhotoPath;

                setExistingPhotoPath(newPhotoPath);
                setProfileImage(null);
                setPreview(newPhotoPath);
                console.log("profile photopath", newPhotoPath)


                onChange?.({
                    ...profilejson,
                    photopath: newPhotoPath,
                });

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
        finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="personal-details-container bg-white p-6 bg-white rounded-3xl text-inter">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Business Details</h2>
            <p className="text-gray-600">Please provide your Business details to complete your profile.</p>

            <Form form={form} layout="vertical" className="mt-6"
                onValuesChange={() => {
                    setIsFormChanged(true);
                    syncToParent();
                }}
            >
                {/* Profile Image Upload */}
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


                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
                    {/* Business Name */}
                    <Form.Item
                        name="businessname"
                        label={<b>Business Name</b>}
                        rules={[
                            { required: true, message: 'Please enter your Business Name' },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve();
                                    const trimmed = value.trim();
                                    if (trimmed.length < 5 || trimmed.length > 50) {
                                        return Promise.reject(new Error('Business Name must be between 5 and 50 characters'));
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Enter your Business Name"
                            className="rounded-xl"
                            onBlur={(e) => {
                                const trimmed = e.target.value.trim();
                                form.setFieldsValue({ businessname: trimmed });
                            }}
                        />
                    </Form.Item>


                    <Form.Item
                        label={<b>Phone Number</b>}
                        name="phone"
                        rules={[
                            { required: true, message: "Please enter your phone number" },
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
                        ]}
                    >
                        <PhoneInput
                            country="in"
                            enableSearch
                            value={form.getFieldValue("phone")}      // <-- bind value
                            onChange={(val) => form.setFieldsValue({ phone: val })} // <-- update form
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
                    rules={[
                        { required: true, message: 'Please enter your address' },
                        {
                            validator: (_, value) => {
                                if (!value) return Promise.resolve();
                                const trimmed = value.trim();
                                if (trimmed.length < 5 || trimmed.length > 100) {
                                    return Promise.reject(new Error('Address must be between 5 and 100 characters'));
                                }
                                // const pattern = /^[a-zA-Z0-9\s,.\-]+$/;
                                // if (!pattern.test(trimmed)) {
                                //     return Promise.reject(new Error('Address contains invalid characters'));
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
                        onBlur={(e) => {
                            const trimmed = e.target.value.trim();
                            form.setFieldsValue({ address1: trimmed });
                        }}
                    />
                </Form.Item>


                {/* Country / State / City */}
                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
                    <Form.Item
                        label={<b>Country</b>}
                        name="countryname"
                        rules={[{ required: true, message: 'Please select a Country' }]}
                    >
                        <Select
                            showSearch
                            size="large"
                            onChange={(val) => {
                                form.setFieldsValue({
                                    countryname: val,
                                    statename: undefined,
                                    city: undefined,
                                });

                                setStates([]);
                                setCities([]);

                                loadStates(val);
                            }}

                            loading={loading.countries}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option?.children?.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {countries.map((country) => (
                                <Option key={country.id} value={country.name}>
                                    {country.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={<b>State</b>}
                        name="statename"
                        rules={[{ required: true, message: 'Please select a State' }]}
                    >
                        <Select
                            showSearch
                            size="large"
                            placeholder="Select State"
                            onChange={(val) => {
                                form.setFieldsValue({
                                    statename: val,
                                    city: undefined,
                                });

                                setCities([]);
                                loadCities(val);
                            }}

                            disabled={!states.length}
                            loading={loading.states}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {states.map((state) => (
                                <Option key={state.id} value={state.name}>
                                    {state.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="city"
                        label={<b>City</b>}
                    // rules={[{ required: true, message: 'Please select a City' }]}
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
                {/* ZIP Code */}
                <Form.Item
                    label={<b>ZIP / PIN Code</b>}
                    name="zipCode"
                    rules={[
                        { required: true, message: 'Please enter your ZIP or PIN Code' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value) return Promise.resolve();

                                const countryName = getFieldValue('countryname');
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
                <Form.Item
                    name="bio"
                    label={<b>Bio</b>}
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your bio'
                        },
                    ]}
                >
                    <TextArea
                        rows={4}
                        showCount
                        maxLength={500}
                        placeholder="Tell us about your Business..."
                        className="rounded-xl"
                    />
                </Form.Item>

                {/* Submit Button */}
                {(showControls || onNext) && (
                    <div className="flex justify-start mt-6">
                        <button
                            className={`px-8 py-3 rounded-full text-white font-medium transition
                            ${(onNext || isFormChanged) && !isSubmitting
                                    ? "bg-[#121A3F] hover:bg-[#0D132D] cursor-pointer"
                                    : "bg-gray-400 cursor-not-allowed"
                                }`}
                            onClick={handleSubmit}
                            disabled={onNext ? isSubmitting : !isFormChanged || isSubmitting}
                        >
                            {isSubmitting ? <Spin size="small" /> : onNext ? "Continue" : "Save Changes"}
                        </button>
                    </div>
                )}
            </Form>
        </div>
    );
};
