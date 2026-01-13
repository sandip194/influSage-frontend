import React, { useState, useEffect, useMemo } from "react";
import { Modal, Radio, Input, Checkbox, message, Button } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const { TextArea } = Input;

export default function UpdateAddressModal({
  visible,
  onClose,
  record,
  onSaveSuccess
}) {
  const [tempAddress, setTempAddress] = useState("");
  const [tempSaveFuture, setTempSaveFuture] = useState(false);
  const [radioValue, setRadioValue] = useState("new"); // default radio
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.auth);

  // Track initial state to detect changes
  const initialState = useMemo(() => {
    if (!record) return {};
    const existingAddress = record.pickupaddress || record.deliveryaddress || "";
    const isReusable = record.saveforfuture || record.isreusable || false;
    return {
      address: existingAddress,
      saveFuture: isReusable,
      radio: "new" // default
    };
  }, [record]);

  const [initial, setInitial] = useState(initialState);

  useEffect(() => {
    if (!record) return;

    const existingAddress = record.pickupaddress || record.deliveryaddress || "";
    const isReusable = record.saveforfuture || record.isreusable || false;

    // By default, show "Add New" with existing pickup/delivery if present
    setTempAddress(existingAddress || "");
    setTempSaveFuture(isReusable);
    setRadioValue("new");

    // set initial state for comparison
    setInitial({
      address: existingAddress || "",
      saveFuture: isReusable,
      radio: "new"
    });
  }, [record]);

  // Check if any change happened
  const hasChanged = useMemo(() => {
    return (
      tempAddress !== initial.address ||
      tempSaveFuture !== initial.saveFuture ||
      radioValue !== initial.radio
    );
  }, [tempAddress, tempSaveFuture, radioValue, initial]);

  const handleSave = async () => {
    if (!tempAddress.trim()) {
      message.error("Address cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        p_userid: record.ownerid || record.influencerid,
        p_address: tempAddress,
        p_isreusable: tempSaveFuture
      };

      const res = await axios.post("/admin/dashboard/insertShippingAddress", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 200) {
        toast.success(res.data?.message);
        onSaveSuccess({
          ...record,
          pickupaddress: tempAddress,
          deliveryaddress: tempAddress,
          saveforfuture: tempSaveFuture,
          isreusable: tempSaveFuture
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
      message.error(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (!record) return null;

  return (
    <Modal
      title="Update Address"
      open={visible}
      onCancel={onClose}
      onOk={handleSave}
      okText="Save"
      confirmLoading={loading}
      okButtonProps={{ disabled: !hasChanged }}
    >
      <Radio.Group
        value={radioValue}
        onChange={(e) => {
          setRadioValue(e.target.value);
          if (e.target.value === "current") {
            setTempAddress(record.currentaddress || "");
          } else {
            setTempAddress(record.pickupaddress || record.deliveryaddress || "");
          }
        }}
      >
        <Radio value="current">Use Current Address</Radio>
        <Radio value="new">Add New Address</Radio>
      </Radio.Group>

      <TextArea
        rows={3}
        value={tempAddress}
        onChange={(e) => setTempAddress(e.target.value)}
        placeholder="Enter address"
        className="mt-3"
      />

      <Checkbox
        className="mt-3"
        checked={tempSaveFuture}
        onChange={(e) => setTempSaveFuture(e.target.checked)}
      >
        Save for future shipments
      </Checkbox>
    </Modal>
  );
}
