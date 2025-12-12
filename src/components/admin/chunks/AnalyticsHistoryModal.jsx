import React from "react";
import { Modal } from "antd";

const AnalyticsHistoryModal = ({ visible, onClose, history }) => {
  const safeHistory = history || [];

  return (
    <Modal
      title="Analytics History"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="rounded-2xl"
    >
      <div className="relative py-4">

        {/* Center Vertical Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-300 -translate-x-1/2"></div>

        {safeHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No history available</p>
        ) : (
          safeHistory.map((h, idx) => {
            const isLeft = idx % 2 === 0;

            return (
              <div key={idx} className="w-full mb-12 flex relative">

                {/* LEFT SIDE */}
                {isLeft ? (
                  <div className="w-1/2 pr-8 text-right relative">

                    {/* Dot */}
                    <div className="absolute top-6 right-[-10px] w-4 h-4 rounded-full bg-[#0D132D] border-2 border-white"></div>

                    {/* Card */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 inline-block">
                      {/* Date */}
                      <div className="text-xs text-gray-500 mb-1">
                        {new Date(h.createddate).toLocaleString()}
                      </div>

                      {/* Title */}
                      <div className="text-sm font-semibold text-[#0D132D]">
                        {h.title}
                      </div>

                      {/* Caption */}
                      {h.caption && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {h.caption}
                        </p>
                      )}

                      {/* Metrics */}
                      <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
                        <div>
                          <span className="text-gray-500">Views</span>
                          <div className="font-bold text-blue-600">{h.views}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Likes</span>
                          <div className="font-bold text-green-600">{h.likes}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Comments</span>
                          <div className="font-bold text-purple-600">{h.comments}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Shares</span>
                          <div className="font-bold text-orange-600">{h.shares}</div>
                        </div>
                      </div>

                      {/* Post Date */}
                      <div className="text-[11px] text-gray-500 mt-2">
                        Post Date:{" "}
                        {h.postdate ? new Date(h.postdate).toLocaleDateString() : "—"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-1/2"></div> // Empty left space for right items
                )}

                {/* RIGHT SIDE */}
                {!isLeft ? (
                  <div className="w-1/2 pl-8 text-left relative">

                    {/* Dot */}
                    <div className="absolute top-6 left-[-10px] w-4 h-4 rounded-full bg-[#0D132D] border-2 border-white"></div>

                    {/* Card */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 inline-block">
                      {/* Date */}
                      <div className="text-xs text-gray-500 mb-1">
                        {new Date(h.createddate).toLocaleString()}
                      </div>

                      {/* Title */}
                      <div className="text-sm font-semibold text-[#0D132D]">
                        {h.title}
                      </div>

                      {/* Caption */}
                      {h.caption && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {h.caption}
                        </p>
                      )}

                      {/* Metrics */}
                      <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
                        <div>
                          <span className="text-gray-500">Views</span>
                          <div className="font-bold text-blue-600">{h.views}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Likes</span>
                          <div className="font-bold text-green-600">{h.likes}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Comments</span>
                          <div className="font-bold text-purple-600">{h.comments}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Shares</span>
                          <div className="font-bold text-orange-600">{h.shares}</div>
                        </div>
                      </div>

                      {/* Post Date */}
                      <div className="text-[11px] text-gray-500 mt-2">
                        Post Date:{" "}
                        {h.postdate ? new Date(h.postdate).toLocaleDateString() : "—"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-1/2"></div> // Empty right space for left items
                )}

              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
};

export default AnalyticsHistoryModal;
