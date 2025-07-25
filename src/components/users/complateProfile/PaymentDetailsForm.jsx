import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  Modal,
  Typography,
  message,
  Row, Col
} from "antd";

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

const PaymentDetailsForm = ({ onBack, onComplete }) => {
  const [form] = Form.useForm();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [termsVisible, setTermsVisible] = useState(false);

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
    onComplete?.(values);
  };

  return (
    <>
      <div className=" p-6 bg-white rounded-3xl ">
        <h2 className="text-2xl font-bold mb-2">Payment Details</h2>
        <p className="mb-6 text-gray-700">
          Enter Your Payment Details to withdraw Money
        </p>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{ agree: false }}
        >
          {/* Country */}
          <Form.Item
            label={<span>Country</span>}
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

          {/* Bank */}
          <Form.Item
            label={<b>Bank</b>}
            name="bank"
            rules={[{ required: true, message: "Please select your bank" }]}
          >
            <Select size="large" placeholder="Select Bank" disabled={!selectedCountry}>
              {(banksByCountry[selectedCountry] || []).map((b) => (
                <Option key={b.code} value={b.code}>
                  {b.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

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
      rules={[{ required: true, message: "Enter Account Number" }]}
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

          {/* IFSC Code */}
          <Form.Item
            label={<b>IFSC Code</b>}
            name="ifscCode"
            rules={[{ required: true, message: "Enter IFSC Code" }]}
          >
            <Input size="large" placeholder="Enter IFSC Code" />
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
          <Form.Item>
            <div className="flex gap-4">
              <Button onClick={onBack}>Back</Button>
              <Button type="primary" htmlType="submit" className="ml-auto">
                Complete Profile
              </Button>
            </div>
          </Form.Item>
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
