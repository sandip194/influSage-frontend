import React, { useState } from "react";
import { Switch } from "antd";
import {
  RiUser3Line,
  RiNotification3Line,
  RiGiftLine,
  RiMoneyDollarCircleLine,
  RiAlertLine,
  RiMailLine,
} from "react-icons/ri";

const Notifications = () => {
  const [settings, setSettings] = useState({
    account: { email: true, push: false, sms: true },
    campaign: { email: false, push: true, sms: false },
    offer: { email: true, push: false, sms: false },
    payment: { email: true, push: false, sms: true },
    admin: { email: false, push: true, sms: true },
    marketing: { email: true, push: false, sms: false },
  });

  const handleToggle = (key, type, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], [type]: value },
    }));
  };

  const notificationOptions = [
    {
      key: "account",
      title: "Account Notifications",
      desc: "Lorem ipsum dolar samet is dummy text",
      icon: <RiUser3Line size={30} className="text-xl text-gray-600" />,
    },
    {
      key: "campaign",
      title: "Campaign Updates",
      desc: "Lorem ipsum dolar samet is dummy text",
      icon: <RiNotification3Line size={30} className="text-xl text-gray-600" />,
    },
    {
      key: "offer",
      title: "Offer Notifications",
      desc: "Lorem ipsum dolar samet is dummy text",
      icon: <RiGiftLine size={30} className="text-xl text-gray-600" />,
    },
    {
      key: "payment",
      title: "Payment Notifications",
      desc: "Lorem ipsum dolar samet is dummy text",
      icon: <RiMoneyDollarCircleLine size={30} className="text-xl text-gray-600" />,
    },
    {
      key: "admin",
      title: "Admin Actions or Alerts",
      desc: "Lorem ipsum dolar samet is dummy text",
      icon: <RiAlertLine size={30} className="text-xl text-gray-600" />,
    },
    {
      key: "marketing",
      title: "Marketing Updates",
      desc: "Lorem ipsum dolar samet is dummy text",
      icon: <RiMailLine size={30} className="text-xl text-gray-600" />,
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Notifications</h2>

      {/* Header row (hidden on mobile) */}
      <div className="hidden sm:flex justify-end gap-12 pr-10 mb-2 text-xs font-semibold text-gray-500">
        <span>Email</span>
        <span>Push</span>
        <span>SMS</span>
      </div>

      <div className="space-y-6">
        {notificationOptions.map((item) => (
          <div
            key={item.key}
            className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 last:border-b-0"
          >
            {/* Left section: Icon + text */}
            <div className="flex items-start gap-3 mb-3 sm:mb-0">
              <div>{item.icon}</div>
              <div>
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </div>

            {/* Right section: Switches */}
            <div className="flex items-center gap-8 sm:gap-12 justify-around sm:justify-end">
              {["email", "push", "sms"].map((type) => (
                <div key={type} className="flex justify-center">
                  <Switch
                    checked={settings[item.key][type]}
                    onChange={(val) => handleToggle(item.key, type, val)}
                    className="custom-switch"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-center sm:justify-start mt-6">
        <button className="bg-[#121A3F] text-white cursor-pointer px-8 py-3 rounded-full hover:bg-[#0D132D] transition">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Notifications;
