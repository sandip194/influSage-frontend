import React, { useState } from "react";
import {
  RiFileList3Line,
  RiCheckLine,
  RiCloseLine,
  RiEdit2Line,
} from "react-icons/ri";

// 🔹 Static contract data (can later come from API)
const staticContract = {
  amount: "₹25,000",
  deadline: "28 Feb 2026",
  deliverables: "2 Reels + 3 Stories",
  platform: "Instagram",
  notes:
    "All content must feature the product prominently. The first reel should be posted by Feb 15th, and the second reel by Feb 25th. Stories should be spread out between Feb 20th and Feb 28th. Please submit all content for approval at least 72 hours before the planned posting date. Use hashtags #AwesomeBrand and #Campaign2026 in all posts.",
};

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

const ContractTab = ({ campaign }) => {
  const [contractStatus, setContractStatus] = useState(
    campaign?.contract?.status || "no_contract"
  );

  /**
   * Possible statuses:
   * - "no_contract"
   * - "offered"
   * - "accepted"
   * - "rejected"
   * - "updated"
   */

  const handleAccept = () => setContractStatus("accepted");
  const handleReject = () => setContractStatus("rejected");

  if (contractStatus === "no_contract") return <NoContractOffered />;

  // 🔹 Shared contract layout for offered, accepted, and rejected
  const renderContractCard = () => (
    <div className="flex flex-col items-center ">
      <div className="bg-white w-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Contract Details
        </h2>
        <p className="text-gray-500 mb-6">
          Review the terms of your agreement below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 mb-6">
          <div>
            <p className="text-gray-500 text-sm mb-1">Amount</p>
            <p className="text-gray-900 font-semibold text-lg">
              {staticContract.amount}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Deadlines</p>
            <p className="text-gray-900 font-semibold text-lg">
              {staticContract.deadline}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Deliverables</p>
            <p className="text-gray-900 font-semibold text-lg">
              {staticContract.deliverables}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Platform</p>
            <p className="text-gray-900 font-semibold text-lg">
              {staticContract.platform}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-500 text-sm mb-1">Notes</p>
          <p className="text-gray-800 leading-relaxed text-sm">
            {staticContract.notes}
          </p>
        </div>

        {/* 🔹 Footer area: buttons or status chip */}
        {contractStatus === "offered" && (
          <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
            <button
              onClick={handleReject}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 rounded-lg bg-[#0f122f] text-white hover:bg-[#23265a] transition"
            >
              Accept Contract
            </button>
          </div>
        )}

        {contractStatus === "accepted" && (
          <div className="flex justify-end border-t pt-6">
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium">
              <RiCheckLine className="text-lg" />
              Contract Accepted
            </div>
          </div>
        )}

        {contractStatus === "rejected" && (
          <div className="flex justify-end border-t pt-6">
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg font-medium">
              <RiCloseLine className="text-lg" />
              Contract Rejected
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render for updated state
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

  // Otherwise render normal contract card (offered / accepted / rejected)
  return renderContractCard();
};

export default ContractTab;
