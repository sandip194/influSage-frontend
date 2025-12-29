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
    TikTok: {
        Video: { views: true, likes: true, comments: true, shares: true, other: ["Caption"] }
    },
    Pinterest: {
        Post: { views: false, likes: true, comments: true, shares: false, other: ["Title"] }
    },
    Threads: {
        Post: { views: false, likes: true, comments: true, shares: true, other: [] }
    },
    X: {
        Post: { views: true, likes: true, comments: true, shares: true, other: [] }
    },
};

const AnalyticsFormModal = ({ visible, onClose, onSuccess, contentData }) => {
    const [formData, setFormData] = useState({
        views: null,
        likes: null,
        comments: null,
        shares: null,
        date: null
    });

    const [previousData, setPreviousData] = useState(null);
    const [errors, setErrors] = useState({});
    const { token } = useSelector((state) => state.auth);

    const isUpdate = contentData?.isUpdate;

    const platform = contentData?.platform;
    const contentType = contentData?.contentType;
    const rules = fieldRules[platform]?.[contentType] || {};

    useEffect(() => {
        if (visible && contentData) {
            setFormData({
                views: null,
                likes: null,
                comments: null,
                shares: null,
                date: null,
            });
            setErrors({});
            setPreviousData(null);
        }
    }, [visible, contentData?.contractcontentlinkid]);


    // ------------------------------------------------------------------------------------
    // LOAD EXISTING ANALYTICS WHEN EDITING
    // ------------------------------------------------------------------------------------
    useEffect(() => {
        const loadLatestAnalytics = async () => {
            if (!isUpdate || !contentData) {
                setPreviousData(null);
                return;
            }

            try {
                const res = await axios.get("/admin/user-Platform-Analytics", {
                    params: {
                        p_userplatformanalyticid: contentData.userplatformanalyticid
                    },
                    headers: { Authorization: `Bearer ${token}` },
                });

                const latest = res?.data?.data;

                if (latest) {
                    setPreviousData(latest);

                    let dynamic = {
                        Title: latest.title ?? "",
                        Caption: latest.caption ?? ""
                    };

                    setFormData({
                        views: latest.views ?? "",
                        likes: latest.likes ?? "",
                        comments: latest.comments ?? "",
                        shares: latest.shares ?? "",
                        date: latest.postdate ? dayjs(latest.postdate) : null,
                        ...dynamic
                    });
                }
            } catch (err) {
                console.error("Fetch Single Analytics Error", err);
            }
        };

        if (visible) loadLatestAnalytics();
    }, [visible, contentData, isUpdate, token]);


    // ------------------------------------------------------------------------------------
    // HANDLE CHANGE
    // ------------------------------------------------------------------------------------
    const handleChange = (field, value) => {
        if (["views", "likes", "comments", "shares"].includes(field)) {
            const numericValue = value.replace(/\D/g, "").slice(0, 10);
            setFormData((prev) => ({ ...prev, [field]: numericValue }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    // ------------------------------------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------------------------------------
    const validate = () => {
        const newErrors = {};

        ["views", "likes", "comments", "shares"].forEach((f) => {
            if (rules[f] && !formData[f]) {
                newErrors[f] = `${f} is required`;
            }
        });

        // Date is required ONLY when adding first-time analytics
        if (!isUpdate) {
            if (!formData.date) {
                newErrors.date = "Date is required";
            } else if (formData.date.isAfter(dayjs(), "day")) {
                newErrors.date = "Date cannot be in the future";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ------------------------------------------------------------------------------------
    // SAVE HANDLER
    // ------------------------------------------------------------------------------------
    const handleSave = async () => {
        if (!validate()) return;

        const payload = {
            p_userplatformanalyticid: contentData?.userplatformanalyticid,
            // p_campaignid: contentData.campaignid,
            // p_influencerid: contentData.influencerid,
            p_contentlinkid: contentData.contractcontentlinkid,
            p_metricsjson: {
                views: formData.views,
                likes: formData.likes,
                comments: formData.comments,
                shares: formData.shares,
                title: formData.Title ?? previousData?.title ?? null,
                caption: formData.Caption ?? previousData?.caption ?? null,
                postdate: isUpdate
                    ? dayjs(previousData?.postdate).format("DD-MM-YYYY")
                    : formData.date?.format("DD-MM-YYYY"),
            }
        };

        try {
            const res = await axios.post("/admin/analytics/data/insert-edit", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200) {
                toast.success(res.data.message || "Analytics saved");
                onSuccess?.();
                onClose();
            } else {
                toast.error(res.data.message || "Something went wrong");
            }

        } catch (err) {
            console.error(err);
            toast.error("Server error. Try again later.");
        }
    };

    if (!contentData) return null;

    // ------------------------------------------------------------------------------------
    // UI
    // ------------------------------------------------------------------------------------
    return (
        <Modal
            title={`${isUpdate ? "Update Analytics" : "Add Initial Analytics"} — ${platform}`}
            open={visible}
            onCancel={() => {
                onClose();
                setFormData({
                    views: null,
                    likes: null,
                    comments: null,
                    shares: null,
                    date: null,
                });
                setErrors({});
            }}

            footer={null}
            centered
            width={600}
        >
            <div className="flex flex-col space-y-4">
                <div>
                    <p className="font-semibold">Influencer: {contentData.influencer}</p>
                    <p className="text-gray-500 break-all">Link: {contentData.link}</p>
                </div>

                <Row gutter={[16, 16]}>

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

                    {/* DATE FIELD (DISABLED IN UPDATE MODE) */}
                    <Col xs={24} sm={12}>
                        <label>
                            Date
                            <DatePicker
                                value={formData.date}
                                onChange={(date) => handleChange("date", date)}
                                className="w-full"
                                format="DD-MM-YYYY"
                                disabled={isUpdate}
                                disabledDate={(current) =>
                                    current && current > dayjs().endOf("day")
                                }
                            />
                            {errors.date && <p className="text-red-500">{errors.date}</p>}
                        </label>
                    </Col>

                    {/* DYNAMIC FIELDS (DISABLED IN UPDATE MODE) */}
                    {(rules.other || []).map((field) => (
                        <Col xs={24} sm={12} key={field}>
                            <label>
                                {field}
                                <Input
                                    value={formData[field] || ""}
                                    onChange={(e) => handleChange(field, e.target.value)}
                                    placeholder={`Enter ${field}`}
                                    disabled={isUpdate}
                                    maxLength={field === "Title" ? 50 : undefined}
                                />
                                {errors[field] && (
                                    <p className="text-red-500">{errors[field]}</p>
                                )}
                            </label>
                        </Col>
                    ))}
                </Row>

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
