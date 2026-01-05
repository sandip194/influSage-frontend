import React, { useEffect, useState } from "react";
import axios from "axios";

const ApplicationTab = ({ campaignId, token }) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);

  // File preview states
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState("");
  const [filePreviewType, setFilePreviewType] = useState("");

  const loadData = async () => {
    if (!campaignId || !token) return;

    try {
      setLoading(true);
      const res = await axios.get(`user/signle-applied/${campaignId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.data) {
        setApplication(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load application:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [campaignId, token]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg text-center">
        Loading application details...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg text-center">
        No application data available.
      </div>
    );
  }

  const { budget, description, filepaths } = application;

  return (
    <div className="bg-white p-0 rounded-2xl">

      {/* Budget */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Your Proposal Amount
        </h3>
        <p className="text-[#0D132D] text-xl font-bold">
          ₹{budget || "N/A"}
        </p>
      </div>

      {/* Description */}
      {description && (
        <div className="mt-3 pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Description
          </h3>
          <p className="text-gray-700">{description}</p>
        </div>
      )}

      {/* Files */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Files</h3>

        {filepaths?.length > 0 ? (
          <div className="flex gap-3 flex-wrap">
            {filepaths.map(({ filepath }, index) => {
              const extension = filepath.split(".").pop().toLowerCase();

              const isImage = /\.(png|jpe?g|gif|svg|webp)$/i.test(filepath);
              const isVideo = /\.(mp4|webm|ogg)$/i.test(filepath);
              const isPdf = extension === "pdf";
              const isDoc = ["doc", "docx", "txt"].includes(extension);

              const openPreview = (type) => {
                setFilePreviewUrl(filepath);
                setFilePreviewType(type);
                setFilePreviewOpen(true);
              };

              return (
                <div
                  key={index}
                  className="w-28 h-28 rounded-xl overflow-hidden border border-gray-300 
                  hover:shadow-md transition flex items-center justify-center bg-white"
                >
                  {isImage ? (
                    <img
                      src={filepath}
                      onClick={() => openPreview("image")}
                      onError={(e) =>
                        (e.target.src = "/Brocken-Defualt-Img.jpg")
                      }
                      className="w-full h-full object-cover cursor-pointer"
                      alt="file"
                    />
                  ) : isVideo ? (
                    <video
                      src={filepath}
                      onClick={() => openPreview("video")}
                      className="w-full h-full object-cover cursor-pointer"
                      muted
                    />
                  ) : isPdf ? (
                    <div
                      onClick={() => openPreview("pdf")}
                      className="text-red-600 text-xs font-semibold cursor-pointer"
                    >
                      PDF
                    </div>
                  ) : isDoc ? (
                    <div
                      onClick={() => openPreview("doc")}
                      className="text-blue-600 text-xs font-semibold cursor-pointer"
                    >
                      DOC
                    </div>
                  ) : (
                    <div
                      onClick={() => openPreview("file")}
                      className="text-gray-500 text-xs cursor-pointer"
                    >
                      View File
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-700">No files uploaded.</p>
        )}
      </div>

      {/* File Preview Modal */}
      {filePreviewOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setFilePreviewOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-white text-3xl font-bold"
            onClick={() => setFilePreviewOpen(false)}
          >
            &times;
          </button>

          <div onClick={(e) => e.stopPropagation()}>
            {filePreviewType === "image" && (
              <img
                src={filePreviewUrl}
                className="max-w-[90vw] max-h-[85vh] rounded-xl object-contain"
                onError={(e) =>
                  (e.target.src = "/Brocken-Defualt-Img.jpg")
                }
              />
            )}

            {filePreviewType === "video" && (
              <video
                autoPlay
                controls
                className="max-w-[90vw] max-h-[85vh] rounded-xl"
              >
                <source src={filePreviewUrl} />
              </video>
            )}

            {filePreviewType === "pdf" && (
              <iframe
                src={filePreviewUrl}
                className="w-[90vw] h-[90vh] rounded-xl bg-white"
              />
            )}

            {filePreviewType === "doc" && (
              <iframe
                src={`https://docs.google.com/viewer?url=${filePreviewUrl}&embedded=true`}
                className="w-[90vw] h-[90vh] rounded-xl bg-white"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTab;
