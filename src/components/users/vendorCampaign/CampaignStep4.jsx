import React, { useState, useEffect } from "react";
import { Upload, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const { Dragger } = Upload;

const CampaignStep4 = ({ onBack, onNext, campaignId, data }) => {
  const [fileList, setFileList] = useState([]); 
  const [existingFiles, setExistingFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "video/mp4",
    "video/quicktime",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const getFileUID = (file) =>
    `${file.name}-${file.size || 0}-${file.lastModified || Date.now()}`;

  // File change handler
  const handleFileChange = (info) => {
    const incomingFiles = info.fileList
      .map((f) => f.originFileObj || f)
      .filter(Boolean);

    let errorMessages = [];

    setFileList((prevFiles) => {
      const combinedFiles = [...prevFiles, ...existingFiles];
      const existingUIDs = new Set(combinedFiles.map((f) => f.uid));
      const newValidFiles = [];

      for (const file of incomingFiles) {
        if (!allowedTypes.includes(file.type)) {
          errorMessages.push(`${file.name}: unsupported type`);
          continue;
        }
        if (file.size / 1024 / 1024 > 25) {
          errorMessages.push(`${file.name}: exceeds 25MB`);
          continue;
        }

        const uid = getFileUID(file);
        if (existingUIDs.has(uid)) {
          message.warning(`${file.name}: already uploaded`);
          continue;
        }

        if (
          prevFiles.length + newValidFiles.length + existingFiles.length >= 5
        ) {
          errorMessages.push(`${file.name}: exceeds 5 file limit`);
          continue;
        }

        file.uid = uid;
        file.previewUrl = URL.createObjectURL(file);
        newValidFiles.push(file);
        existingUIDs.add(uid);
      }

      if (errorMessages.length > 0) {
        setFileError(errorMessages.join("; "));
      } else {
        setFileError("");
      }

      return [...prevFiles, ...newValidFiles];
    });
  };

  // Save handler
  const handleContinue = async () => {
    if (fileList.length === 0 && existingFiles.length === 0) {
      message.error("Please upload at least one reference file.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("campaignId", campaignId);

      // keep existing filenames
      existingFiles.forEach((file) => {
        formData.append("references[]", file.name);
      });

      // append new files
      fileList.forEach((file) => {
        formData.append("Files", file);
      });

      await axios.post(`/vendor/create-campaign`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("References saved successfully");
      onNext();
    } catch (err) {
      console.error("Save error:", err);
      message.error("Failed to save references. Try again.");
    } finally {
      setLoading(false);
    }
  };

// useEffect for previewing existing backend files
useEffect(() => {
  if (data && Array.isArray(data)) {
    const filesFromBackend = data
      .filter((f) => f.filepath)
      .map((f, index) => {
        const name = f.filepath.split("/").pop() || "";
        const ext = name.split(".").pop()?.toLowerCase();

        let type = "";
        if (["png", "jpg", "jpeg"].includes(ext)) type = "image/png";
        else if (["mp4", "mov"].includes(ext)) type = "video/mp4";
        else if (ext === "pdf") type = "application/pdf";
        else if (["doc", "docx"].includes(ext)) type = "application/msword";

        const fileUrl = `${BASE_URL}/${f.filepath.replace(/\\/g, "/")}`;

        return {
          name,
          url: fileUrl,
          filepath: f.filepath,
          status: "done",
          type,
          isExisting: true, 
        };
      });

    setExistingFiles(filesFromBackend);
  }
}, [data]);


// Handle Delete
const handleDeleteReference = async (fileToDelete) => {
  if (fileToDelete.isExisting) {
    try {
      const authToken = token || localStorage.getItem("token");
      if (!authToken) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const res = await axios.post(
        "/vendor/campaign/delete-file",
        { filepath: fileToDelete.filepath },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (res.data.status) {
        setExistingFiles((prev) =>
          prev.filter((f) => f.filepath !== fileToDelete.filepath)
        );
        toast.success("Reference file deleted successfully");
      } else {
        toast.error(res.data.message || "Failed to delete reference file");
      }
    } catch (error) {
      console.error("Delete reference file error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete reference file"
      );
    }
  } else {
    setFileList((prev) => prev.filter((f) => f.uid !== fileToDelete.uid));
  }
};

  return (
    <div className="bg-white p-6 rounded-3xl">
      <h2 className="text-xl font-bold mb-6">Reference</h2>

      {/* File Uploader */}
      <Dragger
        name="Files"
        multiple
        fileList={[]}
        beforeUpload={() => false}
        onChange={handleFileChange}
        showUploadList={false}
      >
        <div className="py-6">
          <UploadOutlined className="text-2xl text-gray-500 mb-2" />
          <p className="font-semibold text-gray-800 text-md">
            Upload Reference Files
          </p>
          <p className="text-gray-500 text-sm">
            Max 5 files. Each under 25MB. PNG, JPG, MP4, MOV, PDF, DOC, DOCX
          </p>
        </div>
      </Dragger>
      {fileError && (
        <p className="text-red-500 text-sm mt-2 text-center">{fileError}</p>
      )}

      {/* Preview */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
        {[...existingFiles, ...fileList].map((file, index) => {
          const previewUrl = file.url || file.previewUrl;
          const isImage = file.type?.includes("image");
          const isVideo = file.type?.includes("video");
          const isPDF = file.type?.includes("pdf");
          const isDoc =
            file.type?.includes("word") ||
            file.type?.includes("officedocument");

          return (
            <div
              key={`${file.uid}-${index}`}
              className="relative w-[100px] h-[120px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center p-2"
            >
              {isImage ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : isVideo ? (
                <video
                  src={previewUrl}
                  className="w-full h-full object-cover"
                  muted
                  controls
                />
              ) : isPDF || isDoc ? (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  {file.name}
                </a>
              ) : (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  File
                </a>
              )}

              <button
                className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full"
                onClick={() => handleDeleteReference(file)}
                type="button"
              >
                <DeleteOutlined />
              </button>
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
        <button
          onClick={onBack}
          className="bg-white text-[#0D132D] cursor-pointer px-8 py-3 rounded-full border border-[#121a3f26] hover:bg-[#0D132D] hover:text-white transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={loading}
          className="bg-[#121A3F] cursor-pointer text-white px-8 py-3 rounded-full hover:bg-[#0D132D] disabled:opacity-60"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default CampaignStep4;
