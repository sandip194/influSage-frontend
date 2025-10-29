import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
RiCloseLine,
RiUpload2Line,
RiDeleteBin6Line,
} from 'react-icons/ri';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import 'react-photo-view/dist/react-photo-view.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';

const { Dragger } = Upload;

const CampaignStep4 = ({ onBack, onNext, data, campaignId }) => {
  const [fileList, setFileList] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [lightboxVideo, setLightboxVideo] = useState({ open: false, src: "" });
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

    let errorMessages = new Set();

    setFileList((prevFiles) => {
      const combinedFiles = [...prevFiles, ...existingFiles];
      const existingUIDs = new Set(combinedFiles.map((f) => f.uid));
      const newValidFiles = [];

      for (const file of incomingFiles) {
        if (!allowedTypes.includes(file.type)) {
          errorMessages.add(`${file.name}: unsupported type`);
          continue;
        }
        if (file.size / 1024 / 1024 > 25) {
          errorMessages.add(`${file.name}: exceeds 25MB`);
          continue;
        }

        const uid = getFileUID(file);
        if (existingUIDs.has(uid)) {
          continue;
        }

        if (
          prevFiles.length + newValidFiles.length + existingFiles.length >=
          5
        ) {
          errorMessages.add("Maximum 5 files allowed");
          break;
        }

        file.uid = uid;
        file.previewUrl = URL.createObjectURL(file);
        newValidFiles.push(file);
        existingUIDs.add(uid);
      }

      if (errorMessages.size > 0) {
        setFileError(Array.from(errorMessages).join("\n"));
      } else {
        setFileError("");
      }

      return [...prevFiles, ...newValidFiles];
    });
  };

  const handleContinue = async () => {
    if (fileList.length === 0 && existingFiles.length === 0) {
      setFileError("Please upload at least one reference file.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      if (campaignId) formData.append("campaignId", campaignId);

      [...existingFiles, ...fileList].forEach((file) => {
        if (file.isExisting) {
          formData.append("references[]", file.filepath);
        } else {
          formData.append("Files", file);
        }
      });

      await axios.post(`/vendor/update-campaign`, formData, {
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
        .map((f) => {
          const name = f.filepath.split("/").pop() || "";
          const ext = name.split(".").pop()?.toLowerCase();

          let type = "";
          if (["png", "jpg", "jpeg"].includes(ext)) type = "image/png";
          else if (["mp4", "mov"].includes(ext)) type = "video/mp4";
          else if (ext === "pdf") type = "application/pdf";
          else if (["doc", "docx"].includes(ext)) type = "application/msword";

          const fileUrl = f.filepath;

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
        <div className="py-6 flex flex-col items-center justify-center text-center">
          <RiUpload2Line className="text-4xl text-gray-400 mb-3" />
          <p className="font-semibold text-gray-800 text-base">
            Upload Reference Files
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Max 5 files · Each under 25MB <br />
            PNG, JPG, MP4, MOV, PDF, DOC, DOCX
          </p>
        </div>
      </Dragger>
      {fileError && (
        <div className="text-red-500 text-sm mt-2 text-center whitespace-pre-line">
          {fileError}
        </div>
      )}

      {/* Preview */}
      <PhotoProvider>
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
                key={`${file.uid || file.name}-${index}`}
                className="relative w-28 h-28 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center"
              >
                {/* Image Preview with react-photo-view */}
                {isImage && (
                  <PhotoView src={previewUrl}>
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="w-full h-full object-cover rounded-lg cursor-pointer"
                    />
                  </PhotoView>
                )}

                {isVideo && (
                  <div
                    className="w-full h-full cursor-pointer relative"
                    onClick={() =>
                      setLightboxVideo({ open: true, src: previewUrl })
                    }
                  >
                    <video
                      src={previewUrl}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                )}

                {/* PDF Preview */}
                {isPDF && (
                  <div className="flex flex-col items-center justify-center w-full h-full text-gray-700">
                    <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-lg mb-1">
                      <span className="text-red-600 font-bold text-sm">
                        PDF
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-600 text-center truncate w-full px-1">
                      {file.name}
                    </p>
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline text-[10px] mt-1"
                    >
                      View PDF
                    </a>
                  </div>
                )}

                {/* Doc/Docx Preview */}
                {isDoc && (
                  <div className="flex flex-col items-center justify-center w-full h-full text-gray-700">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg mb-1">
                      <span className="text-blue-600 font-bold text-sm">
                        DOC
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-600 text-center truncate w-full px-1">
                      {file.name}
                    </p>
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline text-[10px] mt-1"
                    >
                      View Doc
                    </a>
                  </div>
                )}

                {/* Fallback */}
                {!isImage && !isVideo && !isPDF && !isDoc && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 underline"
                  >
                    {file.name || "File"}
                  </a>
                )}

                <button
                  className="absolute top-1 right-1 bg-black flex items-center justify-center w-7 h-7 hover:bg-black/80 text-white p-1 rounded-full"
                  onClick={() => handleDeleteReference(file)}
                  type="button"
                >
                  <RiDeleteBin6Line />
                </button>
              </div>
            );
          })}
        </div>
      </PhotoProvider>

      {/* Custom modal for videos */}
      {lightboxVideo.open && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-[90%] max-w-4xl">
            <video
              src={lightboxVideo.src}
              controls
              autoPlay
              className="w-full rounded-lg"
            />
            <button
              className="absolute top-2 right-2 bg-white/60 flex items-center justify-center w-7 h-7 text-black p-1 rounded-full"
              onClick={() => setLightboxVideo({ open: false, src: "" })}
            >
            <RiCloseLine/>
            </button>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
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
