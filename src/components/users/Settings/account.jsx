import React from 'react';
import { Form, Select, Button, Card } from 'antd';

const { Option } = Select;

const AccountSettings = () => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log("Form Submitted:", values);
  };

  return (
    <div
      bodyStyle={{ padding: "24px" }}
    >
      <h2 className="text-xl font-semibold mb-6">Account Settings</h2>

      <Form
        layout="vertical"
        form={form}
        initialValues={{
          visibility: "Private",
          campaignPreference: "Both Short term and long term",
          timezone: "GMT +5:30",
          language: "English",
          theme: "Light",
        }}
        onFinish={handleFinish}
      >
        {/* Visibility */}
        <Form.Item label="Visibility" name="visibility">
          <Select size="large">
            <Option value="Private">Private</Option>
            <Option value="Public">Public</Option>
          </Select>
        </Form.Item>

        {/* Campaign Preference */}
        <Form.Item label="Campaign Preference" name="campaignPreference">
          <Select size="large">
            <Option value="Short term">Short term</Option>
            <Option value="Long term">Long term</Option>
            <Option value="Both Short term and long term">
              Both Short term and long term
            </Option>
          </Select>
        </Form.Item>

        {/* Time zone */}
        <Form.Item label="Time zone" name="timezone">
          <Select size="large">
            <Option value="GMT +5:30">GMT +5:30</Option>
            <Option value="GMT +0:00">GMT +0:00</Option>
            <Option value="GMT -5:00">GMT -5:00</Option>
          </Select>
        </Form.Item>

        {/* Language */}
        <Form.Item label="Language" name="language">
          <Select size="large">
            <Option value="English">English</Option>
            <Option value="Hindi">Hindi</Option>
            <Option value="Spanish">Spanish</Option>
          </Select>
        </Form.Item>

        {/* Theme */}
        <Form.Item label="Theme" name="theme">
          <Select size="large">
            <Option value="Light">Light</Option>
            <Option value="Dark">Dark</Option>
          </Select>
        </Form.Item>

        {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 ">
            <button
              className="bg-[#121A3F] text-white cursor-pointer inset-shadow-sm inset-shadow-gray-500 px-8 py-3 rounded-full hover:bg-[#0D132D]"
            >
              Save Changes
            </button>
          </div>
      </Form>
    </div>
  );
};

export default AccountSettings;
