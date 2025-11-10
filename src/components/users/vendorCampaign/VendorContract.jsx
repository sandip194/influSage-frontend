import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Select,
  Modal,
  Typography,
} from "antd";
import { RiAddLine } from "@remixicon/react";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const VendorContract = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Static influencer data
  const influencerList = [
    { id: 1, name: "John Carter", platform: "Instagram", followers: "45k" },
    { id: 2, name: "Aditi Sharma", platform: "YouTube", followers: "120k" },
    { id: 3, name: "Rahul Mehta", platform: "Instagram", followers: "60k" },
    { id: 4, name: "Sana Khan", platform: "TikTok", followers: "30k" },
    { id: 5, name: "Maya Patel", platform: "Instagram", followers: "75k" },
  ];

  const existingContracts = [
    {
      id: "CONT-001",
      influencer: "Aditi Sharma",
      status: "Approved",
      dueDate: "15 Dec 2025",
      deliverables: "2 Reels + 1 Story",
      payment: "₹15,000",
      notes: "Include #BrandName hashtag",
    },
    {
      id: "CONT-002",
      influencer: "Rahul Mehta",
      status: "Pending",
      dueDate: "20 Dec 2025",
      deliverables: "1 Reel",
      payment: "₹10,000",
      notes: "",
    },
  ];

  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    if (!values.influencers || values.influencers.length === 0) {
      Modal.warning({
        title: "Validation",
        content: "Please select at least one influencer.",
      });
      return;
    }

    // Prepare influencer names from ids
    const selectedInfluencers = influencerList.filter((inf) =>
      values.influencers.includes(inf.id)
    );

    console.log({
      influencers: selectedInfluencers.map((i) => i.name),
      deliverables: values.deliverables,
      dueDate: values.dueDate?.format("DD MMM YYYY"),
      payment: values.payment,
      notes: values.notes,
    });

    Modal.success({
      title: "Contract Created",
      content: "Your contract has been created successfully (static).",
    });

    form.resetFields();
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>Contracts</Title>
        <Button
          icon={<RiAddLine size={"20px"}/>}
          onClick={() => setIsModalOpen(true)}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          Create Contract
        </Button>
      </div>

      {/* Existing Contracts */}
      <div className="space-y-3 mb-6">
        {existingContracts.map((contract) => (
          <div
            key={contract.id}
            className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-sm transition"
          >
            <div>
              <Text strong>{contract.influencer}</Text>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Due Date: {contract.dueDate}
                </Text>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Deliverables: {contract.deliverables}
                </Text>
              </div>
              {contract.notes && (
                <Text
                  type="secondary"
                  italic
                  style={{ fontSize: 12, display: "block" }}
                >
                  Notes: {contract.notes}
                </Text>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <Text style={{ fontSize: 14 }}>{contract.payment}</Text>
              <div>
                <Text
                  strong
                  type={contract.status === "Approved" ? "success" : "warning"}
                  style={{ fontSize: 12 }}
                >
                  {contract.status}
                </Text>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal with Ant Design Form */}
      <Modal
        title="Create New Contract"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          preserve={false}
        >
          <Form.Item
            label="Select Influencers"
            name="influencers"
            rules={[
              { required: true, message: "Please select at least one influencer" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select influencers"
              optionFilterProp="children"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              allowClear
              maxTagCount="responsive"
            >
              {influencerList.map((inf) => (
                <Option key={inf.id} value={inf.id}>
                  {inf.name} ({inf.platform})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Deliverables"
            name="deliverables"
            rules={[
              { required: true, message: "Please input deliverables" },
            ]}
          >
            <Input placeholder="e.g. 2 Reels + 1 Story" />
          </Form.Item>

          <Form.Item
            label="Due Date"
            name="dueDate"
            rules={[
              { required: true, message: "Please select due date" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Payment Amount (₹)"
            name="payment"
            rules={[
              { required: true, message: "Please input payment amount" },
            ]}
          >
            <InputNumber
              placeholder="e.g. 5000"
              style={{ width: "100%" }}
              min={0}
              formatter={(value) =>
                `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\₹\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item label="Notes" name="notes">
            <TextArea
              placeholder='e.g. "Include #BrandName hashtag"'
              rows={4}
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
            >
              Create Contract
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VendorContract;
