import React, { useEffect } from 'react';
import { Form, Input } from 'antd';

export const SocialMediaDetails = ({ onBack, onNext }) => {
  const [form] = Form.useForm();

  const platforms = [
    { name: 'Instagram', icon: <img src='./public/assets/skill-icons_instagram.png' alt='Instagram-logo' className='w-[24px]' />, field: 'instagram', placeholder: 'Enter Your Instagram link' },
    { name: 'YouTube', icon: <img src='./public/assets/logos_youtube-icon.png' alt='Youtube-logo' className='w-[24px]' />, field: 'youtube', placeholder: 'Enter Your YouTube link' },
    { name: 'Facebook', icon: <img src='./public/assets/logos_facebook.png' alt='Facebook-logo' className='w-[24px]' />, field: 'facebook', placeholder: 'Enter Your Facebook link' },
    { name: 'X', icon: <img src='./public/assets/Group.png' alt='X-logo' className='w-[24px]' />, field: 'x', placeholder: 'Enter Your X link' },
    { name: 'Tiktok', icon: <img src='./public/assets/logos_tiktok-icon.png' alt='Tiktok-logo' className='w-[24px]' />, field: 'tiktok', placeholder: 'Enter Your Tiktok link' },
    { name: 'Pinterest', icon: <img src='./public/assets/logos_pinterest.png' alt='Pinterest-logo' className='w-[24px]' />, field: 'pinterest', placeholder: 'Enter Your Pinterest link' },
  ];

  const onFinish = (values) => {
    console.log('Form Data:', values);
    localStorage.setItem("socialLinks", JSON.stringify(values));
    if (onNext) onNext();
  };


  useEffect(() => {
    const savedValues = localStorage.getItem("socialLinks"); // ✅ correct key
    if (savedValues) {
      const parsedValues = JSON.parse(savedValues);
      console.log(parsedValues)
      form.setFieldsValue(parsedValues); // ✅ populate form fields
      console.log(form.getFieldValue("instagram"))

    }
  }, [form]);

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
      >


        <div className="space-y-4">
          {platforms.map((platform) => (

            <div key={platform.field} className="flex flex-row items-center gap-3">
              <div className="flex items-center gap-2 min-w-[40px] md:min-w-[150px] border border-gray-200 rounded-lg px-4 py-2">
                {platform.icon}
                <span className="hidden md:block text-sm font-medium text-gray-700">{platform.name}</span>
              </div>
              <Form.Item
                style={{margin:0, width:"100%" }}
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

        {/* 🔒 Hidden field to attach custom validator */ }
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


  {/* Buttons */ }
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
