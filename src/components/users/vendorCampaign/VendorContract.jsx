import React, { useEffect, useState } from "react";
import { Button, Typography, Modal, Spin, Empty, Skeleton } from "antd";
import { RiAddLine } from "@remixicon/react";
import ContractModal from "./ContractModal";
import axios from "axios";
import { useSelector } from "react-redux";
import { safeNumber, safeText, safeArray } from "../../../App/safeAccess";
import { toast } from "react-toastify";


const { Title } = Typography;

const VendorContract = ({ campaignId, campaignStart, campaignEnd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const [contracts, setContracts] = useState([]);

  // Fetch contracts from API
  const fetchAllContracts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/vendor/contract/list/${campaignId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiContracts = safeArray(res?.data?.data);

      const formattedContracts = apiContracts.map((c) => ({
        id: safeNumber(c.contractid),
        influencerId: safeNumber(c.influencerid),
        influencerSelectId: safeNumber(c.campaignapplicationid),
        influencer: c.influencerphoto ? (
          <div className="flex items-center gap-2">
            <img
              src={safeText(c.influencerphoto)}
              alt="Influencer"
              className="w-12 h-12 object-cover rounded-full"
            />
            <span>{safeText(c.fullname)}</span> {/* show fullname */}
          </div>
        ) : safeText(c.fullname, `Influencer ${safeNumber(c.influencerid)}`),
        contractStart: c.contractstartdate,
        contractEnd: c.contractenddate,
        campaignStart: safeText(campaignStart),
        campaignEnd: safeText(campaignEnd),
        productLink: safeText(c.productlink, "N/A"),
        vendorAddress: safeText(c.vendoraddress, "N/A"),
        deliverables: safeArray(c.providercontenttype).map((p) => ({
          icon: safeText(p.iconpath),
          provider: safeText(p.providername),
          contenttypes: safeArray(p.contenttypes).map((ct) => ({
            providercontenttypeid: ct.providercontenttypeid,
            contenttypename: ct.contenttypename,
          })),
        })),
        payment: `₹${safeNumber(c.paymentamount).toLocaleString()}`,
        notes: safeText(c.note),
        status: safeText(c.statusname, "Pending"),
      }));

      setContracts(formattedContracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContracts();
  }, []);

  // Open modal to edit
  const handleEdit = (contract) => {
    setEditingContract(contract);
    setIsModalOpen(true);
  };

  // Submit contract (create/update)
  const handleSubmit = async (values) => {
    try {
      const contractPayload = {
        contractstartdate: values.contractStart.format("DD-MM-YYYY"),
        contractenddate: values.contractEnd.format("DD-MM-YYYY"),
        paymentamount: values.payment,
        productlink: values.productLink,
        vendoraddress: values.vendorAddress,
        note: values.notes,
      };

      const payload = {
        p_campaignapplicationid: Number(values?.influencers),
        p_contractid: editingContract ? editingContract.id : null,
        p_contractjson: contractPayload,
        p_contenttypejson: values.deliverables,
      };

      const response = await axios.post(
        "/vendor/create-or-edit/contract",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.status === 200) {
        toast.success(response.data.message || "Contract saved successfully.");

        // CLOSE MODAL
        setEditingContract(null);
        setIsModalOpen(false);

        // REFRESH FROM API ONLY
        fetchAllContracts();

      } else {
        toast.error(response.data.message || "Failed to create/update contract.");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Something went wrong while saving the contract.");
    }
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

      {loading ? (
        // 🔵 ANT DESIGN LOADING SKELETON
        <div className="p-6">
          <Skeleton active paragraph={{ rows: 4 }} avatar />
          <Skeleton active paragraph={{ rows: 4 }} avatar />
        </div>
      ) : contracts.length === 0 ? (
        // 🟡 ANT DESIGN EMPTY STATE
        <div className="flex flex-col items-center justify-center py-8">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-gray-500">
                You haven't created any contracts for this campaign yet. Start by adding one below.
              </span>
            }

          />
          <button
            onClick={() => {
              setEditingContract(null);
              setIsModalOpen(true);
            }}
            className="bg-[#0D132D] text-white text-md py-2 px-4 rounded flex items-center gap-2"
          >
            <RiAddLine size={20} />
            Create Contract
          </button>

        </div>
      ) : (
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
                ${contract.status === "Accepted"
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

                    <div className="col-span-2 mt-1 text-sm text-gray-700">
                      {contract.productLink && (
                        <p>
                          <span className="font-medium">Product Link: </span>
                          <a href={contract.productLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            {contract.productLink}
                          </a>
                        </p>
                      )}
                      {contract.vendorAddress && (
                        <p>
                          <span className="font-medium">Vendor Address: </span>
                          {contract.vendorAddress}
                        </p>
                      )}
                    </div>


                    <div className="col-span-2">
                      <p className="font-medium text-gray-800">Deliverables</p>
                      <div className="flex flex-col gap-2 mt-1">
                        {safeArray(contract.deliverables).map((platform, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <img
                              src={platform.icon}
                              alt={platform.provider}
                              className="w-5 h-5 rounded-full"
                            />
                            <div className="flex flex-wrap gap-1 text-xs text-gray-700">
                              {safeArray(platform.contenttypes).map((ct, ctIdx) => (
                                <span
                                  key={ctIdx}
                                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100"
                                >
                                  {ct.contenttypename}
                                </span>
                              ))}
                            </div>
                          </div>
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

                  {/* Show edit button only if status is Rejected */}
                  {contract.status === "Rejected" && (
                    <button
                      onClick={() => handleEdit(contract)}
                      className="px-4 py-1.5 text-xs font-medium bg-blue-600 text-white 
                        rounded-lg transition-all hover:bg-blue-700 shadow-sm"
                    >
                      Edit Contract
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTRACT MODAL */}
      <ContractModal
        isOpen={isModalOpen}
        onClose={() => {
          setEditingContract(null);
          setIsModalOpen(false);
        }}
        campaignId={campaignId}
        existingCampaignStart={campaignStart}
        existingCampaignEnd={campaignEnd}
        editData={editingContract}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default VendorContract;
