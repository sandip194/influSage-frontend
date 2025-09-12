import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const ChangePassword = () => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log("Password Changed:", values);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Change Password</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        {/* Current Password */}
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true, message: "Please enter your current password" }]}
        >
          <Input.Password
            size="large"
            placeholder="Enter current password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        {/* New Password */}
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please enter a new password" },
            { min: 6, message: "Password must be at least 6 characters long" },
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Enter new password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        {/* Confirm New Password */}
        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Passwords do not match")
                );
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Confirm new password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
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

export default ChangePassword;
