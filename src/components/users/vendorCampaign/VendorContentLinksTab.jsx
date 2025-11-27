import React, { useEffect, useState } from "react";
import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import { message } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { safeArray, safeText } from "../../../App/safeAccess";


export default function VendorContentLinksTab({ campaignId }) {
    const [influencers, setInfluencers] = useState([]);
    const [activePlatform, setActivePlatform] = useState({});
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((state) => state.auth);

    const [copiedId, setCopiedId] = useState(null);

    const copyToClipboard = (id, link) => {
        const safeLink = safeText(link, "");
        navigator.clipboard.writeText(safeLink);
        setCopiedId(id);
        message.success("Link copied!");

        setTimeout(() => setCopiedId(null), 1000); // remove highlight after 1s
    };


    const fetchAllLinks = async () => {
        try {
            setLoading(true);

            const res = await axios.get(`/vendor/content-links/${campaignId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200) {
                const data = safeArray(res.data.data);
                setInfluencers(data);

                // Set default platform per influencer safely
                const initialPlatforms = {};

                data.forEach((inf) => {
                    const platforms = safeArray(inf?.contentlink);
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

    if (loading) return <p>Loading...</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
                Influencer Content Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {safeArray(influencers).map((inf) => {
                    const platforms = safeArray(inf?.contentlink);
                    if (platforms.length === 0) return null;

                    const active = activePlatform[inf.influencerid];

                    return (
                        <div
                            key={safeText(inf?.contractid)}
                            className="bg-gray-100 shadow-sm rounded-2xl p-4 space-y-4 border border-gray-100"
                        >
                            {/* Influencer Header */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={inf?.influencerphoto}
                                    alt="profile"

                                    className="w-12 h-12 rounded-full object-cover bg-gray-200"
                                />

                                <p className="text-xl font-semibold">
                                    {safeText(inf?.influencername, "Unknown Influencer")}
                                </p>
                            </div>

                            {/* Platform Tabs */}
                            <div className="flex gap-4 pb-0 flex-wrap">
                                {platforms.map((platform) => (
                                    <button
                                        key={platform.providerid}
                                        onClick={() =>
                                            setActivePlatform((prev) => ({
                                                ...prev,
                                                [inf.influencerid]: safeText(platform.providername),
                                            }))
                                        }
                                        className={`pb-1 font-medium text-sm ${active === safeText(platform.providername)
                                            ? "border-b-2 border-black"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        <span className="flex items-center gap-1">
                                            <img
                                                src={safeText(platform.iconpath)}
                                                className="w-4 h-4 object-contain"
                                                alt=""
                                                onError={(e) => (e.target.src = "/placeholder-icon.png")}
                                            />
                                            {safeText(platform.providername)} (
                                            {safeArray(platform.links).length})
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Content Link Cards */}
                            <div className="flex flex-wrap gap-2 mt-0">
                                {safeArray(
                                    platforms.find(
                                        (p) => safeText(p.providername) === active
                                    )?.links
                                ).map((item) => (
                                    <div
                                        key={item.contractcontentlinkid}
                                        onClick={() => copyToClipboard(item.contractcontentlinkid, item.link)}
                                        className={`w-52 px-3 py-0 rounded-xl border cursor-pointer transition flex items-center justify-between shadow-sm
        ${copiedId === item.contractcontentlinkid
                                                ? "bg-green-100 border-green-400"
                                                : "bg-white border-gray-200 hover:bg-gray-50"
                                            }
    `}
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
                    );
                })}
            </div>
        </div>
    );
}
