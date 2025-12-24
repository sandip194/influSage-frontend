import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  RiFileList3Line,
  RiCheckLine,
  RiCloseLine,
  RiEdit2Line,
} from "react-icons/ri";
import { safeNumber, safeText } from "../../../../App/safeAccess";
import { Modal } from "antd";
import { toast } from "react-toastify";

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

const ContractTab = ({ campaignId, token }) => {

  const [contract, setContract] = useState(null);
  const [contractStatus, setContractStatus] = useState(null);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // "accept" | "reject"
  const [actionLoading, setActionLoading] = useState(false);


  const fetchContractDetails = async () => {
    try {
      const res = await axios.get(`/user/contract-detail/${campaignId}`, {
        headers: { Authorization: `Bearer ${token}` }
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
        contractStart: safeText(api.contractstartdate),     // already in dd-mm-yyyy
        contractEnd: safeText(api.contractenddate),
        campaignStart: safeText(api.campaignstartdate),
        campaignEnd: safeText(api.campaignenddate),
        payment: `₹${safeNumber(api.paymentamount, 0)}`,
        deliverables: safeText(api.providercontenttype, "N/A"),
        notes: safeText(api.note),
        productLink: safeText(api.productlink),
        vendorAddress: safeText(api.vendoraddress),
        status: safeText(api.statusname)?.toLowerCase(),   // "Pending" → "pending"
      };

      setContract(mapped);
      setContractStatus(mapped.status);

    } catch (error) {
      console.error(error);
      setContract(null);         // <— Clear previous data
      setContractStatus(null);
    }
  };


  useEffect(() => {
    fetchContractDetails();
  }, [])

  const openConfirm = (action) => {
    setPendingAction(action);        // "accept" or "reject"
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

      const mappedStatus =
        pendingAction === "accept" ? "Accepted" : "Rejected";

      const payload = {
        p_influencerid: null,
        p_contractid: contract.id,
        p_statusname: mappedStatus
      };

      const res = await axios.post(
        "/user/contract/approve-reject",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Extract backend response
      const message = res?.data?.message || "Status updated.";

      toast.success(message);

      // Update UI status
      setContractStatus(
        pendingAction === "accept" ? "accepted" : "rejected"
      );

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

  if (!contractStatus) return <NoContractOffered />;

  // MODERN CONTRACT CARD UI
  const renderContractCard = () => (
    <div className="flex flex-col items-center">
      <div
        className="w-full bg-white/70 backdrop-blur-xl 
        border border-gray-200 rounded-2xl shadow-lg p-8 
        transition-all duration-300"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <RiFileList3Line className="text-[#0f122f]" />
            Contract #{contract?.id}
          </h2>

          {contractStatus !== "pending" && (
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-semibold
                ${contractStatus === "accepted"
                  ? "bg-green-100 text-green-700"
                  : contractStatus === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
            >
              {contractStatus?.charAt(0).toUpperCase() + contractStatus.slice(1)}
            </span>
          )}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* COLUMN 1 */}
          <div className="space-y-4">


            <div>
              <p className="text-gray-500 text-sm">Contract Duration</p>
              <p className="text-gray-900 font-semibold">
                {contract.contractStart} → {contract.contractEnd}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Campaign Window</p>
              <p className="text-gray-900 font-semibold">
                {contract.campaignStart} → {contract.campaignEnd}
              </p>
            </div>
          </div>

          {/* COLUMN 2 */}
          <div className="space-y-4">
            {/* PAYMENT */}
            <div>
              <p className="text-gray-500 text-sm">Payment</p>
              <p className="text-gray-900 font-bold text-xl">
                {contract.payment}
              </p>
            </div>

            {/* DELIVERABLES */}
            <div>
              <p className="text-gray-500 text-sm">Deliverables</p>

              <div className="flex flex-col gap-2 mt-1">
                {contract.deliverables?.map((provider) => {
                  const types = provider.contenttypes
                    .map((ct) => ct.contenttypename)
                    .join(", "); // "Reel, Story"

                  return (
                    <span
                      key={provider.providerid}
                      className="px-3 py-1 bg-blue-50 border border-blue-200 
                     rounded-lg text-blue-700 text-xs font-medium w-fit"
                    >
                      {provider.providername} – {types}
                    </span>
                  );
                })}
              </div>
            </div>



            <div>
              <p className="text-gray-500 text-sm">Vendor Address</p>
              <p className="text-gray-900 font-medium">{contract.vendorAddress}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Product Link</p>
              <a
                href={contract.productLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline font-medium break-all"
              >
                {contract.productLink}
              </a>
            </div>
          </div>
        </div>



        {/* NOTES */}
        {contract.notes && (
          <div className="mb-8">
            <p className="text-gray-500 text-sm">Notes</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-1 text-sm text-gray-700 leading-relaxed">
              {contract.notes}
            </div>
          </div>
        )}

        {/* ACTION FOOTER */}
        <div className="border-t border-gray-200 pt-6 flex justify-end gap-4">
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
        </div>
      </div>

      <Modal
        title={pendingAction === "accept" ? "Accept Contract" : "Reject Contract"}
        open={confirmVisible}
        onOk={executeAction}
        onCancel={() => setConfirmVisible(false)}
        okText="Confirm"
        cancelText="Cancel"
        okButtonProps={{
          loading: actionLoading,
          danger: pendingAction === "reject",
          type: pendingAction === "reject" ? "primary" : "default"
        }}
      >
        <p className="text-gray-700">
          {pendingAction === "accept"
            ? "Are you sure you want to accept this contract?"
            : "Are you sure you want to reject this contract?"}
        </p>
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
