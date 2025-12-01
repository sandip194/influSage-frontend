import { Modal } from "antd";
import { RiVerifiedBadgeLine } from "@remixicon/react";

const AcceptOfferModal = ({ open, onCancel, onConfirm, offer, hasSelectedApplication }) => {
  return (
    <Modal open={open} onCancel={onCancel} footer={null} centered>
      <div className="text-center">
        {/* Icon */}
        <div className="flex justify-center items-center mb-4">
          <div className="w-18 h-18 rounded-full border-2 bg-gray-100 border-gray-200 flex items-center justify-center">
            <RiVerifiedBadgeLine className="w-10 h-10 text-gray-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold">Accept Application</h2>

        {/* Warning Note if first application */}
        {!hasSelectedApplication && (
          <p className="mt-2 text-sm text-blue-800 bg-blue-50 border border-blue-200 p-3 rounded">
            ⚠ You are selecting the first application for this campaign. <br />
            After accepting, you will <strong>not be able to change the campaign start and end dates</strong>. <br />
            Please make sure your dates are correct before accepting.
          </p>
        )}


        {/* Message */}
        <p className="mt-2 text-gray-700">
          Are you sure you want to accept the application from{" "}
          <span className="font-medium">{offer?.name}</span>?
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onCancel}
            className="text-[#0D132D] px-6 py-2 cursor-pointer rounded-full border border-gray-400"
          >
            Cancel
          </button>
          <button
            className="bg-[#0D132D] text-white px-6 py-2 rounded-full cursor-pointer"
            onClick={() => onConfirm(offer)}
          >
            Accept Application
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AcceptOfferModal;
