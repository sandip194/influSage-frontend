import React, { useState } from "react";
import {
  RiArrowLeftSLine,
  RiChatUploadLine,
  RiVerifiedBadgeLine,
} from "@remixicon/react";
import { Modal, Input, DatePicker, Button, Upload, message } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;

const ApplyNow = () => {
  const [amount, setAmount] = useState("");
  const [submissionDate, setSubmissionDate] = useState(null);
  const [proposal, setProposal] = useState("");
  const [portfolioFile, setPortfolioFile] = useState(null);
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [milestoneAmount, setMilestoneAmount] = useState("");
  const [milestoneDate, setMilestoneDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleUpload = (info) => {
    if (info.file.size > 5 * 1024 * 1024) {
      message.error("File size should be less than 5MB.");
      return;
    }
    setPortfolioFile(info.file);
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
    <main className="w-full max-w-7xl mx-auto text-sm overflow-x-hidden">
      <button
        onClick={() => window.history.back()}
        className="text-gray-600 flex items-center gap-2 hover:text-gray-900 transition"
      >
        <RiArrowLeftSLine /> Back
      </button>
      <h1 className="text-2xl font-semibold mb-4">Apply Now</h1>
      <div className="bg-white p-4 rounded-lg mb-6 flex flex-col">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <section>
            <h2 className="text-lg mb-2 font-bold">Description</h2>
            <p className="mb-4 text-gray-600">
              What makes you the best influencer for this campaign?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-medium text-sm mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="$0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  status={errors.amount ? "error" : ""}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-sm mb-1">
                  Submission Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  className="w-full"
                  value={submissionDate ? dayjs(submissionDate) : null}
                  onChange={(date) => setSubmissionDate(date)}
                  status={errors.submissionDate ? "error" : ""}
                />
                {errors.submissionDate && (
                  <p className="text-red-500 text-sm">
                    {errors.submissionDate}
                  </p>
                )}
              </div>
            </div>

            <label className="block font-medium text-sm mb-1">
              Describe Your Proposal <span className="text-red-500">*</span>
            </label>
            <TextArea
              rows={4}
              placeholder="Describe your proposal..."
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              status={errors.proposal ? "error" : ""}
            />
            {errors.proposal && (
              <p className="text-red-500 text-sm">{errors.proposal}</p>
            )}
          </section>

          <hr className="my-2 border-gray-200" />

          {/* Portfolio */}
          <section>
            <h2 className="text-lg font-bold mb-2">
              Portfolio <span className="text-red-500">*</span>
            </h2>
            <p className="text-gray-600 mb-4">
              Upload your portfolio or recent works
            </p>
            <Upload.Dragger
              beforeUpload={() => false}
              maxCount={1}
              onChange={handleUpload}
              accept=".png,.jpg,.jpeg,.pdf,.mp4"
              className={errors.portfolioFile ? "border-red-500" : ""}
            >
              <p className="ant-upload-drag-icon">
                <RiChatUploadLine className="text-2xl text-gray-600 mx-auto" />
              </p>
              <p className="ant-upload-text font-semibold">Upload Files</p>
              <p className="ant-upload-hint text-sm text-gray-500">
                Supported files: PNG, JPG, MP4, PDF (Max 5MB)
              </p>
            </Upload.Dragger>
            {errors.portfolioFile && (
              <p className="text-red-500 text-sm mt-1">
                {errors.portfolioFile}
              </p>
            )}
          </section>

          {/* Proposal Breakdown */}
          <section>
            <h2 className="text-lg mb-2 font-bold">Proposal Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block font-medium text-sm mb-1">
                  Description
                </label>
                <TextArea
                  rows={1}
                  placeholder="Description"
                  value={milestoneDescription}
                  onChange={(e) => setMilestoneDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium text-sm mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="$0.00"
                  value={milestoneAmount}
                  onChange={(e) => setMilestoneAmount(e.target.value)}
                  status={errors.milestoneAmount ? "error" : ""}
                />
                {errors.milestoneAmount && (
                  <p className="text-red-500 text-sm">
                    {errors.milestoneAmount}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium text-sm mb-1">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  className="w-full"
                  value={milestoneDate ? dayjs(milestoneDate) : null}
                  onChange={(date) => setMilestoneDate(date)}
                  status={errors.milestoneDate ? "error" : ""}
                />
                {errors.milestoneDate && (
                  <p className="text-red-500 text-sm">{errors.milestoneDate}</p>
                )}
              </div>
            </div>
          </section>

          <Button
            htmlType="submit"
            type="primary"
            shape="round"
            className="!bg-[#0f122f] !text-white font-semibold px-6 py-2 hover:!bg-[#23265a] transition"
          >
            Apply Now
          </Button>
        </form>
      </div>

      {/* Success Modal */}
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        closable
      >
        <div className="text-center px-6 py-4">
          <div className="bg-gray-100 rounded-full p-5 w-fit mx-auto mb-4">
            <RiVerifiedBadgeLine size={32} />
          </div>
          <h3 className="font-semibold text-lg mb-2">Applied Successfully</h3>
          <p className="text-gray-600 mb-4">
            You have successfully applied to Instagram Campaign. You can track
            your application from applied campaigns.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => {
                setIsModalVisible(false);
                window.location.href = "/dashboard/browse/";
              }}
            >
              Back To Home
            </Button>
            <Button
              type="primary"
              className="!bg-[#0f122f] !text-white font-semibold rounded px-6 py-2 hover:!bg-[#23265a] transition"
              onClick={() => {
                setIsModalVisible(false);
                window.location.href = "/dashboard/browse/";
              }}
            >
              Track Application
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
};

export default ApplyNow;
