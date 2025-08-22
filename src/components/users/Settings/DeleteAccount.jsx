import React, { useState } from "react";
import { Select } from "antd";

const { Option } = Select;

const DeleteAccount = () => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleDelete = () => {
    if (!reason) {
      setError("Please select a reason before deleting.");
      return;
    }
    setError("");
    console.log("Account deleted. Reason:", reason);
  };

  return (
    <div>
      {/* Title */}
      <h2 className="text-xl font-semibold mb-2">Delete Account</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Are you sure you want to delete your account?
        <br />
        This action is permanent and cannot be undone.
      </p>

      {/* Select Reason */}
      <div className="mb-2">
        <label className="block text-gray-700 font-medium mb-2">
    <span className="text-red-500">*</span> Reason
  </label>
        <Select
          placeholder="Select"
          className="w-full"
          value={reason}
          onChange={(value) => {
            setReason(value);
            setError(""); 
          }}
        >
          <Option value="privacy">Privacy concerns</Option>
          <Option value="usability">Usability issues</Option>
          <Option value="features">Missing features</Option>
          <Option value="other">Other</Option>
        </Select>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="bg-[#121A3F] text-white px-8 py-3 rounded-full hover:bg-[#0D132D] transition w-full sm:w-auto"
      >
        Delete Account
      </button>
    </div>
  );
};

export default DeleteAccount;
