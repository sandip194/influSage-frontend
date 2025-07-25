import React from 'react';
import { Form, Input, Button } from 'antd';


export const SocialMediaDetails = ({ onBack, onNext }) => {
  const [form] = Form.useForm();

  const platforms = [
    {
      name: 'Instagram',
      icon: <img src='./public/assets/skill-icons_instagram.png' alt='Instagram-logo' className='w-[24px] '/>,
      field: 'instagram',
      placeholder: 'Enter Your Instagram link',
    },
    {
      name: 'YouTube',
      icon: <img src='./public/assets/logos_youtube-icon.png' alt='Youtube-logo' className='w-[24px] '/>,
      field: 'youtube',
      placeholder: 'Enter Your YouTube link',
    },
    {
      name: 'Facebook',
      icon: <img src='./public/assets/logos_facebook.png' alt='Facebook-logo' className='w-[24px] '/>,
      field: 'facebook',
      placeholder: 'Enter Your Facebook link',
    },
    {
      name: 'X',
      icon: <img src='./public/assets/Group.png' alt='X-logo' className='w-[24px] '/>,
      field: 'x',
      placeholder: 'Enter Your X link',
    },
    {
      name: 'Tiktok',
      icon: <img src='./public/assets/logos_tiktok-icon.png'  alt='Tiktok-logo' className='w-[24px] '/>,
      field: 'tiktok',
      placeholder: 'Enter Your Tiktok link',
    },
    {
      name: 'Pinterest',
      icon: <img src='./public/assets/logos_pinterest.png' alt='Pinterest-logo' className='w-[24px] '/>,
      field: 'pinterest',
      placeholder: 'Enter Your Pinterest link',
    },
  ];

  const onFinish = (values) => {
    console.log('Form Data:', values);
    if (onNext) onNext();
  };

  return (
    <div className="bg-white p-6 rounded-3xl">
      <h2 className="text-2xl font-semibold">Connect Your Social Media</h2>
      <p className="text-gray-500 mb-6">Enter the details of your social media handles</p>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="space-y-4">
          {platforms.map((platform) => (
            <Form.Item
              key={platform.field}
              name={platform.field}
              rules={[
                { required: true, message: `Please enter your ${platform.name} link` },
                { type: 'url', message: 'Please enter a valid URL' },
              ]}
              className="mb-0"
            >
              <div className="flex flex-col md:flex-row items-center gap-3 ">
                <div className="flex items-center gap-2  min-w-full md:min-w-[200px] border border-gray-200 rounded-lg px-4 py-2">
                  {platform.icon}
                  <span className="text-sm font-medium text-gray-700">{platform.name}</span>
                </div>
                <Input
                size='large'
                  placeholder={platform.placeholder}
                  className="flex-1 border-none shadow-none bg-transparent focus:ring-0 focus:outline-none"
                />
              </div>
            </Form.Item>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <button
          onClick={onBack}
          className="mt-6 bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
        >
          Back
        </button>
          <button
          type='submit'
          className="mt-6 bg-[#121A3F] cursor-pointer text-white px-8 py-3 rounded-full hover:bg-[#0D132D] transition-colors"
        >
          Continue
        </button>
        </div>
      </Form>
    </div>
  );
};
