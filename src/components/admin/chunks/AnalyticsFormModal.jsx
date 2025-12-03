// components/AdminContentLinks/AnalyticsFormModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";

const AnalyticsFormModal = ({ visible, onClose, onSave, data }) => {
    const [formData, setFormData] = useState({
        views: "",
        likes: "",
        comments: "",
    });

    // Load values when editing
    useEffect(() => {
        if (data) {
            setFormData({
                views: data.views || "",
                likes: data.likes || "",
                comments: data.comments || "",
            });
        }
    }, [data]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Modal
            title={`${data?.isUpdate ? "Update Analytics" : "Add Initial Analytics"} — ${data?.platform}`}
            open={visible}
            onCancel={onClose}
            footer={null} // We'll use custom buttons
            centered
            className="rounded-2xl"
        >
            <div className="flex flex-col space-y-4">

                <div>
                    <p className="font-semibold">Influencer: {data?.influencer}</p>
                    <p className="text-gray-500 break-all">Link: {data?.link}</p>
                </div>

                <div className="flex flex-col space-y-3">
                    <label>
                        Views
                        <input
                            type="number"
                            value={formData.views}
                            onChange={(e) => handleChange("views", e.target.value)}
                            className="w-full mt-1 p-2 rounded-2xl border border-gray-200"
                        />
                    </label>

                    <label>
                        Likes
                        <input
                            type="number"
                            value={formData.likes}
                            onChange={(e) => handleChange("likes", e.target.value)}
                            className="w-full mt-1 p-2 rounded-2xl border border-gray-200"
                        />
                    </label>

                    <label>
                        Comments
                        <input
                            type="number"
                            value={formData.comments}
                            onChange={(e) => handleChange("comments", e.target.value)}
                            className="w-full mt-1 p-2 rounded-2xl border border-gray-200"
                        />
                    </label>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                    
                    <button
                        onClick={onClose}
                        className="text-[#0D132D] px-6 py-2 border border-[#0D132D] rounded-xl hover:bg-[#1b2250] hover:text-white transition-colors flex-shrink-0"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onSave(formData)}
                        className="bg-[#0D132D] text-white px-6 py-2 border border-[#0D132D] rounded-xl hover:bg-[#1b2250] transition-colors flex-shrink-0"
                    >
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AnalyticsFormModal;
