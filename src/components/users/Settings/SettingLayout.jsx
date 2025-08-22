import React, { useState } from "react";
import {
  RiUserSettingsLine,
  RiLockPasswordLine,
  RiNotification3Line,
  RiDeleteBinLine,
} from "react-icons/ri";
import Account from "./account";
import ChangePassword from "./Changepassword";
import Notification from "./Notification";
import DeleteAccount from "./DeleteAccount";

const SettingLayout = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Account Settings",
      component: <Account />,
      icon: <RiUserSettingsLine />,
    },
    {
      title: "Change Password",
      component: <ChangePassword />,
      icon: <RiLockPasswordLine />,
    },
    {
      title: "Notifications",
      component: <Notification />,
      icon: <RiNotification3Line />,
    },
    {
      title: "Delete Account",
      component: <DeleteAccount />,
      icon: <RiDeleteBinLine />,
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto text-sm overflow-x-hidden">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      {/* Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm h-fit">
          <h3 className="font-semibold text-sm mb-4">Settings</h3>
          <ul className="space-y-2">
            {steps.map((step, index) => (
              <li key={index}>
                <button
                  onClick={() => setActiveStep(index)}
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg transition ${
                    activeStep === index
                      ? "bg-gray-100 font-medium text-gray-900"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <span className="text-lg">{step.icon}</span>
                  {step.title}
                </button>
              </li>
            ))}
          </ul>
          
        </div>

        {/* Active step content with FIXED width */}
        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-2xl shadow-sm min-h-[400px] w-full">
            {steps[activeStep].component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingLayout;
