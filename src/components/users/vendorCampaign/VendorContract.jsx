import React, { useState } from "react";
import { Button, Typography, Modal } from "antd";
import { RiAddLine } from "@remixicon/react";
import ContractModal from "./ContractModal";

const { Title, Text } = Typography;

const VendorContract = ({ campaignStart, campaignEnd }) => {
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
      startDate: "01 Dec 2025",
      endDate: "15 Dec 2025",
      deliverables: "2 Reels + 1 Story",
      payment: "₹15,000",
      notes: "Include #BrandName hashtag",
    },
  ];

  const handleSubmit = (values) => {
    // Custom date validation
    if (values.campaignEnd.isBefore(values.campaignStart)) {
      Modal.error({
        title: "Invalid Dates",
        content: "End date cannot be earlier than start date!",
      });
      return;
    }

    const selectedInfluencers = influencerList.filter((inf) =>
      values.influencers.includes(inf.id)
    );

    console.log({
      influencers: selectedInfluencers.map((i) => i.name),
      deliverables: values.deliverables,
      campaignStart: values.campaignStart?.format("DD MMM YYYY"),
      campaignEnd: values.campaignEnd?.format("DD MMM YYYY"),
      payment: values.payment,
      productLink: values.productLink,
      notes: values.notes,
    });

    Modal.success({
      title: "Contract Created",
      content: "Your contract has been created successfully.",
    });

    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>Contracts</Title>
        <Button
          icon={<RiAddLine size={20} />}
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
                  Start: {contract.startDate}
                </Text>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  End: {contract.endDate}
                </Text>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Deliverables: {contract.deliverables}
                </Text>
              </div>
              {contract.notes && (
                <Text type="secondary" italic style={{ fontSize: 12 }}>
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

      {/* Contract Modal */}
      <ContractModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        influencerList={influencerList}
        existingCampaignStart={campaignStart}
        existingCampaignEnd ={campaignEnd}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default VendorContract;
