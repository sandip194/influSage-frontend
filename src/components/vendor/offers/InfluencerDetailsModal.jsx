import React, { useEffect, useState } from "react";
import { Modal, Tooltip, Skeleton, Empty } from "antd";
import { RiHeart3Line, RiHeart3Fill, RiFile3Line } from "@remixicon/react";
import api from "../../../api/axios";import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import MediaPreviewModal from "../../../pages/commonPages/MediaPreviewModal";

const HeartParticle = ({ x, y, delay, size = 12 }) => (
  <motion.div
    className="absolute"
    style={{ width: size, height: size, backgroundColor: "transparent" }}
    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
    animate={{ scale: [0, 1, 0], x, y, opacity: [1, 1, 0] }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    <svg viewBox="0 0 20 20" fill="#ff3b6b" className="w-6 h-6">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
      4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
      14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
      6.86-8.55 11.54L12 21.35z"/>
    </svg>
  </motion.div>
);

const InfluencerDetailsModal = ({ visible, influencerId, onClose }) => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [influDetails, setInfluDetails] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState("image");

  const getInfluencerDetails = async () => {
    if (!influencerId) return;
    try {
      setLoading(true);
      const res = await api.get(`/vendor/influencer-detail/${influencerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInfluDetails(res.data?.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) getInfluencerDetails();
  }, [visible, influencerId]);

  const handleLike = async () => {
    try {
      const response = await api.post(
        "/vendor/addfavourite/influencer",
        { p_influencerId: Number(influencerId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success(response?.data?.message);
        setInfluDetails((prev) => ({
          ...prev,
          savedinfluencer: !prev.savedinfluencer,
        }));

        if (!influDetails?.savedinfluencer) {
          setShowAnimation(true);
          setTimeout(() => setShowAnimation(false), 700);
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const validPortfolioFiles =
    influDetails?.portfoliofiles?.filter(
      (f) => typeof f?.filepath === "string" && f.filepath.trim() !== ""
    ) || [];


  const getFileType = (url) => {
    const ext = url.split(".").pop().toLowerCase();

    if (/(jpg|jpeg|png|gif|webp)$/.test(ext)) return "image";
    if (/(mp4|mov|webm|ogg)$/.test(ext)) return "video";
    if (ext === "pdf") return "pdf";
    if (/(doc|docx|xls|xlsx)$/.test(ext)) return "doc";

    return "other";
  };



  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      bodyStyle={{ padding: 0, backgroundColor: "#f9fafb", borderRadius: 16 }}
      title={"Influencer Details"}
    >
      {loading ? (
        <div className="p-6 sm:p-8">
          <Skeleton.Avatar active size={80} shape="circle" />
          <Skeleton active paragraph={{ rows: 5 }} className="mt-4" />
        </div>
      ) : influDetails ? (
        <div className="bg-white rounded-2xl overflow-hidden pt-6 px-2">
          {/* Header */}
          <div className="flex flex-col bg-gray-50 rounded-2xl sm:flex-row items-center sm:items-start sm:justify-between gap-4 p-6 ">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img
                src={influDetails?.photopath}
                alt="Profile"
                onClick={() => {
                  setPreviewUrl(influDetails?.photopath);
                  setPreviewType("image");
                  setPreviewOpen(true);
                }}
                onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-100 shadow-sm cursor-pointer hover:opacity-90"
              />
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 capitalize">
                  {influDetails?.influencername}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {influDetails?.statename}, {influDetails?.countryname}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Total Campaigns: {influDetails?.totalcampaign ?? 0}
                </p>

                {/* Social Media (Header) */}
                {influDetails?.providers?.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap justify-center sm:justify-start">
                    {influDetails.providers.map((provider, idx) => {
                      const followers = provider.nooffollowers || 0;

                      const formatFollowers = (num) => {
                        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
                        if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
                        return num;
                      };

                      return (
                        <Tooltip key={idx} title={provider.providername}>
                          <a
                            href={provider.handleslink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full hover:shadow-sm transition"
                          >
                            <img
                              src={provider.iconpath}
                              alt={provider.providername}
                              className="w-6 h-6 rounded-full"
                              onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                            />
                            <span className="text-xs font-medium text-gray-700">
                              {formatFollowers(followers)}
                            </span>
                          </a>
                        </Tooltip>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>

            <Tooltip
              title={influDetails?.savedinfluencer ? "Remove from Favorites" : "Add to Favorites"}
            >
              <button
                onClick={handleLike}
                className={`relative cursor-pointer flex items-center justify-center sm:justify-start gap-2 px-4 py-1 rounded-full text-sm font-medium border transition ${influDetails?.savedinfluencer
                  ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
              >
                <div className="relative flex items-center justify-center w-8 h-8">
                  <motion.div
                    key={influDetails?.savedinfluencer ? "fill" : "outline"}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: showAnimation ? 1.6 : 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 12 }}
                    className="relative z-10"
                  >
                    {influDetails?.savedinfluencer ? (
                      <RiHeart3Fill size={26} className="text-red-500" />
                    ) : (
                      <RiHeart3Line size={26} className="text-gray-700" />
                    )}
                  </motion.div>
                  <AnimatePresence>
                    {showAnimation &&
                      [
                        { x: -20, y: -10, delay: 0 },
                        { x: 15, y: -20, delay: 0.05 },
                        { x: -15, y: 15, delay: 0.3 },
                        { x: 20, y: 10, delay: 0.25 },
                        { x: 0, y: -25, delay: 0.4 },
                      ].map((p, idx) => (
                        <HeartParticle key={idx} {...p} />
                      ))}
                  </AnimatePresence>
                </div>
                <span className="inline z-10">
                  {influDetails?.savedinfluencer ? "Favorited" : "Add to Favorite"}
                </span>
              </button>
            </Tooltip>
          </div>

          {/* Main Content */}
          <div className=" mt-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              {/* Bio */}
              <div className="border-b border-gray-200 pb-3">
                <h3 className="text-gray-900 text-lg font-semibold mb-2">Bio</h3>
                <p className="text-gray-600 text-sm">{influDetails?.bio || "No bio available."}</p>
              </div>

              {/* Categories */}
              <div className="border-b border-gray-200 py-3">
                <h3 className="text-gray-900 text-lg font-semibold mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {influDetails?.categories?.map((cat) => (
                    <span
                      key={cat.categoryid}
                      className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                    >
                      {cat.categoryname}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              {/* <div className="border-b border-gray-200 py-3">
                <h3 className="text-gray-900 text-lg font-semibold mb-2">Social Media</h3>
                {influDetails?.providers?.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {influDetails.providers.map((provider, idx) => {
                      const followers = provider.nooffollowers || 0;
                      const formatFollowers = (num) => {
                        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
                        if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
                        return num.toString();
                      };
                      return (
                        <div
                          key={idx}
                          className="flex-shrink-0 w-48 px-2 py-1 bg-red-50 border border-gray-200 rounded-xl"
                        >
                          <a href={provider.handleslink} target="_blank" rel="noopener noreferrer">
                            <div className="flex items-center gap-3">
                              {provider.iconpath && (
                                <img
                                  src={provider.iconpath}
                                  alt={`${provider.providername} icon`}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                                  onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                                />
                              )}
                              <div>
                                <h4 className="text-gray-900 font-semibold text-sm">
                                  {provider.providername}
                                </h4>
                                <p className="text-gray-500 text-xs">{formatFollowers(followers)} followers</p>
                              </div>
                            </div>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No social media profiles available.</p>
                )}
              </div> */}



            </div>

            <div className="p-4 rounded-lg">
              <h3 className="text-gray-900 text-lg font-semibold mb-2">Portfolio</h3>

              {influDetails?.portfoliourl && (
                <div className="mb-3">
                  <a
                    href={influDetails.portfoliourl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 !bg-blue-50  text-sm font-medium rounded-lg hover:bg-blue-100 transition"
                  >
                    <RiFile3Line size={18} />
                    View Full Portfolio
                  </a>
                </div>
              )}

              {validPortfolioFiles.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {validPortfolioFiles.slice(0, 6).map((file, i) => {
                    const url = file.filepath;
                    const type = getFileType(url);

                    return (
                      <div
                        key={i}
                        className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200 hover:shadow-md transition cursor-pointer"
                      >
                        {type === "image" && (
                          <img
                            src={url}
                            alt="portfolio"
                            className="w-full h-28 object-cover"
                            onClick={() => {
                              setPreviewUrl(url);
                              setPreviewType(type);
                              setPreviewOpen(true);
                            }}
                            onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                          />
                        )}

                        {type === "video" && (
                          <div
                            className="w-full h-28 flex items-center justify-center text-sm text-gray-600"
                            onClick={() => {
                              setPreviewUrl(url);
                              setPreviewType(type);
                              setPreviewOpen(true);
                            }}
                          >
                            ▶ Play Video
                          </div>
                        )}

                        {type === "pdf" && (
                          <div
                            className="w-full h-28 flex items-center justify-center text-sm text-gray-600"
                            onClick={() => {
                              setPreviewUrl(url);
                              setPreviewType(type);
                              setPreviewOpen(true);
                            }}
                          >
                            📄 View PDF
                          </div>
                        )}

                        {(type === "doc" || type === "other") && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center h-28 text-xs text-gray-500 hover:text-gray-700"
                          >
                            <RiFile3Line className="text-gray-400 text-3xl mb-1" />
                            Download File
                          </a>
                        )}
                      </div>
                    );
                  })}

                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No portfolio files uploaded"
                />

              )}

            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">No details found.</div>
      )}
      <MediaPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        src={previewUrl}
        type={previewType}
      />
    </Modal>
  );
};

export default InfluencerDetailsModal;
