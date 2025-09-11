import React, { useEffect, useState } from "react";
import {
  RiArrowLeftSLine,
  RiChatUploadLine,
  RiVerifiedBadgeLine,
} from "@remixicon/react";
import { Modal, Input, Button, Upload, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const { TextArea } = Input;

const ApplyNow = () => {
  const [amount, setAmount] = useState("");
  const [proposal, setProposal] = useState("");
  const [portfolioFile, setPortfolioFile] = useState(null);
  const [existingFilePath, setExistingFilePath] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false)

  const { campaignId } = useParams();
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token);

  const handleUpload = (info) => {
    if (info.file.size > 25 * 1024 * 1024) {
      message.error("File size should be less than 25MB.");
      return;
    }
    setPortfolioFile(info.file);
    setExistingFilePath(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!amount || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0.";
    }
    if (!proposal.trim()) {
      newErrors.proposal = "Please describe your proposal.";
    }
    if (!portfolioFile) {
      newErrors.portfolioFile = "Please upload your portfolio file.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return;
    // Prepare JSON payload
    const applycampaignjson = {
      amount,
      proposal,
    };

    // Prepare FormData
    const formData = new FormData();
    formData.append("applycampaignjson", JSON.stringify(applycampaignjson));
    if (portfolioFile) {
      formData.append("portfolioFiles", portfolioFile); // Backend expects this name
    }

    if (!portfolioFile && existingFilePath) {
      formData.append("existingFilePath", existingFilePath);
    }

    try {
      setLoading(true)
      const response = await axios.post(`user/apply-for-campaign/${campaignId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log(response.data)
        navigate("/dashboard/browse/applied");
      }
      toast.success(response.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Application not submited")
    } finally {
      setLoading(false)
    }
  };


  const getAppliedCampiagnDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`user/signle-applied/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data.data;
      console.log(data)
      if (res.data) {
        setIsEdit(true);
        setAmount(data.budget || "");
        setProposal(data.description || "");
        if (res.data.filepaths && res.data.filepaths.length > 0) {
          setExistingFilePath(res.data.filepaths[0].filepath);
        }
        // set form fields as above
      }

      // Assuming data contains amount, proposal, and portfolio file info

      // For portfolioFile, you might need to handle differently if it's a URL or file metadata
      // You can store the file info or URL in a separate state to show the existing file
      // For example:
      // setPortfolioFile(data.portfolioFile || null);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppliedCampiagnDetails();
  }, [])


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
            {existingFilePath && (
              <div className="mb-2">
                <p className="font-medium">Existing Portfolio File:</p>
                {/* If it's a video */}
                {existingFilePath.endsWith(".mp4") ? (
                  <video width="320" height="180" controls>
                    <source src={existingFilePath} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  // For images or PDFs, show a link or thumbnail
                  <a
                    href={existingFilePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View File
                  </a>
                )}
                <Button
                  type="link"
                  danger
                  onClick={() => {
                    setExistingFilePath(null);
                    setPortfolioFile(null);
                  }}
                >
                  Remove File
                </Button>
              </div>
            )}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-medium text-sm mb-1">
                  Proposal Amount <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  addonBefore="₹"
                  placeholder="0.00"
                  value={amount}
                  min={1}
                  onChange={(e) => setAmount(e.target.value)}
                  status={errors.amount ? "error" : ""}
                />

                {errors.amount && (
                  <p className="text-red-500 text-sm">{errors.amount}</p>
                )}
              </div>

            </div>
          </section>
          <button
            type="submit"
            disabled={loading}
            className="w-42 py-2 rounded-3xl bg-[#0f122f] cursor-pointer text-white font-semibold hover:bg-[#23265a] transition">
            {loading ? (isEdit ? "Saving..." : "Applying...") : (isEdit ? "Save" : "Apply Now")}
          </button>

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
