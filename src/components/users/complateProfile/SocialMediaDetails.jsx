import React, { useEffect, useState, useMemo } from 'react';
import { Form, Input, InputNumber } from 'antd';
import axios from 'axios';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const SocialMediaDetails = ({ onBack, onNext, data, onChange, showControls, showToast, onSave }) => {
  const [form] = Form.useForm();
  const [providers, setProviders] = useState([]);
  const { token, userId } = useSelector(state => state.auth);
  const [customValidationError, setCustomValidationError] = useState(null);


  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getAllPlatforms = async () => {
    try {
      const res = await axios.get("providers");
      setProviders(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllPlatforms();
  }, []);

  const platforms = useMemo(() => {
    return providers.map((provider) => {
      const field = provider.name.toLowerCase().replace(/\s+/g, '');
      return {
        name: provider.name,
        providerid: provider.id,
        icon: (
          <img
            src={`${BASE_URL}/${provider.iconpath.replace(/^\/+/, '')}`}
            alt={provider.name}
            className="w-[24px]"
          />
        ),
        field,
        urlField: `${field}_url`,
        followersField: `${field}_followers`,
        placeholder: `Enter your ${provider.name} link`,
      };
    });
  }, [providers, BASE_URL]);

  const onFinish = async (values) => {
    try {
      if (!token || !userId) {
        message.error("User not authenticated.");
        return;
      }

      const socialaccountjson = platforms
        .filter(p => values[p.urlField])
        .map(p => ({
          providerid: p.providerid,
          handleslink: values[p.urlField],
          nooffollowers: values[p.followersField] || 0,
        }));

      const hasValidEntry = socialaccountjson.some(
        (item) => item.handleslink && item.nooffollowers >= 1000
      );

      if (!hasValidEntry) {
        setCustomValidationError("Please fill at least one social media URL and 1000+ followers.");
        return;
      }

      // Clear error if passed
      setCustomValidationError(null);

      const formData = new FormData();
      formData.append('socialaccountjson', JSON.stringify(socialaccountjson));

      const response = await axios.post(
        'user/complete-profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status == 200) {
        if (showToast) toast.success('Profile updated successfully!');

        // Stepper: Go to next
        if (onNext) onNext();

        // Edit Profile: Custom save handler
        if (onSave) onSave(socialaccountjson);
      }


    } catch (error) {
      console.error('❌ Failed to submit social links:', error);
      message.error('Failed to submit social links.');
    }
  };



  // Prefill values
  useEffect(() => {
    if (data && Array.isArray(data) && platforms.length > 0) {
      const initialValues = {};

      data.forEach(item => {
        const platform = platforms.find(p => p.providerid === item.providerid);
        if (platform) {
          initialValues[platform.urlField] = item.handleslink;
          // if null → undefined (empty input), else keep number
          initialValues[platform.followersField] =
            typeof item.nooffollowers === 'number' ? item.nooffollowers : undefined;

        }
      });

      form.setFieldsValue(initialValues);
    }
  }, [data, platforms, form]);


  return (
    <div className="bg-white p-6 rounded-3xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Connect Your Social Media</h2>
      <p className="text-gray-500 mb-6">Enter the details of your social media handles</p>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={({ errorFields }) => {
          if (errorFields.length > 0) {
            // scroll to the first error field
            form.scrollToField(errorFields[0].name, {
              behavior: 'smooth',
              block: 'center',
            });
          }
        }}
        onValuesChange={() => {
          const values = form.getFieldsValue();
          const socialData = platforms
            .filter(p => values[p.urlField])
            .map(p => ({
              providerid: p.providerid,
              handleslink: values[p.urlField],
              nooffollowers: values[p.followersField],
            }));
          onChange?.(socialData);
        }}
      >

        <div className="space-y-4">
          {platforms.map((platform) => (
            <div
              key={platform.field}
              className="flex flex-col gap-3 border border-gray-100 p-3 rounded-xl bg-gray-50"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Platform (small) */}
                <div className="col-span-12 lg:col-span-2 flex items-center gap-2">
                  {platform.icon}
                  <span className="text-sm font-medium text-gray-700">
                    {platform.name}
                  </span>
                </div>

                {/* URL input (large) */}
                <div className="col-span-12 lg:col-span-7">
                  <Form.Item
                    style={{ margin: 0 }}
                    name={platform.urlField}
                    rules={[{ type: "url", message: "Please enter a valid URL" }]}
                  >
                    <Input
                      size="large"
                      placeholder={platform.placeholder}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </Form.Item>
                </div>

                {/* Followers input (medium) */}
                <div className="col-span-12 lg:col-span-3">
                  <Form.Item
                    style={{ margin: 0 }}
                    name={platform.followersField}
                    rules={[
                      {
                        validator: (_, value) => {
                          const url = form.getFieldValue(platform.urlField);
                          if (url && (!value || value < 1000)) {
                            return Promise.reject(
                              new Error(`At least 1000 followers required for ${platform.name}`)
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <InputNumber
                      size="large"
                      min={0}
                      max={500000000}
                      controls={false}
                      className="w-full rounded-lg border border-gray-300"
                      placeholder="How Many Followers ?"
                      style={{ width: "100%" }}
                      formatter={(value) => (value ? value.replace(/\D/g, "") : "")}
                      parser={(value) => value.replace(/\D/g, "")}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          ))}

          {customValidationError && (
            <div className="text-red-500 font-medium mb-4">
              {customValidationError}
            </div>
          )}


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
              className="bg-[#0D132D] cursor-pointer text-white px-8 py-3 rounded-full hover:bg-[#121A3F] transition"
              onClick={onFinish}
            >
              {onNext ? "Continue" : "Save Changes"}
            </button>
          )}

        </div>

      </Form>
    </div>
  );
};
