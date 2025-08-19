import { Modal } from "antd";
import React, { useState } from "react";
import {
  RiArrowLeftSLine,
  RiChatUploadLine,
  RiVerifiedBadgeLine,
} from "@remixicon/react";

const ApplyNow = () => {
  const [amount, setAmount] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [proposal, setProposal] = useState("");
  const [portfolioFile, setPortfolioFile] = useState(null);
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [milestoneAmount, setMilestoneAmount] = useState("");
  const [milestoneDate, setMilestoneDate] = useState("");
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFileChange = (e) => {
    setPortfolioFile(e.target.files[0]);
  };

  const validate = () => {
    const newErrors = {};

    if (!amount || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0.";
    }

    if (!submissionDate) {
      newErrors.submissionDate = "Please select a submission date.";
    }

    if (!proposal.trim()) {
      newErrors.proposal = "Please describe your proposal.";
    }

    if (!portfolioFile) {
      newErrors.portfolioFile = "Please upload your portfolio file.";
    } else if (portfolioFile.size > 5 * 1024 * 1024) {
      newErrors.portfolioFile = "File size should be less than 5 MB.";
    }

    if (!milestoneAmount || Number(milestoneAmount) <= 0) {
      newErrors.milestoneAmount = "Please enter a valid milestone amount.";
    }

    if (!milestoneDate) {
      newErrors.milestoneDate = "Please select a milestone due date.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsModalVisible(true);
    }
  };

  return (
    <main className="flex-1 bg-gray-100 overflow-y-auto">
      <button
        onClick={() => window.history.back()}
        className="text-gray-600 flex items-center gap-2 hover:text-gray-900 transition"
      >
        <RiArrowLeftSLine /> Back
      </button>
      <h1 className="text-2xl font-bold mb-6">Apply Now</h1>

      <div className="bg-white p-4 rounded-lg mb-6 flex flex-col">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description Section */}
          <section>
            <h2 className="text-lg mb-2 font-bold">Description</h2>
            <p className="mb-4 text-gray-600">
              What makes you the best influencer for this campaign?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-medium text-sm font-bold mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="$0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full border px-3 py-2 rounded ${
                    errors.amount ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-sm font-bold mb-1">
                  Submission Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={submissionDate}
                  onChange={(e) => setSubmissionDate(e.target.value)}
                  className={`w-full border px-3 py-2 rounded ${
                    errors.submissionDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.submissionDate && (
                  <p className="text-red-500 text-sm">
                    {errors.submissionDate}
                  </p>
                )}
              </div>
            </div>

            <label className="block font-medium text-sm font-bold mb-1">
              Describe Your Proposal <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe your proposal..."
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className={`w-full border px-3 py-2 rounded resize-none ${
                errors.proposal ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.proposal && (
              <p className="text-red-500 text-sm">{errors.proposal}</p>
            )}
          </section>

          <hr className="my-2 border-gray-200" />

          {/* Portfolio Upload */}
          <section>
            <h2 className="text-lg font-bold mb-2">
              Portfolio <span className="text-red-500">*</span>
            </h2>
            <p className="text-gray-600 mb-4">
              Upload your portfolio or recent works
            </p>

            <label
              htmlFor="portfolioUpload"
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 cursor-pointer text-center transition ${
                errors.portfolioFile ? "border-red-500" : "border-gray-300"
              }`}
            >
              <div className="bg-gray-100 rounded-full p-3 mb-4">
                <RiChatUploadLine className="text-2xl text-gray-600" />
              </div>
              <span
                className={`font-semibold ${
                  errors.portfolioFile ? "text-red-500" : "text-black"
                }`}
              >
                Upload Files
              </span>
              <p className="text-sm text-gray-500">
                Supported files PNG, JPG, MP4
                <br />
                Max size 5 MB
              </p>
            </label>

            <input
              id="portfolioUpload"
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,.mp4"
              onChange={handleFileChange}
              className="hidden"
            />
            {errors.portfolioFile && (
              <p className="text-red-500 text-sm">{errors.portfolioFile}</p>
            )}
          </section>

          <section>
            <h2 className="text-lg mb-2 font-bold">Proposal Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block font-medium text-sm font-bold mb-1">
                  Description
                </label>
                <textarea
                  rows={1}
                  placeholder="Description"
                  value={milestoneDescription}
                  onChange={(e) => setMilestoneDescription(e.target.value)}
                  className="w-full border px-3 py-2 rounded resize-none border-gray-300"
                />
              </div>

              <div>
                <label className="block font-medium text-sm font-bold mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="$0.00"
                  value={milestoneAmount}
                  onChange={(e) => setMilestoneAmount(e.target.value)}
                  className={`w-full border px-3 py-2 rounded ${
                    errors.milestoneAmount
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.milestoneAmount && (
                  <p className="text-red-500 text-sm">
                    {errors.milestoneAmount}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium text-sm font-bold mb-1">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={milestoneDate}
                  onChange={(e) => setMilestoneDate(e.target.value)}
                  className={`w-full border px-3 py-2 rounded ${
                    errors.milestoneDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.milestoneDate && (
                  <p className="text-red-500 text-sm">{errors.milestoneDate}</p>
                )}
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="bg-[#0f122f] text-white font-semibold rounded-full px-6 py-2 hover:bg-[#23265a] transition"
          >
            Apply Now
          </button>
        </form>
      </div>

      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        closable={true}
      >
        <div className="text-center px-6 py-4">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <div className="bg-gray-100 rounded-full p-5 mb-4">
              <RiVerifiedBadgeLine size={32} />
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2">Applied Successfully</h3>
          <p className="text-gray-600 mb-4">
            You have successfully applied to Instagram Campaign. You can track
            your application from applied campaigns.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setIsModalVisible(false);
                window.location.href = "/dashboard/browse/";
              }}
              className="border border-gray-300 rounded-full px-4 py-2 text-sm hover:bg-gray-100"
            >
              Back To Home
            </button>
            <button
              onClick={() => {
                setIsModalVisible(false);
                window.location.href = "/dashboard/browse/";
              }}
              className="bg-[#0f122f] text-white rounded-full px-4 py-2 text-sm hover:bg-[#23265a]"
            >
              Track Application
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
};

export default ApplyNow;
