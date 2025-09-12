import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Checkbox,
  Modal,
  Typography,
  message,
  Row, Col
} from 'antd';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useEffect } from 'react';
import axios from 'axios';

const { Option } = Select;
const { Link } = Typography;

const countries = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
];

const banksByCountry = {
  US: [
    { code: "boa", name: "Bank of America" },
    { code: "chase", name: "Chase Bank" },
    { code: "wells", name: "Wells Fargo" },
  ],
  IN: [
    { code: "sbi", name: "State Bank of India" },
    { code: "icici", name: "ICICI Bank" },
    { code: "hdfc", name: "HDFC Bank" },
  ],
  GB: [
    { code: "hsbc", name: "HSBC" },
    { code: "barclays", name: "Barclays" },
    { code: "lloyds", name: "Lloyds Bank" },
  ],
};

const Payment = ({ onBack, onNext }) => {
  const [form] = Form.useForm();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [termsVisible, setTermsVisible] = useState(false);
  const [ifscValid, setIfscValid] = useState(null); 
  const [bankDetails, setBankDetails] = useState(null);


  const validateIFSC = async (value) => {
  if (!value || value.length < 5) return;

  try {
    const response = await axios.get(`https://ifsc.razorpay.com/${value}`);
    setIfscValid(true);
    setBankDetails(response.data);

    // Auto-fill bank field
    form.setFieldsValue({
      bank: response.data.BANK || 'Unknown Bank',
    });

  } catch (err) {
    setIfscValid(false);
    setBankDetails(null);
    form.setFieldsValue({ bank: '' });
  }
};



  const onCountryChange = (code) => {
    setSelectedCountry(code);
    form.setFieldsValue({ bank: undefined }); // reset bank on country change
  };

  const onFinish = (values) => {
    if (values.accountNumber !== values.confirmAccountNumber) {
      message.error("Account number and Confirm Account number do not match");
      return;
    }
    if (!values.agree) {
      message.error("You must agree to the Payment Terms & Conditions");
      return;
    }
    console.log("Form submitted:", values);
    localStorage.setItem("paymentInfo", JSON.stringify(values));

    if (onNext) onNext();
  };

  useEffect(() => {
  const saved = localStorage.getItem("paymentInfo");
  if (saved) {
    const parsed = JSON.parse(saved);
    form.setFieldsValue(parsed);
    if (parsed.ifscCode) {
      validateIFSC(parsed.ifscCode);
    }
  }
}, []);

  return (
    <>
      <div className=" p-6 bg-white rounded-3xl ">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Payment Details</h2>
        <p className="mb-6 text-gray-700">
          Enter Your Payment Details to withdraw Money
        </p>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{ agree: false }}
        >

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              {/* Country */}
              <Form.Item
                label={<b>Country</b>}
                name="country"
                rules={[{ required: true, message: "Please select your country" }]}
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
                rules={[{ required: true, message: "Bank name will be fetched from IFSC" }]}
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
              { required: true, message: "Enter Account Holder’s Name" },
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
                  { required: true, message: "Enter Account Number" },
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
                rules={[{ required: true, message: "Confirm Account Number" }]}
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
                rules={[{ required: true, message: "Enter IFSC Code" }]}
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
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: 'Please enter your phone number' },
                  {
                    validator: (_, value) =>
                      value && value.length >= 10
                        ? Promise.resolve()
                        : Promise.reject(new Error('Enter valid phone number')),
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
                  { required: true, message: "Enter your email" },
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
            rules={[{ required: true, message: "Enter your address" }]}
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
                rules={[{ required: true, message: "Select preferred currency" }]}
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
                rules={[{ required: true, message: "Select a payment method" }]}
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
                      { required: true, message: "Enter your PayPal email" },
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
                      { required: true, message: "Enter your UPI ID" },
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
            <Checkbox>
              By Adding this bank account, I agree to{" "}
              <Link onClick={() => setTermsVisible(true)}>
                <b>Payment Terms & Conditions</b>
              </Link>
            </Checkbox>
          </Form.Item>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 ">
            <button
              onClick={onBack}
              className="bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
            >
              Back
            </button>
            <button
              onClick={onFinish}
              className="bg-[#121A3F] text-white cursor-pointer inset-shadow-sm inset-shadow-gray-500 px-8 py-3 rounded-full hover:bg-[#0D132D]"
            >
              Complate Profile
            </button>
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

export default Payment;
