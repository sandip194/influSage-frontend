import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiHeartLine, RiHeartFill, RiUserAddLine } from "@remixicon/react";
import { Tooltip } from "antd";


const InfluencerCard = ({ influencer, onLike, onInvite, BASE_URL }) => {
    const navigate = useNavigate();


    const handleCardClick = () => {
        navigate(
            `/vendor-dashboard/browse-influencers/influencer-details/${influencer?.id}`
        );
    };

    return (
        <div
            className="border rounded-2xl transition border-gray-200 bg-white p-5 flex flex-col cursor-pointer hover:bg-gray-100"
            onClick={handleCardClick}
        >
            <div className="flex justify-between mb-3">
                <div className="flex flex-col sm:flex-row items-start gap-3 flex-1 min-w-0">
                    <img
                        src={
                            influencer?.photopath
                                ? `${BASE_URL}/${influencer?.photopath}`
                                : "https://via.placeholder.com/150"
                        }
                        alt="profile"
                        loading="lazy"
                        className="w-12 h-12 object-cover rounded-full flex-shrink-0"
                    />

                </div>

                <div className="flex gap-2 flex-shrink-0">
                    <Tooltip title="Invite">
                        <button
                            aria-label="Invite"
                            onClick={(e) => {
                                e.stopPropagation();
                                onInvite(influencer?.id);
                            }}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0f122f] text-white hover:bg-[#23265a] transition"
                        >
                            <RiUserAddLine size={16} />
                        </button>
                    </Tooltip>

                    <Tooltip title={influencer?.savedinfluencer ? "Unfavorite" : "Favorite"}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onLike(influencer?.id);
                            }}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0f122f] text-white hover:bg-[#23265a] transition"
                        >
                            {influencer?.savedinfluencer ? (
                                <RiHeartFill size={20} className="text-red-500 cursor-pointer" />
                            ) : (
                                <RiHeartLine size={20} className="text-gray-400 cursor-pointer" />
                            )}
                        </button>
                    </Tooltip>
                </div>
            </div>
            <div className="min-w-0">
                <Link
                    to={`/vendor-dashboard/browse-influencers/influencer-details/${influencer?.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="block max-w-full font-semibold text-gray-900 hover:text-blue-600 hover:underline"
                >
                    <span className="inline break-all">{influencer?.firstname}&nbsp;</span>
                    <span className="inline break-words">{influencer?.lastname}</span>
                </Link>

            </div>

            <div className="text-xs text-gray-500 mt-1">
                {influencer?.statename}, {influencer?.countryname}
            </div>
            <div className="text-xs text-gray-500 mt-1">
                {influencer?.contentlanguages?.map((lang, idx) => (
                    <span key={idx}>
                        {lang.languagename}
                        {idx < influencer?.contentlanguages.length - 1 && ", "}
                    </span>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                {influencer?.providers
                    ?.filter((p) => p.nooffollowers > 0)
                    .map((p) => (
                        <span key={p.providerid} className="flex items-center gap-1">
                            <img
                                src={`${BASE_URL}/${p.iconpath}`}
                                alt={p.providername}
                                className="w-4 h-4"
                            />
                            {p.nooffollowers}
                        </span>
                    ))}
            </div>
        </div>
    );
};

export default InfluencerCard;
