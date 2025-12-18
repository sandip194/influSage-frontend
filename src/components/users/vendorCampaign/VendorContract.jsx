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
              className="relative bg-white/80 backdrop-blur-xl border border-gray-200 
      rounded-xl p-4 sm:p-5 shadow-md hover:shadow-xl 
      transition-all duration-300"
            >
              {/* 🔹 MOBILE HEADER: Influencer + Status + Payment */}
              <div className="flex sm:hidden justify-between items-start mb-3">
                {/* Influencer */}
                <div className="flex items-center gap-2">
                  {contract.influencer}
                </div>

                {/* Status + Payment */}
                <div className="flex flex-col items-end">
                  <p className="text-lg font-bold text-gray-900 leading-none mt-5" >
                    {contract.payment}
                  </p>
                </div>
              </div>

              {/* STATUS RIBBON - visible on all screen sizes */}
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


              {/* MAIN LAYOUT */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">

                {/* LEFT CONTENT */}
                <div className="flex flex-col gap-3 w-full">

                  {/* Influencer (desktop only) */}
                  <h3 className="hidden sm:flex text-lg font-semibold text-gray-900 items-center gap-2">
                    {contract.influencer}
                  </h3>

                  {/* DETAILS GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">

                    {/* Contract Dates */}
                    <div>
                      <p className="font-medium text-gray-800">Contract Duration</p>
                      <p className="text-xs sm:text-sm">
                        {contract.contractStart} → {contract.contractEnd}
                      </p>
                    </div>

                    {/* Campaign Dates */}
                    <div>
                      <p className="font-medium text-gray-800">Campaign Dates</p>
                      <p className="text-xs sm:text-sm">
                        {contract.campaignStart} → {contract.campaignEnd}
                      </p>
                    </div>

                    {/* Product + Address */}
                    <div className="sm:col-span-2 space-y-1">
                      {contract.productLink && (
                        <p className="break-all">
                          <span className="font-medium">Product: </span>
                          <a
                            href={contract.productLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View Link
                          </a>
                        </p>
                      )}

                      {contract.vendorAddress && (
                        <p>
                          <span className="font-medium">Address: </span>
                          {contract.vendorAddress}
                        </p>
                      )}
                    </div>

                    {/* Deliverables */}
                    <div className="sm:col-span-2">
                      <p className="font-medium text-gray-800">Deliverables</p>
                      <div className="flex flex-col gap-2 mt-1">
                        {safeArray(contract.deliverables).map((platform, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <img
                              src={platform.icon}
                              alt={platform.provider}
                              className="w-4 h-4 mt-1 rounded-full"
                            />
                            <div className="flex flex-wrap gap-1">
                              {safeArray(platform.contenttypes).map((ct, ctIdx) => (
                                <span
                                  key={ctIdx}
                                  className="px-2 py-1 text-[11px] bg-blue-50 text-blue-700 rounded-md border border-blue-100"
                                >
                                  {ct.contenttypename}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {contract.notes && (
                      <div className="sm:col-span-2">
                        <p className="italic text-gray-500 text-xs">
                          “{contract.notes}”
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE – DESKTOP ONLY */}
                <div className="hidden sm:flex flex-col items-end gap-3 min-w-[120px]">
                  <p className="text-lg font-semibold text-gray-900 mt-3">
                    {contract.payment}
                  </p>

                  {contract.status === "Rejected" && (
                    <button
                      onClick={() => handleEdit(contract)}
                      className="px-4 py-2 text-xs font-medium bg-blue-600 text-white 
              rounded-lg hover:bg-blue-700 transition"
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
