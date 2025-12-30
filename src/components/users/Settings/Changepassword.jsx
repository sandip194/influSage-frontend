import React, { useState } from "react";
import { Form, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    const payload = {
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };

    try {
      setLoading(true);

      const res = await axios.post(
        "/setting/change-password",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data?.message || "Password changed successfully");
      form.resetFields();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Failed to change password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
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
          rules={[
            { required: true, message: "Please enter your current password" },
          ]}
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

        {/* Submit Button */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#121A3F] text-white px-8 py-3 rounded-full 
              ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#0D132D]"}`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default ChangePassword;
