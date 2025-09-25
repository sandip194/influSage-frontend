import { RiCheckboxCircleFill, RiDeleteBin6Line } from '@remixicon/react';
import React, { useEffect, useState } from 'react'
import { RiCheckLine } from 'react-icons/ri';



const VendorCampaignOverview = ({ campaignData }) => {
    const [images, setImages] = useState([]);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    // Delete reference image
    const handleDeleteImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };


    const Requirements = [
        {
            label: "Ship Products:",
            value: campaignData?.p_vendorinfojson?.isproductshipping ? "Yes" : "No",
        },
        {
            label: "Duration:",
            value: `${campaignData?.p_objectivejson?.postdurationdays || "N/A"} Days`,
        },
        {
            label: "Application Start Date:",
            value: campaignData?.p_campaignjson?.applicationstartdate || "N/A",
        },
        {
            label: "Application End Date:",
            value: campaignData?.p_campaignjson?.applicationenddate || "N/A",
        },
        {
            label: "Campaign Start Date:",
            value: campaignData?.p_campaignjson?.startdate || "N/A",
        },
        {
            label: "Campaign End Date:",
            value: campaignData?.p_campaignjson?.enddate || "N/A",
        },
        {
            label: "Vendor Profile Link Included:",
            value: campaignData?.p_objectivejson?.isincludevendorprofilelink
                ? "Yes"
                : "No",
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

    useEffect(() => {
        if (campaignData?.p_campaignfilejson) {
            setImages(campaignData.p_campaignfilejson.map(file => file.filepath));
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
                    {campaignData?.p_campaignjson?.description || "No description available."}
                </p>

            </div>
            {/* Requirements */}
            <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold text-lg sm:text-xl mb-4">Requirements</h3>
                <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                    {Requirements.map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <RiCheckLine size={16} className="text-gray-900 flex-shrink-0 border rounded" />
                            <span>
                                <strong>  {item.label} </strong>{item.value}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-6 mb-6">
                    {campaignData?.p_campaigncategoyjson?.flatMap(parent =>
                        parent.categories.map(cat => cat.categoryname)
                    ).map((tag, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                        >
                            {tag}
                        </span>
                    ))}

                </div>

                 {/* References */}
      <h2 className="text-lg font-semibold mb-3">References</h2>
      <div className="flex gap-4 flex-wrap">
        {images.map((file, i) => {
          const fileUrl = `${BASE_URL}/${file}`;
          const fileType = getFileType(file);

          return (
            <div
              key={i}
              className="w-42 h-42 rounded-2xl border border-gray-200 overflow-hidden  hover:shadow-lg transition relative flex items-center justify-center bg-gray-100"
              title="Open file in new tab"
            >
              {/* Delete Button */}
              <button
                onClick={() => handleDeleteImage(i)}
                className="absolute top-1 right-1 bg-gray-600 bg-opacity-70 text-white p-1 rounded-full z-10"
              >
                <RiDeleteBin6Line className="w-4 h-4" />
              </button>

              {/* File Preview */}
              {fileType === 'image' ? (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full block"
                >
                  <img
                    src={fileUrl}
                    alt={`Campaign file ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </a>
              ) : fileType === 'video' ? (
                <video
                  src={fileUrl}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  controls
                />
              ) : fileType === 'pdf' ? (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center text-red-600 text-xs font-semibold w-full h-full"
                >
                  📄 PDF
                </a>
              ) : fileType === 'doc' ? (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center text-blue-600 text-xs font-semibold w-full h-full"
                >
                  📝 DOC
                </a>
              ) : (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-gray-900 text-xs w-full h-full"
                >
                  View File
                </a>
              )}
            </div>
          );
        })}
      </div>
            </div>
        </div>
    )
}

export default VendorCampaignOverview