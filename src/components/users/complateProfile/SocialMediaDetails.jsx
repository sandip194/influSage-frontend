import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import axios from 'axios';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

export const SocialMediaDetails = ({ onBack, onNext, data, onChange }) => {
  const [form] = Form.useForm();
  const [providers, setProviders] = useState([])

  const { token, userId } = useSelector(state => state.auth);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getAllPlatforms = async () => {
    try {
      const res = await axios.get("vendor/providers")
      setProviders(res.data.data)
    } catch (error) {
      console.log(error)
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
            src={`${BASE_URL}/${provider.iconpath.replace(/^\/+/, '')}`}
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
      if (!token || !userId) {
        message.error("User not authenticated.");
        return;
      }

      // Transform filled values into required array
      const socialaccountjson = platforms
        .filter(p => values[p.field]) // Only filled-in links
        .map(p => ({
          providerid: p.providerid,
          handleslink: values[p.field],
        }));

      // Optionally store in localStorage
      // localStorage.setItem("socialLinks", JSON.stringify(values));

      const formData = new FormData();
      formData.append('socialaccountjson', JSON.stringify(socialaccountjson));

      const response = await axios.post(
        'user/complete-profile', // replace with actual URL
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Social media data sent:', response.data);
      message.success('Social media details submitted!');
      if (onNext) onNext();

    } catch (error) {
      console.error('❌ Failed to submit social links:', error);
      message.error('Failed to submit social links.');
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


  // 🔍 Custom validator to ensure at least one field is filled
  const validateAtLeastOne = (_, value) => {
    const filled = platforms.some((p) => form.getFieldValue(p.field));
    return filled ? Promise.resolve() : Promise.reject('Please enter at least one social media link');
  };

  return (
    <div className="bg-white p-6 rounded-3xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Connect Your Social Media</h2>
      <p className="text-gray-500 mb-6">Enter the details of your social media handles</p>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={() => {
          const values = form.getFieldsValue();
          const socialData = platforms
            .filter(p => values[p.field])
            .map(p => ({
              providerid: p.providerid,
              handleslink: values[p.field],
            }));
          onChange?.(socialData);
        }}
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
                rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
              >
                <Input
                  size="large"
                  placeholder={platform.placeholder}
                  className="flex-1 border-none shadow-none bg-transparent focus:ring-0 focus:outline-none"
                  onChange={() => {
                    form.validateFields(['atLeastOne']);
                  }}
                />
              </Form.Item>
            </div>

          ))}
        </div>

        {/* 🔒 Hidden field to attach custom validator */}
        <Form.Item
          shouldUpdate
          style={{ margin: 0 }}
        >
          {() => {
            const hasError = form.getFieldError('atLeastOne').length > 0;

            return (
              <>
                {/* Hidden validation field */}
                <Form.Item
                  name="atLeastOne"
                  rules={[{ validator: validateAtLeastOne }]}
                  style={{ display: 'none', margin: 0 }}
                >
                  <Input style={{ margin: 0 }} />
                </Form.Item>

                {/* Manual error message display */}
                {hasError && (
                  <div className="text-red-500 text-sm mt-0 mb-0 !important">
                    {form.getFieldError('atLeastOne')[0]}
                  </div>
                )}
              </>
            );
          }}
        </Form.Item>


        {/* Buttons */}
        <div className="flex flex-row items-center gap-4 ">
          <button
            type="button"
            onClick={onBack}
            className="bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-[#121A3F] text-white cursor-pointer inset-shadow-sm inset-shadow-gray-500 px-8 py-3 rounded-full hover:bg-[#0D132D]"
          >
            Continue
          </button>
        </div>
      </Form >
    </div >
  );
};
