import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  RiFileList3Line,
  RiCheckLine,
  RiCloseLine,
  RiEdit2Line,
  RiStarLine,
  RiStarFill,
  RiCalendar2Line,
} from "react-icons/ri";
import { safeNumber, safeText } from "../../../../App/safeAccess";
import { Modal, Button, Input } from "antd";
import { toast } from "react-toastify";
const { TextArea } = Input;

// Shown when no contract exists
const NoContractOffered = () => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">
    <div className="bg-gray-100 p-6 rounded-full mb-4">
      <RiFileList3Line className="text-4xl text-gray-500" />
    </div>
    <h2 className="text-lg font-semibold text-gray-800 mb-2">
      No Contract Offered Yet
    </h2>
    <p className="text-gray-500 max-w-md">
      When the brand sends a contract for this campaign, it will appear here.
      You will be notified once it is available for your review.
    </p>
  </div>
);

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

const formatToINR = (amount) => {
  if (isNaN(amount)) return "₹0";
  return `₹${new Intl.NumberFormat("en-IN").format(amount)}`;
};


const ContractTab = ({ campaignId, token }) => {
  const [contract, setContract] = useState(null);
  const [contractStatus, setContractStatus] = useState(null);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // "accept" | "reject"
  const [actionLoading, setActionLoading] = useState(false);

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [closingLoading, setClosingLoading] = useState(false);
  const [errors, setErrors] = useState({});


  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [isViewFeedbackOpen, setIsViewFeedbackOpen] = useState(false);

  const fetchContractDetails = async () => {
    try {
      const res = await axios.get(`/user/contract-detail/${campaignId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const api = res?.data?.data;

      // If API returns nothing → Show No Contract Component
      if (!api) {
        setContract(null);
        setContractStatus(null);

        return;
      }

      // Map + Safe handling
      const mapped = {
        id: safeText(api.contractid),
        contractStart: safeText(api.contractstartdate), // already in dd-mm-yyyy
        contractEnd: safeText(api.contractenddate),
        campaignStart: safeText(api.campaignstartdate),
        campaignEnd: safeText(api.campaignenddate),
        payment:  formatToINR(safeNumber(api.paymentamount, 0)),
        deliverables: safeText(api.providercontenttype, "N/A"),
        notes: safeText(api.note),
        productLink: api.productlink,
        vendorAddress: safeText(api.vendoraddress),
        status: safeText(api.statusname)?.toLowerCase(), // "Pending" → "pending"
        canviewfeedback: Boolean(api.feedback),
        cansendfeedback: Boolean(api.cansendfeedback),
        feedback: api.feedback || null,
      };

      setContract(mapped);
      setContractStatus(mapped.status);
    } catch (error) {
      console.error(error);
      setContract(null); // <— Clear previous data
      setContractStatus(null);
    }
  };

  useEffect(() => {
    fetchContractDetails();
  }, []);

  const openConfirm = (action) => {
    setPendingAction(action); // "accept" or "reject"
    setConfirmVisible(true);
  };

  const confirmAccept = () => openConfirm("accept");
  const confirmReject = () => openConfirm("reject");

  const executeAction = async () => {
    if (!pendingAction || !contract?.id) {
      toast.error("Invalid action or contract not found.");
      return;
    }

    try {
      setActionLoading(true);

      const mappedStatus = pendingAction === "accept" ? "Accepted" : "Rejected";

      const payload = {
        p_influencerid: null,
        p_contractid: contract.id,
        p_statusname: mappedStatus,
      };

      const res = await axios.post("/user/contract/approve-reject", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Extract backend response
      const message = res?.data?.message || "Status updated.";

      toast.success(message);

      // Update UI status
      setContractStatus(pendingAction === "accept" ? "accepted" : "rejected");

      setConfirmVisible(false);
    } catch (error) {
      console.error("Contract action error:", error);

      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const validateFeedback = () => {
    const newErrors = {};

    if (!rating || rating < 1) {
      newErrors.rating = "Please select at least one star";
    }
    if (feedback && feedback.trim().length < 10) {
      newErrors.feedback = "Feedback must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addFeedback = async () => {
    if (rating && feedback.trim().length < 10) {
      setErrors({ feedback: "Feedback must be at least 10 characters" });
      return;
    }

    try {
      setClosingLoading(true);

      const res = await axios.post(
        "/user/add-feedback",
        {
          p_contractid: contract.id,
          p_rating: rating,
          p_text: feedback || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Only mark as submitted if API returns success
      if (res.status === 200 && res.data?.success !== false) {
        toast.success(res.data?.message || "Feedback submitted successfully");

        // Close modal and reset
        setIsFeedbackOpen(false);
        setFeedback("");
        setRating(0);
        setErrors({});

        // Hide "Give Feedback" button
        setFeedbackSubmitted(true);
      } else {
        toast.error(res.data?.message || "Failed to submit feedback");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setClosingLoading(false);
    }
  };


  const handleSubmitClose = () => {
    if (!validateFeedback()) return;
    addFeedback();
  };

  const handleCloseModal = () => {
    setIsFeedbackOpen(false);
    setFeedback("");
    setRating(0);
    setErrors({});
  };

  if (!contractStatus) return <NoContractOffered />;

  // MODERN CONTRACT CARD UI
  const renderContractCard = () => (
    <div className="flex flex-col items-center">
      <div
        className="w-full bg-white/70 backdrop-blur-xl 
        border border-gray-200 rounded-2xl shadow-lg p-4 sm:p-6
        transition-all duration-300"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          {/* Left title */}
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <RiFileList3Line className="text-[#0f122f]" />
            Contract
          </h2>

          {/* Right actions */}
          <div className="absolute top-0 right-0 flex ">
            {contractStatus !== "pending" && (
              <span
                className={`px-4 py-1.5 rounded-bl-xl text-sm font-semibold
                  ${contractStatus === "accepted"
                    ? "bg-green-100 text-green-700"
                    : contractStatus === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
              >
                {contractStatus?.charAt(0).toUpperCase() +
                  contractStatus.slice(1)}
              </span>
            )}
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
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 text-sm text-gray-600 mt-10">
          <div className="sm:col-span-2 w-full bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Contract Duration */}
              <div>
                <p className="text-[12px] uppercase tracking-wide text-gray-400 font-medium">
                  Contract Duration
                </p>
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 mt-1 whitespace-nowrap">
                  <RiCalendar2Line className="text-gray-400" size={16} />
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
                  <RiCalendar2Line className="text-gray-400" size={16} />
                  {formatToDDMMYYYY(contract?.campaignStart)}
                  <span className="text-gray-400">-</span>
                  {formatToDDMMYYYY(contract?.campaignEnd)}
                </p>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
            {/* LEFT: DELIVERABLES */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Deliverables
              </p>

              <div className="flex flex-col gap-2">
                {contract.deliverables.map((platform, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <img
                      src={platform.iconpath}
                      alt={platform.provider}
                      className="w-4 h-4 mt-1 rounded-full"
                      onError={(e) =>
                        (e.target.src = "/Brocken-Defualt-Img.jpg")
                      }
                    />

                    <div className="flex flex-wrap gap-2">
                      {platform.contenttypes.map((ct, ctIdx) => (
                        <span
                          key={ctIdx}
                          className="px-2 py-1 text-[11px]
                bg-blue-50 text-blue-700
                border border-blue-200 rounded-md"
                        >
                          {ct.contenttypename}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: PRODUCT + ADDRESS (FULL WIDTH) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <p className="text-gray-900 text-sm font-medium">Product:</p>

                {contract?.productLink && contract.productLink.trim() !== "" ? (
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

              <div>
                <p className="text-sm font-semibold text-gray-900">Address:</p>
                <p className="text-sm text-gray-700 leading-relaxed mt-1">
                  {contract.vendorAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NOTES */}
        {contract.notes && (
          <div className="mb-8">
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 mt-5">
              <p className="text-xs text-gray-500 italic leading-relaxed">
                <span className="font-semibold not-italic text-gray-600">
                  Note :
                </span>{" "}
                “{contract.notes}”
              </p>
            </div>
          </div>
        )}

        {/* ACTION FOOTER */}
        <div className="flex justify-end gap-4">
          {contractStatus === "pending" && (
            <>
              <button
                onClick={confirmReject}
                className="px-6 py-2 rounded-lg border border-gray-300 
                text-gray-700 hover:bg-gray-100 transition font-medium"
              >
                Reject
              </button>
              <button
                onClick={confirmAccept}
                className="px-6 py-2 rounded-lg bg-[#0f122f] text-white 
                hover:bg-[#23265a] transition font-medium"
              >
                Accept Contract
              </button>
            </>
          )}

          {contractStatus === "accepted" && (
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-md">
              <RiCheckLine className="text-xl" />
              Accepted
            </div>
          )}

          {contractStatus === "rejected" && (
            <div className="flex items-center gap-2 bg-red-100 text-red-700 px-5 py-2 rounded-md">
              <RiCloseLine className="text-xl" />
              Rejected
            </div>
          )}

          {/* Feedback button only when closed */}
          {contract?.cansendfeedback && !feedbackSubmitted && (
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="px-4 py-2 text-sm rounded-full cursor-pointer font-medium text-white bg-[#0f122f] hover:bg-[#1c1f4a] transition"
            >
              Give Feedback
            </button>
          )}

          {contractStatus === "closed" && contract?.feedback && (
            <button
              onClick={() => setIsViewFeedbackOpen(true)}
              className="
      px-4 py-2
      text-xs font-medium
      bg-emerald-600 text-white
      rounded-lg
      hover:bg-emerald-700
      transition
    "
            >
              View Feedback
            </button>
          )}
        </div>
      </div>

      <Modal
        title={
          pendingAction === "accept" ? "Accept Contract" : "Reject Contract"
        }
        open={confirmVisible}
        onOk={executeAction}
        onCancel={() => setConfirmVisible(false)}
        okText="Confirm"
        cancelText="Cancel"
        okButtonProps={{
          loading: actionLoading,
          danger: pendingAction === "reject",
          type: pendingAction === "reject" ? "primary" : "default",
        }}
      >
        <p className="text-gray-700">
          {pendingAction === "accept"
            ? "Are you sure you want to accept this contract?"
            : "Are you sure you want to reject this contract?"}
        </p>
      </Modal>

      <Modal
        open={isFeedbackOpen}
        title="Add Feedback"
        footer={null}
        onCancel={() => {
          setIsFeedbackOpen(false);
          setFeedback("");
          setRating(0);
          setErrors({});
        }}
      >
        <p className="text-gray-600 mb-3 text-sm">
          Share your experience for this contract.
        </p>

        {/* ⭐ Rating */}
        <p className="font-medium text-gray-800 mb-2">
          Overall Rating <span className="text-red-500">*</span>
        </p>
        <div className="mb-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => {
                  setRating(star);
                  setErrors((prev) => ({ ...prev, rating: "" }));
                }}
                style={{ stroke: "black", strokeWidth: 0.6 }}
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

        <p className="font-medium text-gray-800 mb-2">Feedback</p>

        <TextArea
          rows={4}
          maxLength={250}
          showCount
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value);
            setErrors((prev) => ({ ...prev, feedback: "" }));
          }}
          placeholder="Write something about the influencer (10–100 chars if rating given)"
          className={`feedback-textarea ${errors.feedback ? "feedback-error" : ""}`}
          style={{ resize: "none" }}
        />

        {errors.feedback && (
          <p className="text-red-500 text-xs mt-1">{errors.feedback}</p>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={handleCloseModal}>Close</Button>

          <Button
            type="primary"
            loading={closingLoading}
            onClick={handleSubmitClose}
          >
            Submit
          </Button>
        </div>
      </Modal>

      <Modal
        open={isViewFeedbackOpen}
        title={<span className="text-lg font-semibold">Contract Feedback</span>}
        footer={null}
        centered
        onCancel={() => {
          setIsViewFeedbackOpen(false);
        }}
      >
        {contract?.feedback ? (
          <div className="flex flex-col gap-6">
            {/* Rating */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Rating:</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) =>
                  star <= contract.feedback.rating ? (
                    <RiStarFill
                      key={star}
                      size={22}
                      className="text-yellow-400"
                      style={{ stroke: "black", strokeWidth: 1 }}
                    />
                  ) : (
                    <RiStarLine key={star} size={22} />
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
                  “{contract.feedback.text || "—"}”
                </p>
              </div>
            </div>

            {/* Done button */}
            <div className="flex justify-end">
              <Button
                type="primary"
                onClick={() => setIsViewFeedbackOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <Empty description="No feedback available" />
        )}
      </Modal>
    </div>
  );

  // UPDATED STATE UI
  if (contractStatus === "updated") {
    return (
      <div className="text-center py-16 px-6">
        <div className="bg-blue-100 p-6 rounded-full mb-4 inline-block">
          <RiEdit2Line className="text-4xl text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-blue-800 mb-2">
          Contract Updated
        </h2>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          The brand has updated the contract. Please review the new terms before
          accepting.
        </p>
        {renderContractCard()}
      </div>
    );
  }

  // Default view (offered / accepted / rejected)
  return renderContractCard();
};

export default ContractTab;
