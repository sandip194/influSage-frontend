import React, { useState } from "react";
import { Button, Typography, Modal } from "antd";
import { RiAddLine } from "@remixicon/react";
import ContractModal from "./ContractModal";

const { Title, Text } = Typography;

const VendorContract = ({ campaignStart, campaignEnd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingContract, setEditingContract] = useState(null);

  const [contracts, setContracts] = useState([
    {
      id: "CONT-001",
      influencerId: 2,
      influencer: "Aditi Sharma",
      contractStart: "01 Feb 2025",
      contractEnd: "28 Feb 2025",
      campaignStart: "05 Feb 2025",
      campaignEnd: "25 Feb 2025",
      deliverables: "Reel (Instagram), Story (Instagram)",
      payment: "₹25,000",
      notes: "Use #Brand hashtags",
      status: "Approved",
    },
    {
      id: "CONT-002",
      influencerId: 1,
      influencer: "John Carter",
      contractStart: "10 Mar 2025",
      contractEnd: "20 Mar 2025",
      campaignStart: "12 Mar 2025",
      campaignEnd: "18 Mar 2025",
      deliverables: "Post (Instagram) + Short (YouTube)",
      payment: "₹18,000",
      notes: "Shoot outdoors only",
      status: "Pending",
    },
    {
      id: "CONT-003",
      influencerId: 5,
      influencer: "Maya Patel",
      contractStart: "01 Apr 2025",
      contractEnd: "15 Apr 2025",
      campaignStart: "03 Apr 2025",
      campaignEnd: "12 Apr 2025",
      deliverables: "Reel (Instagram)",
      payment: "₹12,000",
      notes: "",
      status: "Rejected",
    },
  ]);


  // Static influencer data
  const influencerList = [
    { id: 1, name: "John Carter", platform: "Instagram", followers: "45k" },
    { id: 2, name: "Aditi Sharma", platform: "YouTube", followers: "120k" },
    { id: 3, name: "Rahul Mehta", platform: "Instagram", followers: "60k" },
    { id: 4, name: "Sana Khan", platform: "TikTok", followers: "30k" },
    { id: 5, name: "Maya Patel", platform: "Instagram", followers: "75k" },
  ];

  // Convert deliverables array to readable string
  const formatDeliverables = (deliverables) => {
    return deliverables
      .map((p) =>
        p.contentTypes
          .map((ct) => `${ct.contenttypename} (${p.providername})`)
          .join(", ")
      )
      .join(" + ");
  };

  // OPEN MODAL TO EDIT
  const handleEdit = (contract) => {
    setEditingContract(contract);
    setIsModalOpen(true);
  };

  // CREATE OR UPDATE CONTRACT
  const handleSubmit = (values) => {
    if (values.campaignEnd.isBefore(values.campaignStart)) {
      Modal.error({
        title: "Invalid Dates",
        content: "End date cannot be earlier than start date!",
      });
      return;
    }

    const influencer = influencerList.find(
      (inf) => inf.id === values.influencer
    );

    const formattedContract = {
      id: editingContract ? editingContract.id : `CONT-${contracts.length + 1}`,
      influencerId: values.influencer,
      influencer: influencer?.name,
      contractStart: values.contractStart.format("DD MMM YYYY"),
      contractEnd: values.contractEnd.format("DD MMM YYYY"),
      campaignStart: values.campaignStart.format("DD MMM YYYY"),
      campaignEnd: values.campaignEnd.format("DD MMM YYYY"),
      deliverables: formatDeliverables(values.deliverables),
      payment: `₹${values.payment.toLocaleString()}`,
      notes: values.notes,
      status: editingContract ? editingContract.status : "Pending",
    };

    if (editingContract) {
      // Update
      setContracts((prev) =>
        prev.map((c) => (c.id === editingContract.id ? formattedContract : c))
      );

      Modal.success({
        title: "Contract Updated",
        content: "The contract has been successfully updated.",
      });
    } else {
      // Create
      setContracts((prev) => [...prev, formattedContract]);

      Modal.success({
        title: "Contract Created",
        content: "Your contract has been created successfully.",
      });
    }

    setEditingContract(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl p-0">
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>Contracts</Title>
        <Button
          icon={<RiAddLine size={20} />}
          onClick={() => {
            setEditingContract(null);
            setIsModalOpen(true);
          }}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          Create Contract
        </Button>
      </div>

      {/* MODERN CONTRACT LIST */}
      <div className="space-y-4 mb-4">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="relative bg-white/70 backdrop-blur-xl border border-gray-200 
      rounded-xl p-5 shadow-md hover:shadow-xl 
      transition-all duration-300 cursor-pointer group"
          >
            {/* STATUS RIBBON */}
            <span
              className={`absolute top-0 right-0 px-3 py-1 text-xs font-semibold rounded-bl-xl 
        ${contract.status === "Approved"
                  ? "bg-green-500 text-white"
                  : contract.status === "Rejected"
                    ? "bg-red-500 text-white"
                    : "bg-yellow-500 text-white"
                }`}
            >
              {contract.status}
            </span>

            <div className="flex justify-between items-start gap-6">

              {/* LEFT SIDE → Details */}
              <div className="flex flex-col gap-2 w-full">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-blue-600">●</span>
                  {contract.influencer}
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">

                  <div>
                    <p className="font-medium text-gray-800">Contract Duration</p>
                    <p>{contract.contractStart} → {contract.contractEnd}</p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-800">Campaign Dates</p>
                    <p>{contract.campaignStart} → {contract.campaignEnd}</p>
                  </div>

                  <div className="col-span-2">
                    <p className="font-medium text-gray-800">Deliverables</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {contract.deliverables.split(",").map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs 
                    border border-blue-100"
                        >
                          {item.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {contract.notes && (
                    <div className="col-span-2 mt-1">
                      <p className="italic text-gray-500 text-xs">"{contract.notes}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE → Payment + Buttons */}
              <div className="flex flex-col items-end gap-3 min-w-[120px]">
                <p className="text-lg font-semibold text-gray-900 mt-3">
                  {contract.payment}
                </p>

                <button
                  onClick={() => handleEdit(contract)}
                  className="px-4 py-1.5 text-xs font-medium bg-blue-600 text-white 
            rounded-lg opacity-0 group-hover:opacity-100 transition-all
            hover:bg-blue-700 shadow-sm"
                >
                  Edit Contract
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>


      {/* CONTRACT MODAL */}
      <ContractModal
        isOpen={isModalOpen}
        onClose={() => {
          setEditingContract(null);
          setIsModalOpen(false);
        }}
        influencerList={influencerList}
        existingCampaignStart={campaignStart}
        existingCampaignEnd={campaignEnd}
        editData={editingContract}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default VendorContract;
