import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Checkbox,
  Modal,
  Typography,
  message,
  Row,
  Col,
  Button,
  Spin
} from 'antd';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const { Option } = Select;
const { Link } = Typography;

const countries = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
];

const PaymentDetailsForm = ({ onBack, onNext, data, onChange, showControls, showToast, onSave }) => {
  const [form] = Form.useForm();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [termsVisible, setTermsVisible] = useState(false);
  const [ifscValid, setIfscValid] = useState(null); // null, true, false
  const [bankDetails, setBankDetails] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const { token, role } = useSelector(state => state.auth);


  // Validate IFSC code via Razorpay API and autofill bank name
  const validateIFSC = async (value) => {
    if (!value || value.length < 5) {
      setIfscValid(null);
      setBankDetails(null);
      form.setFieldsValue({ bank: "" });
      return;
    }

    try {
      const response = await axios.get(`https://ifsc.razorpay.com/${value}`);
      setIfscValid(true);
      setBankDetails(response.data);
      form.setFieldsValue({
        bank: response.data.BANK || "Unknown Bank",
      });
    } catch {
      setIfscValid(false);
      setBankDetails(null);
      form.setFieldsValue({ bank: "" });
    }
  };

  const onCountryChange = (code) => {
    setSelectedCountry(code);
    form.setFieldsValue({ bank: "" }); // reset bank on country change
  };

  // Form validation before submit
  const validateForm = (values) => {
    if (values.accountNumber !== values.confirmAccountNumber) {
      message.error("Account numbers do not match");
      return false;
    }
    if (!values.agree) {
      message.error("You must agree to the terms");
      return false;
    }
    return true;
  };

  // Build payment method array for payload
  const buildPaymentMethod = (values) => {
    switch (values.paymentMethod) {
      case "upi":
        return [{ method: "UPI", paymentdetails: values.upiId || null }];
      case "paypal":
        return [{ method: "PayPal", paymentdetails: values.paypalEmail || null }];
      case "other":
        return [{ method: "Other", paymentdetails: values.otherDetails || null }];
      default:
        return []; // For bank transfer, no extra payment details
    }
  };

  // Format final payload for backend
  const formatPaymentAccount = (values) => {
    return {

      bankcountry: values.country || null,
      bankname: values.bank || null,
      accountholdername: values.accountHolder || null,
      accountnumber: values.accountNumber || null,
      bankcode: values.ifscCode || null,
      branchaddress: values.address || null,
      contactnumber: values.phone || null,
      email: values.email || null,
      preferredcurrency: values.currency || null,
      taxidentificationnumber: values.taxId || null,
      paymentmethod: buildPaymentMethod(values),

    };
  };

  // Submit payload to backend
  const submitToBackend = async (payload) => {
    setSubmitting(true);

    const formData = new FormData();
    formData.append('paymentjson', JSON.stringify(payload));

    try {

      // for Influencer 
      if (role === 1) {
        const res = await axios.post(
          "/user/complete-profile",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200) {
          onChange?.(payload.paymentjson);
          if (showToast) toast.success('Profile updated successfully!');
          setIsFormChanged(false);
          // Stepper: Go to next
          if (onNext) onNext();

          // Edit Profile: Custom save handler
          if (onSave) onSave(formData);
        } else {
          message.error("Failed to save payment info");
        }
      }

      // for Vendor
      if (role === 2) {
        const res = await axios.post(
          "/vendor/complete-vendor-profile",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200) {
          onChange?.(payload.paymentjson);
          if (showToast) toast.success('Profile updated successfully!');
          setIsFormChanged(false);

          // Stepper: Go to next
          if (onNext) onNext();

          // Edit Profile: Custom save handler
          if (onSave) onSave(formData);
        } else {
          message.error("Failed to save payment info");
        }
      }
    } catch (err) {
      console.error(err);
      message.error("Error submitting payment info");
    } finally {
      setSubmitting(false);
    }
  };

  // Called when form is submitted successfully
  const onFinish = async (values) => {
    if (!validateForm(values)) return;
    const payload = formatPaymentAccount(values);
    await submitToBackend(payload);
  };

  // Map backend data to form fields on load
  const mapBackendToFormValues = (data) => {
    if (!data) return {};
    const payment = data;
    const methodObj = payment.paymentmethod?.[0] || {};
    let paymentMethod = methodObj.method?.toLowerCase() || "bank";

    const decodeHexAccountNumber = (hexString) => {
      try {
        setIsSubmitting(true);
        const cleanHex = hexString.replace(/\\x/g, "");
        return cleanHex
          .match(/.{1,2}/g)
          .map((byte) => String.fromCharCode(parseInt(byte, 16)))
          .join("");
      } catch (e) {
        return hexString;
      }
      finally {
      setIsSubmitting(false); // ✅ Stop loading
    }
    };

    return {
      country: payment.bankcountry || null,
      bank: payment.bankname || null,
      accountHolder: payment.accountholdername || null,
      accountNumber: decodeHexAccountNumber(payment.accountnumber) || null,
      confirmAccountNumber: decodeHexAccountNumber(payment.accountnumber) || null,
      ifscCode: payment.bankcode || null,
      address: payment.branchaddress || null,
      phone: payment.contactnumber || null,
      email: payment.email || null,
      currency: payment.preferredcurrency || null,
      taxId: payment.taxidentificationnumber || null,
      paymentMethod,
      paypalEmail: paymentMethod === "paypal" ? methodObj.paymentdetails : null,
      upiId: paymentMethod === "upi" ? methodObj.paymentdetails : null,
      otherDetails: paymentMethod === "other" ? methodObj.paymentdetails : null,
      agree: true,
    };
  };

  // safe one-time form population
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    // console.log("first");

    const mappedValues = mapBackendToFormValues(data);

    const hasValidData = Object.values(mappedValues).some(
      (val) => val !== undefined && val !== null
    );

    if (hasValidData) {
      form.setFieldsValue(mappedValues);
    }
  }, [data]); // ✅ only run when `data` changes




  return (
    <>
      <div className=" p-2 bg-white rounded-3xl ">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Payment Details</h2>
        <p className="mb-6 text-gray-700">
          Enter Your Payment Details to withdraw Money
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={() => setIsFormChanged(true)}
        >

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              {/* Country */}
              <Form.Item
                label={<b>Country</b>}
                name="country"
                rules={[{ message: "Please select your country" }]}
              >
                <Select
                  placeholder="Select Country"
                  size="large"
                  onChange={onCountryChange}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {countries.map((c) => (
                    <Option key={c.code} value={c.code}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              {/* Bank */}
              <Form.Item
                label={<b>Bank</b>}
                name="bank"
                rules={[{ message: "Bank name will be fetched from IFSC" }]}
              >
                <Input size="large" placeholder="Enter IFSC to fetch bank" disabled />
              </Form.Item>

            </Col>
          </Row>

          {/* Account Holder's Name */}
          <Form.Item
            label={<b>Account Holder’s Name</b>}
            name="accountHolder"
            rules={[
              { message: "Enter Account Holder’s Name" },
              { min: 3, message: "Name must be at least 3 characters" },
            ]}
          >
            <Input size="large" placeholder="Enter Account Holder’s Name" />
          </Form.Item>

          {/* Account Number & Confirm Account Number */}
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<b>Account Number</b>}
                name="accountNumber"
                rules={[
                  { message: "Enter Account Number" },
                  {
                    pattern: /^\d{9,18}$/,
                    message: "Account number must be 9-18 digits"
                  }
                ]}

              >
                <Input size="large" placeholder="Enter Account Number" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<b>Confirm Account Number</b>}
                name="confirmAccountNumber"
                rules={[{ message: "Confirm Account Number" }]}
              >
                <Input size="large" placeholder="Enter Account Number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              {/* IFSC Code */}
              <Form.Item
                label={<b>IFSC Code</b>}
                name="ifscCode"
                rules={[{ message: "Enter IFSC Code" }]}
              >
                <Input
                  size="large"
                  placeholder="Enter IFSC Code"
                  onChange={(e) => validateIFSC(e.target.value.trim().toUpperCase())}
                />

              </Form.Item>
              {ifscValid === true && (
                <b className="text-green-500 ">IFSC Code Verified</b>
              )}
            </Col>
            <Col xs={24} sm={12}>
              {/* Tax Identification Number */}
              <Form.Item
                label={<b>Tax Identification Number</b>}
                name="taxId"
                rules={[
                  {
                    pattern: /^[A-Za-z0-9\-]+$/,
                    message: "Invalid tax ID format",
                  },
                ]}
              >
                <Input size="large" placeholder="Optional (PAN, SSN, etc.)" />
              </Form.Item>
            </Col>
          </Row>


          <Row gutter={16}>
            <Col xs={24} sm={12}>
              {/* Phone Number */}
              <Form.Item
                label={<b>Phone Number</b>}
                name="phone"
                rules={[
                  {
                    required: true,
                    message: 'Phone number is required',
                  },
                  {
                    validator: (_, value) => {
                      if (!value || value.trim() === '') {
                        // If empty, allow it (optional field)
                        return Promise.resolve();
                      }

                      if (value.length >= 12) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('Enter valid phone number'));
                    },
                  },
                ]}
              >
                <PhoneInput
                  country={'in'}
                  enableSearch
                  inputStyle={{
                    width: '100%',
                    height: '40px',
                    borderRadius: "8px"
                  }}
                  containerStyle={{ width: '100%' }}
                  specialLabel=""
                />
              </Form.Item>

            </Col>
            <Col xs={24} sm={12}>
              {/* Email Address */}
              <Form.Item
                label={<b>Email Address</b>}
                name="email"
                rules={[
                  { type: "email", message: "Invalid email format" },
                ]}
              >
                <Input size="large" placeholder="Enter your email" />
              </Form.Item>
            </Col>
          </Row>

          {/* Address */}
          <Form.Item
            label={<b>Address</b>}
            name="address"
            rules={[{ message: "Enter your address" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter full address for KYC"
              size="large"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              {/* Preferred Currency */}
              <Form.Item
                label={<b>Preferred Currency</b>}
                name="currency"
                rules={[{ message: "Select preferred currency" }]}
              >
                <Select size="large" placeholder="Select currency">
                  <Option value="USD">USD - US Dollar</Option>
                  <Option value="INR">INR - Indian Rupee</Option>
                  <Option value="EUR">EUR - Euro</Option>
                  <Option value="GBP">GBP - British Pound</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              {/* Payment Method */}
              <Form.Item
                label={<b>Payment Method</b>}
                name="paymentMethod"
                rules={[{ message: "Select a payment method" }]}
              >
                <Select size="large" placeholder="Choose Payment Method">
                  <Option value="bank">Bank Transfer</Option>
                  <Option value="paypal">PayPal</Option>
                  <Option value="upi">UPI</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Conditional Payment Method Fields */}
          <Form.Item shouldUpdate={(prev, curr) => prev.paymentMethod !== curr.paymentMethod}>
            {({ getFieldValue }) => {
              const method = getFieldValue("paymentMethod");

              if (method === "paypal") {
                return (
                  <Form.Item
                    label={<b>PayPal Email</b>}
                    name="paypalEmail"
                    rules={[
                      { message: "Enter your PayPal email" },
                      { type: "email", message: "Invalid email" },
                    ]}
                  >
                    <Input size="large" placeholder="Enter PayPal email" />
                  </Form.Item>
                );
              }

              if (method === "upi") {
                return (
                  <Form.Item
                    label={<b>UPI ID</b>}
                    name="upiId"
                    rules={[
                      { message: "Enter your UPI ID" },
                      {
                        pattern: /^[\w.-]+@[\w]+$/,
                        message: "Invalid UPI ID format (e.g., name@bank)",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Enter UPI ID" />
                  </Form.Item>
                );
              }

              if (method === "other") {
                return (
                  <Form.Item
                    label={<b>Additional Payment Details</b>}
                    name="otherDetails"
                  >
                    <Input size="large" placeholder="Describe your method" />
                  </Form.Item>
                );
              }

              // Bank Transfer is already handled with bank, accountHolder, accountNumber, etc.
              return null;
            }}
          </Form.Item>


          {/* Terms and Conditions */}
          <Form.Item
            name="agree"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("You must agree to Payment Terms & Conditions")
                      ),
              },
            ]}
          >
            <div className="flex items-center flex-wrap gap-1 text-sm text-gray-700">
              <Checkbox />
              <span>
                By adding this bank account, I agree to the{" "}
                <span
                  onClick={() => setTermsVisible(true)}
                  className="text-blue-600 cursor-pointer font-semibold hover:underline"
                >
                  Payment Terms & Conditions
                </span>
              </span>
            </div>
          </Form.Item>

          {/* Buttons */}
          <div className="flex flex-row items-center gap-4 mt-6">
            {/* Back Button (only shown if onBack is provided) */}
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
              >
                Back
              </button>
            )}

            {/* Next / Save Button */}
            {(showControls || onNext) && (
              <button
                type="submit"
                disabled={onNext ? isSubmitting : !isFormChanged || isSubmitting}
                className={`px-8 py-3 rounded-full text-white font-medium transition
                  ${
                    (onNext || isFormChanged) && !isSubmitting
                      ? "bg-[#121A3F] hover:bg-[#0D132D] cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                {isSubmitting ? <Spin size="small" /> : onNext ? "Continue" : "Save Changes"}
              </button>
            )}

          </div>
        </Form>
      </div>

      {/* Terms & Conditions Modal */}
      <Modal
        title="Payment Terms & Conditions"
        visible={termsVisible}
        onCancel={() => setTermsVisible(false)}
        width={1000}
        footer={null}
        bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
        centered
      >
        <div className="text-base" style={{ whiteSpace: "pre-line" }}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            scelerisque aliquam odio et faucibus. Nulla rhoncus feugiat eros
            quis consectetur.
          </p>
          <p>
            Morbi neque ex, condimentum dapibus congue et, vulputate ut ligula.
            Vestibulum sit amet urna turpis. Mauris euismod elit et nisi
            ultrices, ut faucibus orci tincidunt.
          </p>
          <p>
            Praesent dignissim, tortor nec facilisis sodales, justo erat
            fermentum diam, sit amet cursus nunc metus nec augue. Curabitur
            luctus consequat odio, a lobortis lacus tempor et.
          </p>
          <p>
            Donec mattis orci vitae velit bibendum, vel suscipit enim dictum.
            Aliquam erat volutpat. Nullam a tincidunt arcu, vitae gravida
            tortor.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            scelerisque aliquam odio et faucibus. Nulla rhoncus feugiat eros
            quis consectetur.
          </p>
          <p>
            Morbi neque ex, condimentum dapibus congue et, vulputate ut ligula.
            Vestibulum sit amet urna turpis. Mauris euismod elit et nisi
            ultrices, ut faucibus orci tincidunt.
          </p>
          <p>
            Praesent dignissim, tortor nec facilisis sodales, justo erat
            fermentum diam, sit amet cursus nunc metus nec augue. Curabitur
            luctus consequat odio, a lobortis lacus tempor et.
          </p>
          <p>
            Donec mattis orci vitae velit bibendum, vel suscipit enim dictum.
            Aliquam erat volutpat. Nullam a tincidunt arcu, vitae gravida
            tortor.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            scelerisque aliquam odio et faucibus. Nulla rhoncus feugiat eros
            quis consectetur.
          </p>
          <p>
            Morbi neque ex, condimentum dapibus congue et, vulputate ut ligula.
            Vestibulum sit amet urna turpis. Mauris euismod elit et nisi
            ultrices, ut faucibus orci tincidunt.
          </p>
          <p>
            Praesent dignissim, tortor nec facilisis sodales, justo erat
            fermentum diam, sit amet cursus nunc metus nec augue. Curabitur
            luctus consequat odio, a lobortis lacus tempor et.
          </p>
          <p>
            Donec mattis orci vitae velit bibendum, vel suscipit enim dictum.
            Aliquam erat volutpat. Nullam a tincidunt arcu, vitae gravida
            tortor.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default PaymentDetailsForm;
