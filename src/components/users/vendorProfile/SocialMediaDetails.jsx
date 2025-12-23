import React, { useEffect, useState } from 'react';
import { Form, Input, Spin } from 'antd';
import axios from 'axios';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { toast } from 'react-toastify';

const PLATFORM_URL_RULES = {
  instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9._%-]+\/?$/,
  facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9._%-]+\/?$/,
  youtube: /^(https?:\/\/)?(www\.)?youtube\.com\/.+$/,
  twitter: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9._%-]+\/?$/,
  linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/.+$/,
};


export const SocialMediaDetails = ({ onBack, onNext, data, showControls, showToast, onSave }) => {
  const [providers, setProviders] = useState([])
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const { token } = useSelector(state => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getAllPlatforms = async () => {
    try {
      const res = await axios.get("providers")
      setProviders(res.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getAllPlatforms()
  }, [])

  const platforms = useMemo(() => {
    return providers.map((provider) => {
      const field = provider.name.toLowerCase().replace(/\s+/g, ''); // sanitize field name
      return {
        name: provider.name,
        providerid: provider.id,
        icon: (
          <img
            src={provider.iconpath}
            alt={provider.name}
            className="w-[24px]"
          />
        ),
        field,
        placeholder: `Enter your ${provider.name} link`,
      };
    });
  }, [providers, BASE_URL]);

  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);
      // Transform filled values into required array
      const providersjson = platforms
        .filter(p => values[p.field]) // Only filled-in links
        .map(p => ({
          providerid: p.providerid,
          handleslink: values[p.field],
        }));

      // Optionally store in localStorage
      // localStorage.setItem("socialLinks", JSON.stringify(values));


      const formData = new FormData();
      formData.append('providersjson', JSON.stringify(providersjson));
      const response = await axios.post(
        'vendor/complete-vendor-profile', // replace with actual URL
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const successMessage =
          response?.data?.message || "Profile updated successfully";

        if (showToast) toast.success(successMessage);

        setIsFormChanged(false);

        // Stepper: Go to next
        if (onNext) onNext();

        // Edit Profile: Custom save handler
        if (onSave) onSave(socialaccountjson);
      }

    } catch (error) {
      console.error('❌ Failed to submit social links:', error);
      message.error('Failed to submit social links.');
    }
    finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (data && Array.isArray(data) && platforms.length > 0) {
      const initialValues = {};

      data.forEach(item => {
        const platform = platforms.find(p => p.providerid === item.providerid);
        if (platform) {
          initialValues[platform.field] = item.handleslink;
        }
      });

      form.setFieldsValue(initialValues);
    }
  }, [data, platforms, form]);
  const handleFormChange = (_, allValues) => {
    setIsFormChanged(true);
  };

  return (
    <div className="bg-white p-6 rounded-3xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Connect Your Social Media</h2>
      <p className="text-gray-500 mb-6">Let’s connect your social media profiles to help us understand your reach better.</p>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={handleFormChange}
      >
        <div className="space-y-4">
          {platforms.map((platform) => (

            <div key={platform.field} className="flex flex-row items-center gap-3">
              <div className="flex items-center gap-2 min-w-[40px] md:min-w-[150px] border border-gray-200 rounded-lg px-4 py-2">
                {platform.icon}
                <span className="hidden md:block text-sm font-medium text-gray-700">{platform.name}</span>
              </div>
              <Form.Item
                style={{ margin: 0, width: "100%" }}
                name={platform.field}
                rules={[
                  {
                    validator(_, value) {
                      if (!value) return Promise.resolve(); // allow empty links

                      // Check if it's a valid URL
                      try {
                        new URL(value);
                      } catch {
                        return Promise.reject(new Error("Please enter a valid URL"));
                      }

                      // Check if the URL contains the platform name
                      const lowerValue = value.toLowerCase();
                      const platformKey = platform.name.toLowerCase().replace(/\s+/g, '');
                      if (!lowerValue.includes(platformKey)) {
                        return Promise.reject(
                          new Error(`This link must be for ${platform.name}`)
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder={platform.placeholder}
                  className="flex-1 border-none shadow-none bg-transparent focus:ring-0 focus:outline-none"
                />
              </Form.Item>


            </div>

          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-row items-center gap-4 mt-6">
          {/* Back Button (only shown if onBack is provided) */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
            >
              Back
            </button>
          )}

          {/* Next / Save Button */}
          {(showControls || onNext) && (
            <button
              disabled={onNext ? isSubmitting : !isFormChanged || isSubmitting}
              className={`px-8 py-3 rounded-full text-white font-medium transition
                ${(onNext || isFormChanged) && !isSubmitting
                  ? "bg-[#121A3F] hover:bg-[#0D132D] cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? <Spin size="small" /> : onNext ? "Continue" : "Save Changes"}
            </button>
          )}

        </div>
      </Form >
    </div >
  );
};
