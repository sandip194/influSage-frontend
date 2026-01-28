import React, { useEffect, useState } from "react";
import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import { message, Spin, Empty } from "antd";
import api from "../../../api/axios";import { useSelector } from "react-redux";
import { safeArray, safeText } from "../../../App/safeAccess";

export default function VendorContentLinksTab({ campaignId }) {
  const [influencers, setInfluencers] = useState([]);
  const [activePlatform, setActivePlatform] = useState({});
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const [copiedId, setCopiedId] = useState(null);

  // Copy link to clipboard
  const copyToClipboard = (id, link) => {
    const safeLink = safeText(link, "");
    navigator.clipboard.writeText(safeLink);
    setCopiedId(id);
    message.success("Link copied!");
    setTimeout(() => setCopiedId(null), 1000); // remove highlight after 1s
  };

  // Normalize/group content links by provider
  const groupByProvider = (contentlinks) => {
    const grouped = {};

    safeArray(contentlinks).forEach((item) => {
      const provider = safeText(item.providername);

      if (!grouped[provider]) {
        grouped[provider] = {
          providerid: item.providerid,
          providername: item.providername,
          iconpath: item.iconpath,
          contenttypes: [],
        };
      }

      // Take content type name from first link (all links in this contentlink have same type)
      const contentTypeName = safeArray(item.links)[0]?.contentypename || "Unknown";

      grouped[provider].contenttypes.push({
        contractcontenttypeid: item.contractcontenttypeid,
        contentypename: contentTypeName,
        links: safeArray(item.links),
      });
    });

    return Object.values(grouped);
  };


  // Fetch all links
  const fetchAllLinks = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/vendor/content-links/${campaignId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res?.status === 200) {
        const data = safeArray(res.data.data);
        setInfluencers(data);

        // Set default active platform for each influencer
        const initialPlatforms = {};
        data.forEach((inf) => {
          const platforms = groupByProvider(inf?.contentlink);
          if (platforms.length > 0) {
            initialPlatforms[inf.influencerid] = safeText(platforms[0].providername);
          }
        });
        setActivePlatform(initialPlatforms);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLinks();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-16">
        <Spin size="large" />
      </div>
    );

  if (safeArray(influencers).length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Empty
          description="No content links available yet."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />

      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight mb-6">
        Influencer Content Links
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {safeArray(influencers).map((inf) => {
          const platforms = groupByProvider(inf?.contentlink);
          const active = activePlatform[inf.influencerid];

          return (
            <div
              key={safeText(inf?.contractid)}
              className="bg-[#335CFF0D] shadow-sm rounded-2xl p-4 space-y-4 border border-[#335CFF26]"
            >
              {/* Influencer Header */}
              <div className="flex items-center gap-3">
                <img
                  src={inf?.influencerphoto}
                  alt="profile"
                  onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                  className="w-12 h-12 rounded-full object-cover bg-gray-200"
                />
                <p className="text-xl font-semibold">
                  {safeText(inf?.influencername, "Unknown Influencer")}
                </p>
              </div>

              {/* Check if there are platforms */}
              {platforms.length === 0 ? (
                <div className="py-2">
                  <Empty
                    description="No content links Uploaded yet."
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              ) : (
                <>
                  {/* Provider Tabs */}
                  <div className="flex gap-4 pb-0 flex-wrap">
                    {platforms.map((platform) => (
                      <button
                        key={platform.providerid + platform.providername}
                        onClick={() =>
                          setActivePlatform((prev) => ({
                            ...prev,
                            [inf.influencerid]: safeText(platform.providername),
                          }))
                        }
                        className={`pb-1 cursor-pointer font-medium text-sm ${active === safeText(platform.providername)
                          ? "border-b-2 border-black"
                          : "text-gray-500"
                          }`}
                      >
                        <span className="flex items-center gap-1">
                          <img
                            src={safeText(platform.iconpath)}
                            className="w-4 h-4 object-contain"
                            alt=""
                            onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
                          />
                          {safeText(platform.providername)} (
                          {platform.contenttypes.reduce(
                            (acc, ct) => acc + safeArray(ct.links).length,
                            0
                          )}
                          )
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Content Link Cards */}
                  <div className="flex flex-col gap-4 mt-0">
                    {platforms
                      .find((p) => safeText(p.providername) === active)
                      ?.contenttypes.map((ct) => (
                        <div key={ct.contractcontenttypeid} className="w-full">
                          <p className="font-semibold text-sm mb-1">{ct.contentypename}</p>
                          <div className="flex flex-wrap gap-2">
                            {safeArray(ct.links).map((item) => (
                              <div
                                key={item.contractcontentlinkid}
                                onClick={() =>
                                  copyToClipboard(item.contractcontentlinkid, item.link)
                                }
                                className={`w-52 px-3 py-0 rounded-xl border  cursor-pointer transition flex items-center justify-between shadow-sm ${copiedId === item.contractcontentlinkid
                                  ? "bg-green-100 border-green-400"
                                  : "bg-white border-[#335CFF26] hover:bg-gray-50"
                                  }`}
                              >
                                <span className="text-gray-700 text-sm truncate">
                                  {safeText(item.link, "No Link")}
                                </span>

                                {copiedId === item.contractcontentlinkid ? (
                                  <RiCheckLine className="text-green-600" size={30} />
                                ) : (
                                  <RiFileCopyLine className="text-gray-500" size={30} />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
