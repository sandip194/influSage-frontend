import {
  RiStarLine,
  RiPlayCircleFill,
  RiArrowDownSLine,
  RiStarFill,
  RiArrowUpSLine,
  RiFileTextLine,
} from '@remixicon/react';
import { Empty, Skeleton } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";



const ProfileSkeleton = () => {
  return (
    <div className="w-full text-sm">
      {/* Header */}
      <Skeleton active title={{ width: 120 }} paragraph={{ rows: 1 }} />

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        {/* Left Side */}
        <div className="flex-1 space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6">
            <Skeleton.Avatar size={80} shape="circle" />
            <Skeleton active paragraph={{ rows: 2 }} className="mt-4" />
          </div>

          {/* Bio */}
          <div className="bg-white rounded-2xl p-6">
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>

          {/* Portfolio */}
          <div className="bg-white rounded-2xl p-4">
            <Skeleton active title={{ width: 100 }} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton.Image
                  key={i}
                  className="!w-full !h-40 rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-[300px] space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4">
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [showAll, setShowAll] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  // const [showAllHistory, setShowAllHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [portfolioPreviewOpen, setPortfolioPreviewOpen] = useState(false);
  const [portfolioPreviewUrl, setPortfolioPreviewUrl] = useState("");
  const [portfolioPreviewType, setPortfolioPreviewType] = useState("");

  // const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const { token, userId } = useSelector((state) => state.auth);

  const formatPhoneNumber = (phone) => {
    if (!phone) return "No phone";

    const cleaned = phone.replace(/\D/g, "");

    let number = cleaned;
    if (number.startsWith("91")) {
      number = number.slice(2);
    }
    return `+91 ${number.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}`;
  };

  // Fetch profile data
  const getMyProfileDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`user/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(res.data.profileParts);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) getMyProfileDetails();
  }, [userId, token]);

  if (loading) return <ProfileSkeleton />
  if (!profileData) {
    return (
      <div className="flex justify-center items-center py-20">
        <Empty
          description="Profile not found"
        />
      </div>
    );
  }

  // Destructure API data
  const { p_profile, p_socials, p_categories, p_portfolios, p_paymentaccounts } = profileData;

  const portfolioFiles = p_portfolios?.filepaths || [];
  const visiblePortfolios = showAll ? portfolioFiles : portfolioFiles.slice(0, 4);

  return (
    <div className="w-full text-sm overflow-x-hidden">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile</h2>
      <p className="mb-6 text-gray-700 text-sm">You can view or edit your profile from here</p>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Side */}
        <div className="flex-1 space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl overflow-hidden ">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/33350497/pexels-photo-33350497.jpeg"
                alt="Banner"
                className="w-full h-32 object-cover"
              />
              <img
                src={p_profile?.photopath}
                alt="Profile"
                onError={(e) => (e.target.src = "/defualt.jpg")}
                onClick={() => setIsPreviewOpen(true)}
                className="absolute left-6 -bottom-10 w-20 h-20  object-cover rounded-full border-4 border-white shadow cursor-pointer"
              />
              {isPreviewOpen && (
                <div
                  className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  <button
                    onClick={() => setIsPreviewOpen(false)}
                    className="absolute top-5 right-6 text-white text-3xl font-bold hover:text-gray-300"
                  >
                    &times;
                  </button>

                  <img
                    src={p_profile?.photopath}
                    onError={(e) => (e.target.src = "/defualt.jpg")}
                    alt="Preview"
                    className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>

            <div className="p-6 pt-14 flex flex-col md:flex-row justify-between items-start">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    {p_profile?.firstname} {p_profile?.lastname}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {formatPhoneNumber(p_profile?.phonenumber)} <br />
                    {p_profile?.email || "No email"}
                  </p>

                </div>
              </div>

              <div className="flex gap-10 text-center mt-4 md:mt-0">
                <div>
                  <p className="text-gray-500 text-sm">Total Campaign</p>
                  <p className="font-semibold text-lg">{p_profile?.totalcampaign}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Earning</p>
                  <p className="font-semibold text-lg">0</p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => navigate("/dashboard/editProfile")}
                className="bg-[#0f122f] cursor-pointer text-white px-5 py-2 rounded-full font-medium hover:bg-[#23265a] transition inline-block"
              > Edit Profile </button>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white p-6 rounded-2xl ">
            <h2 className="font-bold text-base mb-3">Bio</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{p_profile?.bio}</p>

            <hr className="my-4 border-gray-200" />

            {/* Categories */}
            <h2 className="font-bold text-base mb-3">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(p_categories)
                ? p_categories
                : []
              ).flatMap(p =>
                p.categories.map(cat => (
                  <span

                    key={cat.categoryid}
                    className="px-4 py-1.5 text-sm bg-gray-100 rounded-full text-gray-700"
                  >
                    {cat.categoryname}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl">
            {/* Portfolio Heading */}
            <h2 className="font-semibold text-base mb-4">Portfolio</h2>

            {/* Portfolio Link */}
            {p_portfolios?.portfoliourl && (
              <p className="text-sm text-blue-600 mb-4 hover:underline">
                <a
                  href={p_portfolios.portfoliourl}
                  target="_blank"
                >
                  View Portfolio
                </a>
              </p>
            )}

            {/* Portfolio Files */}
            {visiblePortfolios?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {visiblePortfolios.map((item, index) => {
                  const fileExtension = item.filepath?.split(".").pop()?.toLowerCase();
                  const isImage = ["jpg", "jpeg", "png", "gif"].includes(fileExtension);
                  const isVideo = ["mp4", "mov", "webm"].includes(fileExtension);
                  const isDoc = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(fileExtension);

                  return (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border border-gray-200 cursor-pointer"
                      onClick={() => {
                        setPortfolioPreviewUrl(item.filepath);

                        if (isImage) setPortfolioPreviewType("image");
                        else if (isVideo) setPortfolioPreviewType("video");
                        else if (isDoc) setPortfolioPreviewType("doc");
                        else setPortfolioPreviewType("file");

                        setPortfolioPreviewOpen(true);
                      }}
                    >
                      {isImage && (
                        <img
                          src={item.filepath}
                          onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                          alt="portfolio"
                          className="w-full h-40 object-cover"
                        />
                      )}

                      {isVideo && (
                        <div className="relative w-full h-40 bg-black/10 flex items-center justify-center">
                          <video className="w-full h-full object-cover" controls>
                            <source src={item.filepath} type="video/mp4" />
                          </video>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition">
                            <RiPlayCircleFill className="text-white text-4xl" />
                          </div>
                        </div>
                      )}

                      {isDoc && (
                        <a
                          href={item.filepath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center justify-center w-full h-40 bg-gray-100 text-gray-700 p-2"
                        >
                          <RiFileTextLine className="text-3xl mb-2" />
                          <span className="text-xs text-center truncate">{item.filepath.split("/").pop()}</span>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {portfolioPreviewOpen && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              onClick={() => setPortfolioPreviewOpen(false)}
            >

              <button
                className="absolute top-6 right-6 text-white text-3xl font-bold"
                onClick={() => setPortfolioPreviewOpen(false)}
              >
                &times;
              </button>

              {/* IMAGE */}
              {portfolioPreviewType === "image" && (
                <img
                  src={portfolioPreviewUrl}
                  onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                  className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-xl object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              {/* VIDEO */}
              {portfolioPreviewType === "video" && (
                <video
                  controls
                  autoPlay
                  className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-xl object-contain"
                  onClick={(e) => e.stopPropagation()}
                >
                  <source src={portfolioPreviewUrl} />
                </video>
              )}

              {/* DOC/PDF */}
              {portfolioPreviewType === "doc" && (
                <iframe
                  src={`https://docs.google.com/viewer?url=${portfolioPreviewUrl}&embedded=true`}
                  className="w-[90vw] h-[90vh] rounded-xl bg-white"
                  onClick={(e) => e.stopPropagation()}
                />
              )}

            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="w-full md:w-[300px] space-y-4 flex-shrink-0">
          {/* Personal Details */}
          <div className="bg-white rounded-2xl p-4  w-full text-sm">
            <h3 className="font-semibold text-lg mb-4">Personal Details</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-900">Gender</p>
                <p className="text-gray-500">{p_profile?.genderid === 1 ? "Male" : "Female"}</p>
              </div>
              <hr className="my-4 border-gray-200" />
              <div>
                <p className="font-medium text-gray-900">Date Of Birth</p>
                <p className="text-gray-500">{p_profile?.dob}</p>
              </div>
              <hr className="my-4 border-gray-200" />
              <div>
                <p className="font-medium text-gray-900">Address</p>
                <p className="text-gray-500">
                  {p_profile?.address1}, {p_profile?.city}, {p_profile?.statename}, {p_profile?.zip}
                </p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-2xl p-4 text-sm w-full  border border-gray-100">
            <h3 className="font-bold mb-4 text-base text-gray-800">Social Media</h3>

            {p_socials?.length > 0 ? (
              <div className="flex flex-col gap-3">
                {p_socials.map((item, index) => {
                  const handleLink =
                    item?.handleslink?.startsWith("http")
                      ? item.handleslink
                      : item?.handleslink
                        ? `https://${item.handleslink}`
                        : null;

                  return (
                    <a
                      key={index}
                      href={handleLink || "#"}
                      target={handleLink ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className={`flex items-center gap-4 border border-gray-200 p-3 rounded-xl hover:shadow-md hover:border-gray-300 transition-all duration-200 ${handleLink ? "cursor-pointer" : "cursor-default"
                        }`}
                    >
                      {/* Icon */}
                      {item?.iconpath ? (
                        <img
                          src={item.iconpath}
                          onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                          alt={item.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                          ?
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex flex-col">
                        <p className="font-medium text-gray-800 text-sm">{item?.name}</p>

                        {handleLink ? (
                          <span className="text-blue-600 text-xs underline break-all">
                            {item.handleslink}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs italic">No link provided</span>
                        )}

                        <p className="text-gray-500 text-xs">
                          Followers:{" "}
                          <span className=" text-gray-500">
                            {item?.nooffollowers
                              ? item.nooffollowers.toLocaleString()
                              : "0"}
                          </span>
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">No social media accounts added yet.</p>
            )}
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-2xl p-4 text-sm w-full">
            <h3 className="font-bold mb-4 text-base">Payment Details</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-900">Country</p>
                <p className="text-gray-500">{p_profile?.countryname}</p>
              </div>
              <hr className="my-4 border-gray-200" />
              <div>
                <p className="font-medium text-gray-900">Bank</p>
                <p className="text-gray-500">{p_paymentaccounts?.bankname || "N/A"}</p>
              </div>
              <hr className="my-4 border-gray-200" />

              <div>
                <p className="font-medium text-gray-900">Account Holder’s Name</p>
                <p className="text-gray-500">{p_paymentaccounts?.accountholdername || "N/A"}</p>
              </div>
              <hr className="my-4 border-gray-200" />

              <div>
                <p className="font-medium text-gray-900">Account Number</p>
                <p className="text-gray-500">{p_paymentaccounts?.accountnumber || "N/A"}</p>
              </div>
              <hr className="my-4 border-gray-200" />

              <div>
                <p className="font-medium text-gray-900">IFSC Code</p>
                <p className="text-gray-500">{p_paymentaccounts?.bankcode || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
