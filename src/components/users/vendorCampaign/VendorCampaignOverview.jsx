import { RiCheckboxCircleFill, RiDeleteBin6Line } from '@remixicon/react';
import React, { useEffect, useState } from 'react';
import { RiCheckLine } from 'react-icons/ri';

const VendorCampaignOverview = ({ campaignData, isEditable = true }) => { // Renamed for neutrality; use VendorCampaignOverview if preferred
  const [images, setImages] = useState([]);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState("");

  // Delete reference image (local state only; no API call - works for vendor, but hidden for user)
  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const Requirements = [
    {
      label: "Ship Products:",
      value: campaignData?.requirements?.isproductshipping ? "Yes" : "No",
    },
    {
      label: "Duration:",
      value: `${campaignData?.requirements?.postdurationdays || "N/A"} Days`,
    },
    {
      label: "Vendor Profile Link Included:",
      value: campaignData?.requirements?.isincludevendorprofilelink ? "Yes" : "No",
    },
  ];

  // Utility to detect file type
  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (['mp4', 'webm', 'mov'].includes(ext)) return 'video';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'doc';
    return 'other';
  };

  // Flexible categories/tags extraction: Handles vendor (nested) and user (flat) structures
  const getCategories = () => {
    if (campaignData?.p_campaigncategoyjson) {
      // Vendor-style: Nested structure
      return campaignData.p_campaigncategoyjson.flatMap(parent =>
        parent.categories ? parent.categories.map(cat => cat.categoryname) : []
      );
    } else if (campaignData?.campaigncategories) {
      // User-style: Flat array
      return campaignData.campaigncategories.map(cat => cat.categoryname);
    }
    return []; // Fallback if neither exists
  };

  const categories = getCategories();

  useEffect(() => {
    if (campaignData?.campaignfiles) {
      setImages(campaignData.campaignfiles.map(file => file.filepath));
    } else {
      setImages([]); // Reset if no files
    }
  }, [campaignData]);

  return (
    <div>
      {/* Description */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h3 className="font-semibold text-lg mb-2">
          Campaign Description
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {campaignData?.description || "No description available."}
        </p>
      </div>


      <h3 className="text-lg font-semibold mb-3">Categories</h3>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 mb-6">
            {categories.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

      {/* Requirements */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="font-semibold text-lg sm:text-xl mb-4">Requirements</h3>
        <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
          {Requirements.map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              <RiCheckLine size={16} className="text-gray-900 flex-shrink-0 border rounded" />
              <span>
                <strong>{item.label}</strong> {item.value}
              </span>
            </li>
          ))}
        </ul>

        {/* Hashtags - Conditionally render if hashtags exist */}
        {Array.isArray(campaignData?.hashtags) && campaignData.hashtags.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mb-3mb-4 my-4">Hashtags</h3>
            <div className="flex flex-wrap gap-2 mt-3 mb-6">
              {campaignData.hashtags.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                >
                  {item.hashtag}
                </span>
              ))}
            </div>
          </>
        )}
        <h2 className="text-lg font-semibold mb-3">References</h2>
        <div className="flex gap-4 flex-wrap">
          {images.length > 0 ? (
            images.map((file, i) => {
              const fileUrl = file;
              const fileType = getFileType(file);

              return (
                <div
                  key={i}
                  className="w-42 h-42 rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition relative flex items-center justify-center bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setPreviewOpen(true);
                    setPreviewUrl(fileUrl);
                    setPreviewType(fileType);
                  }}
                >
                  {/* DELETE ICON FOR EDIT MODE */}
                  {isEditable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(i);
                      }}
                      className="absolute top-1 right-1 bg-gray-600 bg-opacity-70 text-white p-1 rounded-full z-10"
                    >
                    </button>
                  )}

                  {/* IMAGE */}
                  {fileType === "image" && (
                    <img
                      src={fileUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* VIDEO */}
                  {fileType === "video" && (
                    <video
                      src={fileUrl}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  )}

                  {/* PDF */}
                  {fileType === "pdf" && (
                    <p className="flex flex-col items-center justify-center text-red-600 text-xs font-semibold">
                      📄 PDF
                    </p>
                  )}

                  {/* DOC */}
                  {fileType === "doc" && (
                    <p className="flex flex-col items-center justify-center text-blue-600 text-xs font-semibold">
                      📝 DOC
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm">No references available.</p>
          )}
        </div>
        {previewOpen && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            onClick={() => setPreviewOpen(false)}
          >
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-5 right-6 text-white text-3xl font-bold"
            >
              ×
            </button>

            {previewType === "image" && (
              <img
                src={previewUrl}
                className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {previewType === "video" && (
              <video
                controls
                className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
                onClick={(e) => e.stopPropagation()}
              >
                <source src={previewUrl} />
              </video>
            )}

            {previewType === "pdf" && (
              <iframe
                src={previewUrl}
                className="max-w-[90vw] max-h-[85vh] bg-white rounded-xl"
                onClick={(e) => e.stopPropagation()}
              ></iframe>
            )}

            {previewType === "doc" && (
              <iframe
                src={`https://docs.google.com/viewer?url=${previewUrl}&embedded=true`}
                className="max-w-[90vw] max-h-[85vh] bg-white rounded-xl"
                onClick={(e) => e.stopPropagation()}
              ></iframe>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorCampaignOverview; // Or export as VendorCampaignOverview if preferred
