import React, { useEffect, useState } from "react";
import { Input, Button, Upload, Modal, } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { RiArrowLeftSLine, RiVerifiedBadgeLine, RiUpload2Line } from "@remixicon/react";

// Import the reusable hook and component
import useFileUpload from "../../../hooks/useFileUpload"; // Adjust path as needed
import FilePreview from "../../common/FilePreview"; // Adjust path as needed

const { TextArea } = Input;

const ApplyNow = () => {
  const [amount, setAmount] = useState("");
  const [proposal, setProposal] = useState("");
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use the hook for all file handling
  const {
    fileList,
    existingFiles,
    deletedFilePaths,
    fileError,
    setExistingFiles,
    handleFileChange,
    handleRemove,
  } = useFileUpload();

  const { campaignId } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const validate = () => {
    const newErrors = {};
    if (!amount || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0.";
    }
    if (!proposal.trim()) {
      newErrors.proposal = "Please describe your proposal.";
    }

    // Use hook's states for file validation
    if (fileList.length + existingFiles.length < 1) {
      newErrors.portfolioFile = "Please upload at least one portfolio file.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const applycampaignjson = {
      amount,
      proposal,
      filepaths: existingFiles.map((file) => ({ filepath: file.filepath })),
    };

    const formData = new FormData();
    formData.append("applycampaignjson", JSON.stringify(applycampaignjson));

    // Append new files from hook
    fileList.forEach((file) => {
      formData.append("portfolioFiles", file);
    });

    // Delete removed files using hook's deletedFilePaths
    for (const path of deletedFilePaths) {
      try {
        await axios.post(
          "/user/apply-now/portfoliofile-delete",
          {
            filePath: path,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (err) {
        console.error(`Failed to delete file: ${path}`, err);
      }
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `user/apply-for-campaign/${campaignId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/dashboard/browse/applied");
      }
      toast.success(response.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Application not submitted");
    } finally {
      setLoading(false);
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

      const data = res.data?.data;

      if (data) {
        setAmount(data.budget || "");
        setProposal(data.description || "");
        if (data.budget !== null && data.description !== null) setIsEdit(true);
      }

      if (data.filepaths?.length > 0) {
        const filesFromBackend = data.filepaths.map((f, index) => {
          const name = f.filepath.split("/").pop() || "";
          const ext = name.split(".").pop()?.toLowerCase();
          let type = "";

          if (["png", "jpg", "jpeg"].includes(ext)) type = "image/png";
          else if (["mp4", "mov"].includes(ext)) type = "video/mp4";
          else if (ext === "pdf") type = "application/pdf";
          else if (["doc", "docx"].includes(ext)) type = "application/msword";

          return {
            uid: `existing-${index}`, // Unique ID for hook/FilePreview
            name,
            url: f.filepath, // For previews
            filepath: f.filepath,
            type,
          };
        });

        setExistingFiles(filesFromBackend); // Use hook's setter
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppliedCampiagnDetails();
  }, []);

  return (
    <main className="w-full text-sm overflow-x-hidden">
      <button
        onClick={() => window.history.back()}
        className="text-gray-600 flex items-center gap-2 hover:text-gray-900 transition"
      >
        <RiArrowLeftSLine /> Back
      </button>
      <h1 className="text-2xl font-semibold mb-4">Apply Now</h1>
      <div className="bg-white p-4 rounded-lg mb-6 flex flex-col">
        {isEdit && (
          <div className="p-3 mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
            You’ve already applied to this campaign. You can update your proposal and files below.
          </div>
        )}
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

            <Upload.Dragger
              name="Files"
              multiple
              fileList={[]} // Keep empty to avoid AntD conflicts
              beforeUpload={() => false}
              onChange={(info) => {
                handleFileChange(info); // Hook handles all validations and additions
                info.fileList.length = 0; // Reset AntD internal list
              }}
              showUploadList={false}
              accept=".png,.jpg,.jpeg,.pdf,.mp4,.mov,.doc,.docx"
            >
              <div className="py-3 flex flex-col items-center justify-center text-center">
                <RiUpload2Line className="text-4xl text-gray-400 mb-3" />
                <p className="font-bold text-gray-800 text-sm">
                  Upload Portfolio Files
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Max 5 files · Each under 25MB <br />
                  PNG, JPG, MP4, MOV, PDF, DOC, DOCX
                </p>
              </div>
            </Upload.Dragger>

            {/* Display file errors from the hook in the UI */}
            {fileError && (
              <p className="text-red-500 text-sm mt-2 text-center whitespace-pre-line">
                {fileError}
              </p>
            )}
            {/* Existing validation error */}
            {errors.portfolioFile && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {errors.portfolioFile}
              </p>
            )}
          </section>

          {/* Use FilePreview component */}
          <FilePreview
            files={[...existingFiles, ...fileList]}
            onRemove={(file) => handleRemove(file.uid)} // Pass full file object
          />

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
            className="w-42 py-2 rounded-3xl bg-[#0f122f] cursor-pointer text-white font-semibold hover:bg-[#23265a] transition"
          >
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
