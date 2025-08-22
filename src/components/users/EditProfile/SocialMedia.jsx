import React from "react";
import { Form, Input } from "antd";

const SocialMedia = ({ onBack }) => {
  const [form] = Form.useForm();

  const platforms = [
    {
      name: "Instagram",
      field: "instagram",
      icon: <img src="/assets/skill-icons_instagram.png" alt="Instagram" className="w-[24px]" />,
      placeholder: "Enter your Instagram link",
    },
    {
      name: "YouTube",
      field: "youtube",
      icon: <img src="/assets/logos_youtube-icon.png" alt="YouTube" className="w-[24px]" />,
      placeholder: "Enter your YouTube link",
    },
    {
      name: "Facebook",
      field: "facebook",
      icon: <img src="/assets/logos_facebook.png" alt="Facebook" className="w-[24px]" />,
      placeholder: "Enter your Facebook link",
    },
    {
      name: "X",
      field: "x",
      icon: <img src="/assets/Group.png" alt="X" className="w-[24px]" />,
      placeholder: "Enter your X link",
    },
    {
      name: "TikTok",
      field: "tiktok",
      icon: <img src="/assets/logos_tiktok-icon.png" alt="TikTok" className="w-[24px]" />,
      placeholder: "Enter your TikTok link",
    },
    {
      name: "Pinterest",
      field: "pinterest",
      icon: <img src="/assets/logos_pinterest.png" alt="Pinterest" className="w-[24px]" />,
      placeholder: "Enter your Pinterest link",
    },
  ];

  const validateAtLeastOne = () => {
    const values = form.getFieldsValue();
    const filled = platforms.some((p) => values[p.field]);
    return filled
      ? Promise.resolve()
      : Promise.reject(new Error("Please enter at least one social media link"));
  };

  const handleSubmit = (values) => {
    console.log("Submitted values:", values);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Connect Your Social Media
      </h2>
      <p className="text-gray-500 mb-6">
        Enter the details of your social media handles
      </p>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="space-y-4">
          {platforms.map((platform) => (
            <div
              key={platform.field}
              className="flex flex-row items-center gap-3"
            >
              {/* Label with Icon */}
              <div className="flex items-center gap-2 min-w-[40px] md:min-w-[150px] border border-gray-200 rounded-lg px-4 py-2">
                {platform.icon}
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {platform.name}
                </span>
              </div>

              {/* Input */}
              <Form.Item
                style={{ margin: 0, width: "100%" }}
                name={platform.field}
                rules={[{ type: "url", message: "Please enter a valid URL" }]}
              >
                <Input size="large" placeholder={platform.placeholder} />
              </Form.Item>
            </div>
          ))}
        </div>

        {/* ✅ Fix: hidden validation depends on all social fields */}
        <Form.Item
          noStyle
          shouldUpdate
        >
          {() => (
            <Form.Item
              name="atLeastOne"
              dependencies={platforms.map((p) => p.field)}
              rules={[{ validator: validateAtLeastOne }]}
              style={{ display: "none" }}
            >
              <Input />
            </Form.Item>
          )}
        </Form.Item>

        {/* Buttons */}
        <div className="flex flex-row items-center gap-4 my-4">
          <button
            type="submit"
            className="bg-[#121A3F] text-white cursor-pointer inset-shadow-sm inset-shadow-gray-500 px-8 py-2 rounded-full hover:bg-[#0D132D]"
          >
            Save changes
          </button>
        </div>
      </Form>
    </div>
  );
};

export default SocialMedia;
