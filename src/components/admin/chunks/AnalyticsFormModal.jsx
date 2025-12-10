// components/AdminContentLinks/AnalyticsFormModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Input, DatePicker, Row, Col } from "antd";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const fieldRules = {
    Instagram: {
        Reel: { views: true, likes: true, comments: true, shares: true, other: ["Caption"] },
        Post: { views: false, likes: true, comments: true, shares: true, other: ["Caption"] },
    },
    YouTube: {
        Video: { views: true, likes: true, comments: true, shares: false, other: ["Title"] },
        Shorts: { views: true, likes: true, comments: true, shares: false, other: ["Title"] },
    },
    Facebook: {
        Post: { views: true, likes: true, comments: true, shares: true, other: [] },
        Reel: { views: true, likes: true, comments: true, shares: true, other: [] },

    },
    TikTok: { Video: { views: true, likes: true, comments: true, shares: true, other: ["Caption"] } },
    Pinterest: {
        Post: { views: false, likes: true, comments: true, shares: false, other: ["Title"] }
    },
    Threads: { Post: { views: false, likes: true, comments: true, shares: true, other: [] } },
    X: {
        Post: { views: true, likes: true, comments: true, shares: true, other: [] }
    },
};

const AnalyticsFormModal = ({ visible, onClose, contentData, data }) => {

    const [formData, setFormData] = useState({
        views: null,
        likes: null,
        comments: null,
        shares: null,
        date: null
        // dynamic fields will be added directly (flat)
    });

    const [errors, setErrors] = useState({});

    const { token } = useSelector((state) => state.auth);

    // -----------------------------------------
    // Load initial data
    // -----------------------------------------
    useEffect(() => {
        if (data) {
            let flatDynamic = {};

            // flatten ALL dynamic fields from backend
            if (data.Title) flatDynamic.Title = data.Title;
            if (data.Caption) flatDynamic.Caption = data.Caption;
            if (data.Reactions) flatDynamic.Reactions = data.Reactions;
            if (data.Bookmarks) flatDynamic.Bookmarks = data.Bookmarks;
            if (data.Description) flatDynamic.Description = data.Description;
            if (data.Quotes) flatDynamic.Quotes = data.Quotes;

            setFormData({
                views: data.views || null,
                likes: data.likes || null,
                comments: data.comments || null,
                shares: data.shares || null,

                date: data.date ? dayjs(data.date) : null,
                ...flatDynamic
            });

        } else if (contentData) {
            // Reset
            setFormData({
                views: null,
                likes: null,
                comments: null,
                shares: null,

                date: null
            });
        }
    }, [data, contentData]);

    // -----------------------------------------
    // Handle updates
    // -----------------------------------------
    const handleChange = (field, value) => {
        if (["views", "likes", "comments", "shares"].includes(field)) {
            // numeric only
            const numericValue = value.replace(/\D/g, "").slice(0, 10);
            setFormData(prev => ({ ...prev, [field]: numericValue }));
        } else if (field === "date") {
            setFormData(prev => ({ ...prev, date: value }));
        } else {
            // dynamic fields stored flat
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    if (!contentData) return null;

    const platform = contentData.platform;
    const contentType = contentData.contentType;
    const rules = fieldRules[platform]?.[contentType] || {};

    // -----------------------------------------
    // Validation
    // -----------------------------------------
    const validate = () => {
        const newErrors = {};

        // required numeric fields
        ["views", "likes", "comments", "shares",].forEach(field => {
            if (rules[field] && !formData[field]) {
                newErrors[field] = `${field[0].toUpperCase() + field.slice(1)} is required`;
            }
        });

        // required date
        if (!formData.date) {
            newErrors.date = "Date is required";
        } else if (formData.date.isAfter(dayjs(), "day")) {
            newErrors.date = "Date cannot be in the future";
        }

        // required dynamic fields
        rules.other.forEach(field => {
            const value = formData[field];

            if (!value) {
                newErrors[field] = `${field} is required`;
            }

            // enforce 50-char limit on Title
            if (["Title", "Caption"].includes(field) && value) {
                formData[field] = value.trim().slice(0, field === "Title" ? 50 : undefined);
            }
        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // -----------------------------------------
    // Save
    // -----------------------------------------
    const handleSave = async () => {
        if (!validate()) return;

        const { date, Title, Caption, ...rest } = formData;

        const payload = {
            p_userplatformanalyticid: data?.userplatformanalyticid || null,
            p_campaignid: contentData?.campaignid,
            p_influencerid: contentData?.influencerid,
            p_contentlinkid: contentData?.contractcontentlinkid,
            p_metricsjson: {
                ...rest, // views, likes, comments, shares
                title: Title || null, 
                caption : Caption || null,
                postdate: date ? date.format("DD-MM-YYYY") : null, // map date → postdate
            }
        };

        console.log("FINAL PAYLOAD:", payload);

        try {
            const res = await axios.post("/admin/analytics/data/insert-edit", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 200) {
                toast.success(res.data.message || "Analytics saved");
                onClose();
            } else {
                toast.error(res.data.message || "Something went wrong");
            }

        } catch (err) {
            console.error("Analytics Save Error:", err);
            toast.error("Server error. Try again later.");
        }
    };


    // -----------------------------------------
    // UI
    // -----------------------------------------
    return (
        <Modal
            title={`${data?.isUpdate ? "Update Analytics" : "Add Initial Analytics"} — ${platform}`}
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            className="rounded-2xl"
            width={600}
        >
            <div className="flex flex-col space-y-4">
                <div>
                    <p className="font-semibold">Influencer: {contentData.influencer}</p>
                    <p className="text-gray-500 break-all">Link: {contentData.link}</p>
                </div>

                <Row gutter={[16, 16]}>

                    {/* numeric fields */}
                    {rules.views && (
                        <Col xs={24} sm={12}>
                            <label>
                                Views
                                <Input
                                    value={formData.views}
                                    onChange={e => handleChange("views", e.target.value)}
                                    placeholder="Enter Views"
                                />
                                {errors.views && <p className="text-red-500">{errors.views}</p>}
                            </label>
                        </Col>
                    )}

                    {rules.likes && (
                        <Col xs={24} sm={12}>
                            <label>
                                Likes
                                <Input
                                    value={formData.likes}
                                    onChange={e => handleChange("likes", e.target.value)}
                                    placeholder="Enter Likes"
                                />
                                {errors.likes && <p className="text-red-500">{errors.likes}</p>}
                            </label>
                        </Col>
                    )}

                    {rules.comments && (
                        <Col xs={24} sm={12}>
                            <label>
                                Comments
                                <Input
                                    value={formData.comments}
                                    onChange={e => handleChange("comments", e.target.value)}
                                    placeholder="Enter Comments"
                                />
                                {errors.comments && <p className="text-red-500">{errors.comments}</p>}
                            </label>
                        </Col>
                    )}

                    {rules.shares && (
                        <Col xs={24} sm={12}>
                            <label>
                                Shares
                                <Input
                                    value={formData.shares}
                                    onChange={e => handleChange("shares", e.target.value)}
                                    placeholder="Enter Shares"
                                />
                                {errors.shares && <p className="text-red-500">{errors.shares}</p>}
                            </label>
                        </Col>
                    )}



                    {/* Date */}
                    <Col xs={24} sm={12}>
                        <label>
                            Date
                            <DatePicker
                                value={formData.date}
                                onChange={date => handleChange("date", date)}
                                className="w-full"
                                format="DD-MM-YYYY"
                                disabledDate={current =>
                                    current && current > dayjs().endOf("day")
                                }
                            />
                            {errors.date && <p className="text-red-500">{errors.date}</p>}
                        </label>
                    </Col>

                    {/* dynamic OTHER fields */}
                    {rules.other.map(field => (
                        <Col xs={24} sm={12} key={field}>
                            <label>
                                {field}
                                <Input
                                    value={formData[field] || ""}
                                    onChange={e => handleChange(field, e.target.value)}
                                    placeholder={`Enter ${field}`}
                                    maxLength={field === "Title" ? 50 : undefined}
                                />
                                {errors[field] && (
                                    <p className="text-red-500">{errors[field]}</p>
                                )}
                            </label>
                        </Col>
                    ))}
                </Row>

                {/* footer buttons */}
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        onClick={onClose}
                        className="text-[#0D132D] px-6 py-2 border border-[#0D132D] rounded-2xl hover:bg-[#1b2250] hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-[#0D132D] text-white px-6 py-2 rounded-2xl hover:bg-[#1b2250]"
                    >
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AnalyticsFormModal;
