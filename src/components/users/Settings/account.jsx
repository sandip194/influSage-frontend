import React, { useEffect } from "react";
import { Form, Select } from "antd";
import { useSelector } from "react-redux";

const { Option } = Select;

/* Role mapping */
const ROLE_MAP = {
  1: "creator",
  2: "brand",
};

/* Field configuration */
const FIELD_CONFIG = {
  common: [
    {
      label: "Visibility",
      name: "visibility",
      options: ["Private", "Public"],
    },
    {
      label: "Time zone",
      name: "timezone",
      options: ["GMT +5:30", "GMT +0:00", "GMT -5:00"],
    },
    {
      label: "Language",
      name: "language",
      options: ["English", "Hindi", "Spanish"],
    },
    {
      label: "Theme",
      name: "theme",
      options: ["Light", "Dark"],
    },
  ],

  creator: [
    {
      label: "Campaign Preference",
      name: "campaignPreference",
      options: [
        "Short term",
        "Long term",
        "Both Short term and long term",
      ],
    },
  ],

  brand: [
    {
      label: "Influencer Preference",
      name: "influencerPreference",
      options: [
        "Mega Influencer (1M+ Followers)",
        "Macro Influencer (100k - 1M Followers)",
        "Micro Influencer (50k - 100k Followers)",
        "Mini Influencer (10k - 50k Followers)",
        "Nano Influencer (1k - 10k Followers)"
      ],
    },
  ],
};

const AccountSettings = ({ apiData }) => {
  const [form] = Form.useForm();
  const { role } = useSelector((state) => state.auth);

  const userType = ROLE_MAP[role]; // creator | brand

  useEffect(() => {
    if (apiData) {
      form.setFieldsValue(apiData);
    }
  }, [apiData, form]);

  const handleFinish = (values) => {
    console.log("Form Submitted:", values);
  };

  const renderFields = (fields) =>
    fields.map((field) => (
      <Form.Item
        key={field.name}
        label={field.label}
        name={field.name}
      >
        <Select size="large">
          {field.options.map((opt) => (
            <Option key={opt} value={opt}>
              {opt}
            </Option>
          ))}
        </Select>
      </Form.Item>
    ));

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Account Settings</h2>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
      >
        {/* Common fields */}
        {renderFields(FIELD_CONFIG.common)}

        {/* Role specific fields */}
        {renderFields(FIELD_CONFIG[userType] || [])}

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-[#121A3F] text-white px-8 py-3 rounded-full hover:bg-[#0D132D]"
          >
            Save Changes
          </button>
        </div>
      </Form>
    </div>
  );
};

export default AccountSettings;
