import React, { useEffect, useState } from "react";
import { Button, Typography, Modal, Spin, Empty, Skeleton, Input } from "antd";
const { TextArea } = Input;
import {
  RiAddLine,
  RiStarFill,
  RiStarLine,
  RiCalendar2Line,
} from "@remixicon/react";
import ContractModal from "./ContractModal";
import api from "../../../api/axios";import { useSelector } from "react-redux";
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
  const [errors, setErrors] = useState({ rating: "", feedback: "" });

  const [isViewFeedbackOpen, setIsViewFeedbackOpen] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [contractFeedback, setContractFeedback] = useState(null);

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
      const res = await api.get(`/vendor/contract/list/${campaignId}`, {
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
            <span>
              {safeText(c.fullname, `Influencer ${safeNumber(c.influencerid)}`)}
            </span>
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
        canviewfeedback: Boolean(c.canviewfeedback ?? c.isfeedback),
        deliverables: safeArray(c.providercontenttype).map((p) => ({
          icon: safeText(p.iconpath),
          provider: safeText(p.providername),
          contenttypes: safeArray(p.contenttypes).map((ct) => ({
            providercontenttypeid: ct.providercontenttypeid,
            contenttypename: ct.contenttypename,
          })),
        })),
        payment: `₹${safeNumber(c.paymentamount).toLocaleString()}`,
        notes: c.note ?? null,
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

      const response = await api.post(
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
        window.location.reload();
      } else {
        toast.error(
          response.data.message || "Failed to create/update contract."
        );
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
        newErrors.feedback =
          "Please write at least 10 characters about the influencer.";
      } else if (feedback.trim().length > 250) {
        newErrors.feedback = "Feedback cannot exceed 250 characters.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Skip & Close: ignore rating/feedback completely
  const handleSkipClose = async () => {
    setErrors({});
    setClosingLoading(true);
    try {
      const payload = {
        p_contractid: closingContract.id,
        p_text: null,    // NO feedback
        p_rating: null,  // NO rating
      };

      const res = await api.post("/vendor/feedback", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        toast.success(res.data.message || "Contract closed successfully");

        setIsFeedbackOpen(false);
        setClosingContract(null);
        setFeedback("");
        setRating(0);

        fetchAllContracts();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to close contract");
    } finally {
      setClosingLoading(false);
    }
  };

  // Submit & Close: must validate rating + feedback
  const handleSubmitClose = async () => {
    if (!validateFeedback()) return;

    setClosingLoading(true);
    try {
      const payload = {
        p_contractid: closingContract.id,
        p_text: feedback.trim(),
        p_rating: rating,
      };

      const res = await api.post("/vendor/feedback", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        toast.success(res.data.message || "Contract closed successfully");

        setIsFeedbackOpen(false);
        setClosingContract(null);
        setFeedback("");
        setRating(0);

        fetchAllContracts();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to close contract");
    } finally {
      setClosingLoading(false);
    }
  };


  const fetchVendorContractFeedback = async (contract) => {
    try {
      setFeedbackLoading(true);
      setContractFeedback(null);

      const res = await api.get(
        "/vendor/contract-feedback",
        {
          params: {
            p_contractid: contract.id,
            p_influencerid: contract.influencerId,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res?.status === 200) {
        setContractFeedback(res.data.data || []);
      }
    } catch (error) {
      console.error("Fetch Vendor Contract Feedback Error:", error);
      toast.error(
        error?.response?.data?.Message || "Failed to fetch feedback"
      );
    } finally {
      setFeedbackLoading(false);
    }
  };
  const feedbackItem = safeArray(contractFeedback)[0];

  return (
    <div className="bg-white rounded-2xl p-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className=" text-xl font-bold">Contracts</h2>
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
              {/* STATUS + ACTION RIBBON */}
              <div className="absolute top-0 right-0">
                <span
                  className={`
                    px-4 py-1
                    text-xs font-semibold
                    text-white
                    rounded-bl-xl
                    ${contract.status === "Accepted"
                      ? "bg-green-600"
                      : contract.status === "Completed"
                        ? "bg-emerald-600"
                        : contract.status === "Closed"
                          ? "bg-gray-700"
                          : contract.status === "Rejected"
                            ? "bg-red-600"
                            : "bg-yellow-500"}
                  `}
                >
                  {contract.status}
                </span>
              </div>

              {/* PAYMENT */}
              <div className="absolute top-10 right-4 text-right">
                <p className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">
                  Payment
                </p>
                <p className="text-lg font-bold text-gray-900 leading-tight">
                  {contract.payment}
                </p>
              </div>
              {/* MAIN LAYOUT */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                {/* LEFT CONTENT */}
                <div className="flex flex-col gap-3 w-full">
                  {/* Influencer (desktop only) */}
                  <h3 className="hidden sm:flex text-lg font-semibold text-gray-900 items-center gap-2">
                    {contract.influencer.display}
                  </h3>

                  {/* Influencer */}
                  <div className="flex sm:hidden items-center gap-3 mb-3">
                    <img
                      src={contract?.influencer?.value?.photo || "/Brocken-Defualt-Img.jpg"}
                      alt={contract?.influencer?.value?.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                    />
                    <p className="text-base font-semibold text-gray-900">
                      {contract?.influencer?.value?.name}
                    </p>
                  </div>

                  {/* DETAILS GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mt-3">
                    {/* Contract Dates */}
                    <div className="sm:col-span-2 w-full bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Contract Duration */}
                        <div>
                          <p className="text-[12px] uppercase tracking-wide text-gray-400 font-medium">
                            Contract Duration
                          </p>
                          <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 mt-1 whitespace-nowrap">
                            <RiCalendar2Line
                              className="text-gray-400"
                              size={16}
                            />
                            {formatToDDMMYYYY(contract?.contractStart)}
                            <span className="text-gray-400">-</span>
                            {formatToDDMMYYYY(contract?.contractEnd)}
                          </p>
                        </div>

                        {/* Campaign Window */}
                        <div>
                          <p className="text-[12px] uppercase tracking-wide text-gray-400 font-medium">
                            Campaign Window
                          </p>
                          <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 mt-1 whitespace-nowrap">
                            <RiCalendar2Line
                              className="text-gray-400"
                              size={16}
                            />
                            {formatToDDMMYYYY(contract?.campaignStart)}
                            <span className="text-gray-400">-</span>
                            {formatToDDMMYYYY(contract?.campaignEnd)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Deliverables + Product/Address */}
                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* LEFT: Deliverables */}
                      <div>
                        <p className="font-medium text-gray-900">
                          Deliverables
                        </p>

                        <div className="flex flex-col gap-2 mt-2">
                          {safeArray(contract.deliverables).map(
                            (platform, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <img
                                  src={platform.icon}
                                  alt={platform.provider}
                                  className="w-4 h-4 mt-1 rounded-full"
                                  onError={(e) =>
                                    (e.target.src = "/Brocken-Defualt-Img.jpg")
                                  }
                                />
                                <div className="flex flex-wrap gap-1">
                                  {safeArray(platform.contenttypes).map(
                                    (ct, ctIdx) => (
                                      <span
                                        key={ctIdx}
                                        className="px-2 py-1 text-[11px] bg-blue-50 text-blue-700 rounded-md border border-blue-100"
                                      >
                                        {ct.contenttypename}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* RIGHT: Product + Address */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <p className="text-gray-900 text-sm font-medium">
                            Product:
                          </p>

                          {contract?.productLink &&
                            contract.productLink.trim() !== "" ? (
                            <a
                              href={
                                contract.productLink.startsWith("http")
                                  ? contract.productLink
                                  : `https://${contract.productLink}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-sm whitespace-nowrap"
                            >
                              View Link
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </div>

                        {contract.vendorAddress && (
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">Address:</span>{" "}
                            {contract.vendorAddress}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {contract.notes && (
                      <div className="sm:col-span-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                        <p className="text-gray-500 text-xs italic leading-relaxed">
                          <span className="font-semibold not-italic text-gray-600">
                            Note :
                          </span>{" "}
                          “{contract.notes}”
                        </p>
                      </div>
                    )}
                    <div className="col-span-full flex justify-end gap-3 mt-2">
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
                            w-[130px]
                            bg-[#0D132D]
                            text-white
                            text-sm font-semibold
                            p-2
                            hover:bg-[#141A3A]
                            transition
                            rounded-lg
                            cursor-pointer
                            flex items-center justify-center
                          "
                        >
                          Close Contract
                        </button>
                      )}

                      {contract.canviewfeedback === true && (
                        <button
                          type="button"
                          onClick={() => {
                            setClosingContract(contract);
                            setIsViewFeedbackOpen(true);
                            fetchVendorContractFeedback(contract);
                          }}
                          className="
                            px-4 py-2
                            text-xs font-medium
                            bg-emerald-600 text-white
                            rounded-lg
                            hover:bg-emerald-700
                            transition
                            cursor-pointer
                          "
                        >
                          View Feedback
                        </button>
                      )}
                    </div>
                  </div>
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
        footer={null}
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
                  <RiStarLine size={26} className="text-yellow-400" />
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

        <div className="flex justify-end gap-3 mt-6">
          <Button key="skip" onClick={handleSkipClose} loading={closingLoading}>
            Skip & Close
          </Button>
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmitClose}
            loading={closingLoading}
            className="!bg-[#0f122f] hover:!bg-[#1c1f4a] !border-none"
          >
            Submit & Close
          </Button>
        </div>
      </Modal>

      <Modal
        open={isViewFeedbackOpen}
        title={
          <span className="text-lg font-semibold">
            Contract Feedback
          </span>
        }
        footer={null}
        centered
        onCancel={() => {
          setIsViewFeedbackOpen(false);
          setContractFeedback(null);
          setClosingContract(null);
        }}
      >
        {feedbackItem ? (
          <div className="flex flex-col gap-6">

            {/* Rating */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Rating:
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) =>
                  star <= feedbackItem.rating ? (
                    <RiStarFill
                      key={star}
                      size={22}
                      className="text-yellow-400"
                    />
                  ) : (
                    <RiStarLine
                      key={star}
                      size={22}
                      className="text-yellow-400"
                    />
                  )
                )}
              </div>
            </div>

            {/* Feedback box */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Feedback:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <p className="text-sm text-gray-700 italic">
                  “{feedbackItem.text || "—"}”
                </p>
              </div>
            </div>

            {/* Done button */}
            <div className="flex justify-end">
              <Button
                type="primary"
                onClick={() => {
                  setIsViewFeedbackOpen(false);
                  setContractFeedback(null);
                }}
                className="!bg-[#0f122f] hover:!bg-[#1c1f4a] !border-none"
              >
                Close
              </Button>
            </div>

          </div>
        ) : (
          <Empty description="No feedback available" />
        )}
      </Modal>
    </div>
  );
};

export default VendorContract;
