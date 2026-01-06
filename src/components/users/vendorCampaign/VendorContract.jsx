import React, { useEffect, useState } from "react";
import { Button, Typography, Modal, Spin, Empty, Skeleton, Input } from "antd";
const { TextArea } = Input;
import { RiAddLine, RiStarFill, RiStarLine } from "@remixicon/react";
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

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [closingContract, setClosingContract] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [closingLoading, setClosingLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({
    rating: "",
    feedback: "",
  });


const formatToDDMMYYYY = (dateStr) => {
  if (!dateStr) return "—";

  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [dd, mm, yyyy] = dateStr.split("-");
    return `${dd}/${mm}/${yyyy}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${dd}/${mm}/${yyyy}`;
  }

  const d = new Date(dateStr);
  if (isNaN(d)) return "—";

  return d.toLocaleDateString("en-GB");
};


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
        influencer: {
          // React element for display in the list
          display: c.influencerphoto ? (
            <div className="flex items-center gap-2">
              <img
                src={safeText(c.influencerphoto)}
                alt="Influencer"
                className="w-12 h-12 object-cover rounded-full"
                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
              />
              <span>{safeText(c.fullname)}</span>
            </div>
          ) : (
            <span>{safeText(c.fullname, `Influencer ${safeNumber(c.influencerid)}`)}</span>
          ),
          // Plain object for modal / Select value
          value: {
            id: safeNumber(c.campaignapplicationid),
            name: safeText(c.fullname),
            photo: safeText(c.influencerphoto) || null,
          },
        },
        contractStart: c.contractstartdate,
        contractEnd: c.contractenddate,
        campaignStart: safeText(campaignStart),
        campaignEnd: safeText(campaignEnd),
        productLink: c.productlink,
        vendorAddress: safeText(c.vendoraddress),
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
    // Pass the plain object for modal
    setEditingContract({
      ...contract,
      influencer: contract.influencer.value, // plain {id, name, photo}
    });
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

  // VALIDATE FEEDBACK
  const validateFeedback = () => {
    const newErrors = {};

    // Rating is required
    if (!rating) {
      newErrors.rating = "Please provide a rating.";
    }

    // If rating is given, feedback is required (10-100 chars)
    if (rating) {
      if (!feedback || feedback.trim().length < 10) {
        newErrors.feedback = "Please write at least 10 characters about the influencer.";
      } else if (feedback.trim().length > 250) {
        newErrors.feedback = "Feedback cannot exceed 250 characters.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSkipClose = () => {
    setErrors({});
    handleCloseContract();
  };

  const handleSubmitClose = () => {
    if (!validateFeedback()) return;
    handleCloseContract();
  };

  const handleCloseContract = async () => {
    try {
      setClosingLoading(true);

      const payload = {
        p_contractid: closingContract.id,
        //influencerid: closingContract.influencerId,
        p_text: feedback || null,
        p_rating: rating || null,
      };

      const res = await axios.post(
        "/vendor/feedback",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        toast.success(res.data.message || "Contract closed successfully");

        setIsFeedbackOpen(false);
        setClosingContract(null);
        setFeedback("");

        fetchAllContracts(); // refresh list
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to close contract");
    } finally {
      setClosingLoading(false);
    }
  };



  return (
    <div className="bg-white rounded-2xl p-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className=" text-xl font-bold">
          Contracts
        </h2>
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
                You haven't created any contracts for this campaign yet.
              </span>
            }

          />
          {/* <button
            onClick={() => {
              setEditingContract(null);
              setIsModalOpen(true);
            }}
            className="bg-[#0D132D] text-white text-md py-2 px-4 rounded flex items-center gap-2"
          >
            <RiAddLine size={20} />
            Create Contract
          </button> */}

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
                  {contract.influencer.display}
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
                    : contract.status === "Completed"
                      ? "bg-emerald-600 text-white"
                      : contract.status === "Closed"
                        ? "bg-gray-700 text-white"
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
                    {contract.influencer.display}
                  </h3>

                  {/* 📱 MOBILE ACTION BUTTONS */}
                  <div className="flex sm:hidden gap-2 mt-3">
                    {contract.status === "Rejected" && (
                      <button
                        onClick={() => handleEdit(contract)}
                        className="flex-1 py-2 text-xs cursor-pointer font-medium 
                 bg-blue-600 text-white rounded-lg 
                 active:scale-95 transition cursor-pointer"
                      >
                        Edit Contract
                      </button>
                    )}

                    {contract.status === "Completed" && (
                      <button
                        onClick={() => {
                          setClosingContract(contract);
                          setIsFeedbackOpen(true);
                        }}
                        className="flex-1 py-2 text-xs cursor-pointer font-medium 
                 bg-red-600 text-white rounded-lg 
                 active:scale-95 transition"
                      >
                        Close Contract
                      </button>
                    )}
                  </div>


                  {/* DETAILS GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">

                    {/* Contract Dates */}
                    <div>
                      <p className="text-gray-500 text-sm">Contract Duration</p>
                      <p className="text-gray-900 font-semibold">
                        {formatToDDMMYYYY(contract?.contractStart)}
                        <span className="mx-1 font-medium">{" "}{"-"}{" "}</span>
                        {formatToDDMMYYYY(contract?.contractEnd)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm">Campaign Window</p>
                      <p className="text-gray-900 font-semibold">
                        {formatToDDMMYYYY(contract?.campaignStart)}
                        <span className="mx-1 font-medium">{" "}{"-"}{" "}</span>
                        {formatToDDMMYYYY(contract?.campaignEnd)}
                      </p>
                    </div>
                    {/* Product + Address */}
                    <div className="sm:col-span-2 space-y-1">
                      <p className="break-all">
                        <span className="font-medium">Product: </span>

                        {contract?.productLink && contract.productLink.trim() !== "" ? (
                          <a
                            href={
                              contract.productLink.startsWith("http")
                                ? contract.productLink
                                : `https://${contract.productLink}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View Link
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </p>

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
                              onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
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
                      className="px-4 py-2 text-xs cursor-pointer font-medium bg-blue-600 text-white 
              rounded-lg hover:bg-blue-700 transition"
                    >
                      Edit Contract
                    </button>
                  )}
                  {contract.status === "Completed" && (
                      <button
                        type="button"
                        onClick={() => {
                          setClosingContract(contract);
                          setIsFeedbackOpen(true);
                        }}
                        className="
                          px-5 py-2
                          text-sm font-semibold
                          rounded-full
                          cursor-pointer
                          bg-red-600 text-white
                          hover:bg-red-700
                          transition
                          whitespace-nowrap
                          w-auto
                          inline-flex items-center justify-center
                        "
                      >
                        Close Contract
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
          setErrors({});
          setRating(0);
          setFeedback("");
        }}
        campaignId={campaignId}
        existingCampaignStart={campaignStart}
        existingCampaignEnd={campaignEnd}
        editData={editingContract}
        onSubmit={handleSubmit}
      />


      <Modal
        open={isFeedbackOpen}
        title="Close Contract"
        onCancel={() => {
          setIsFeedbackOpen(false);
          setClosingContract(null);
          setFeedback("");
          setRating(0);
        }}
        footer={[
          <Button
            key="skip"
            onClick={handleSkipClose}
            loading={closingLoading}
          >
            Skip & Close
          </Button>,
          <Button
            key="submit"
            type="primary"

            onClick={handleSubmitClose}
            loading={closingLoading}
          >
            Submit & Close
          </Button>

        ]}
      >
        <p className="text-gray-600 mb-3 text-sm">
          Optional: Share your experience for this contract.
        </p>

        {/* ⭐ RATING */}
        <p className="font-medium text-gray-800 mb-2">Overall Rating</p>
        <div className="mb-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => {
                  setRating(star);
                  setErrors((prev) => ({ ...prev, rating: "" }));
                }}
                className="cursor-pointer transition-transform active:scale-95"
              >
                {star <= rating ? (
                  <RiStarFill
                    size={26}
                    className="text-yellow-400"
                    style={{ stroke: "black", strokeWidth: 0.6 }}
                  />
                ) : (
                  <RiStarLine
                    size={26}
                    className="text-yellow-400"
                  />
                )}
              </span>
            ))}
          </div>

          {errors.rating && (
            <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
          )}
        </div>


        {/* ✍️ FEEDBACK */}
        <p className="font-medium text-gray-800 mb-2">Feedback</p>

<TextArea
  rows={4}
  maxLength={250}
  value={feedback}
  showCount
  onChange={(e) => {
    setFeedback(e.target.value);
    setErrors((prev) => ({ ...prev, feedback: "" }));
  }}
  placeholder="Write something about the influencer (10–100 chars if rating given)"
  className="w-full border rounded-lg text-sm"
  style={{
    resize: "none",
  }}
/>

{errors.feedback && (
  <p className="text-red-500 text-xs mt-1">{errors.feedback}</p>
)}



      </Modal>


    </div>
  );
};

export default VendorContract;
