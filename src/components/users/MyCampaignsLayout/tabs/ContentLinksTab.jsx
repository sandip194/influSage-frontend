import React, { useState } from "react";
import { Button, Input, Modal, Select, message, Form, Alert } from "antd";
import {
    RiAddLine,
    RiYoutubeFill,
    RiInstagramFill,
    RiTiktokFill,
} from "@remixicon/react";
import { toast } from "react-toastify";

/* ---------------- PLATFORM CONFIG ---------------- */
const PLATFORM_CONFIG = {
    youtube: {
        label: "YouTube",
        icon: <RiYoutubeFill className="text-red-600" size={22} />,
        regex: /^https?:\/\/(www\.)?youtube\.com\/watch\?v=/i,
    },
    instagram: {
        label: "Instagram",
        icon: <RiInstagramFill className="text-pink-500" size={22} />,
        regex: /^https?:\/\/(www\.)?instagram\.com\//i,
    },
    tiktok: {
        label: "TikTok",
        icon: <RiTiktokFill className="text-black" size={22} />,
        regex: /^https?:\/\/(www\.)?tiktok\.com\//i,
    },
};

const PLATFORM_OPTIONS = Object.keys(PLATFORM_CONFIG).map((key) => ({
    label: PLATFORM_CONFIG[key].label,
    value: key,
    icon: PLATFORM_CONFIG[key].icon,
}));

/* -------- Detect platform from pasted URL -------- */
const detectPlatformFromURL = (url) => {
    for (let key in PLATFORM_CONFIG) {
        if (PLATFORM_CONFIG[key].regex.test(url)) return key;
    }
    return null;
};

export default function ContentLinksTab({ onSubmit }) {
    const [platforms, setPlatforms] = useState([]);
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    /* ----------- VALIDATE SINGLE LINK ---------- */
    const validateLink = (platformType, value, existingLinks = [], currentIndex = null) => {
        const trimmed = value.trim();

        if (!trimmed) return "Link cannot be empty.";
        if (!PLATFORM_CONFIG[platformType].regex.test(trimmed))
            return `Invalid ${platformType} URL.`;

        // Check for duplicates (exclude itself)
        const duplicate = existingLinks.some((l, i) => i !== currentIndex && l.trim() === trimmed);
        if (duplicate) return "This link already exists.";

        return "";
    };


    /* ----------- VALIDATE WHOLE PLATFORM -------- */
    const validatePlatform = (pIndex) => {
        const p = platforms[pIndex];
        const platformErrors = {};

        let valid = true;

        p.links.forEach((link, li) => {
            const err = validateLink(p.type, link);
            if (err) valid = false;
            platformErrors[li] = err;
        });

        setErrors((prev) => ({
            ...prev,
            [pIndex]: platformErrors,
        }));

        return valid;
    };

    /* ---------- Add platform ---------- */
    const handleAddPlatform = (type) => {
        if (platforms.some((p) => p.type === type)) {
            message.error("Platform already added.");
            return;
        }

        setPlatforms([...platforms, { type, links: [""] }]);
        setIsModalOpen(false);
    };

    /* ---------- Update link ---------- */
    const updateLink = (pIndex, linkIndex, value) => {
        setPlatforms((prev) =>
            prev.map((p, idx) =>
                idx === pIndex
                    ? {
                        ...p,
                        links: p.links.map((l, li) =>
                            li === linkIndex ? value : l
                        ),
                    }
                    : p
            )
        );

        const err = validateLink(platforms[pIndex].type, value);

        setErrors((prev) => ({
            ...prev,
            [pIndex]: { ...prev[pIndex], [linkIndex]: err },
        }));
    };

    /* -------- Add Link Field -------- */
    const addLinkField = (pIndex) => {
        setPlatforms((prev) =>
            prev.map((p, i) =>
                i === pIndex
                    ? {
                        ...p,
                        links:
                            p.links.length < 10
                                ? [...p.links, ""]
                                : p.links,
                    }
                    : p
            )
        );

        if (platforms[pIndex].links.length < 10) {
            setErrors((prev) => ({
                ...prev,
                [pIndex]: {
                    ...prev[pIndex],
                    [platforms[pIndex].links.length]: "",
                },
            }));
        }
    };

    /* -------- Remove Link -------- */
    const removeLink = (pIndex, linkIndex) => {
        setPlatforms((prev) =>
            prev.map((p, i) =>
                i === pIndex
                    ? {
                        ...p,
                        links: p.links.filter((_, li) => li !== linkIndex),
                    }
                    : p
            )
        );

        setErrors((prev) => {
            const copy = { ...prev };
            if (copy[pIndex]) {
                delete copy[pIndex][linkIndex];
                if (Object.keys(copy[pIndex]).length === 0) delete copy[pIndex];
            }
            return copy;
        });
    };

    /* -------- Remove Platform -------- */
    const removePlatform = (pIndex) => {
        setPlatforms((prev) => prev.filter((_, i) => i !== pIndex));

        setErrors((prev) => {
            const copy = { ...prev };
            delete copy[pIndex];
            return copy;
        });
    };

    /* -------- Update Links Button -------- */
    const savePlatformLinks = (pIndex) => {
        if (validatePlatform(pIndex)) {
            toast.success("Links updated!");
        }
    };

    /* -------- Save All -------- */
    const saveAll = async () => {
        let valid = true;

        platforms.forEach((_, pIndex) => {
            if (!validatePlatform(pIndex)) valid = false;
        });

        if (!valid) {
            toast.error("Please fix the errors below.");
            return;
        }

        setSaving(true);
        try {
            const payload = platforms.map((p) => ({
                platform: p.type,
                links: p.links,
            }));

            await onSubmit?.(payload);

            toast.success("All links saved!");
        } catch (e) {
            toast.error("Failed to save.");
        }
        setSaving(false);
    };

    const hasGlobalErrors = Object.values(errors).some((p) =>
        Object.values(p).some((e) => e)
    );

    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">

            {/* -------- Header ---------- */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold">
                    Manage Content Links
                </h2>

                <Button
                    type="primary"
                    icon={<RiAddLine />}
                    onClick={() => setIsModalOpen(true)}
                    className="!bg-[#0F122F] !border-[#0F122F] hover:!bg-[#1A1D45] 
                               hover:!border-[#1A1D45] !text-white w-full sm:w-auto"
                >
                    Add New Platform
                </Button>
            </div>

            {/* -------- Global Error Panel -------- */}
            {hasGlobalErrors && (
                <Alert
                    message="Validation Errors"
                    description="Please fix the highlighted fields below."
                    type="error"
                    showIcon
                    className="mb-4"
                />
            )}

            {/* -------- Platform Cards -------- */}
            <div className="space-y-4">
                {platforms.map((p, pIndex) => {
                    const meta = PLATFORM_CONFIG[p.type];

                    return (
                        <div
                            key={pIndex}
                            className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-white shadow-sm"
                        >
                            {/* HEADER */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                    {meta.icon}
                                    <span className="text-lg font-medium">
                                        {meta.label}
                                    </span>
                                </div>

                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button onClick={() => savePlatformLinks(pIndex)}>
                                        Update Links
                                    </Button>

                                    <Button danger onClick={() => removePlatform(pIndex)}>
                                        Remove Platform
                                    </Button>
                                </div>
                            </div>

                            {/* Fields */}
                            {p.links.map((link, li) => (
                                <Form.Item
                                    key={li}
                                    validateStatus={
                                        errors[pIndex]?.[li] ? "error" : ""
                                    }
                                    help={errors[pIndex]?.[li]}
                                >
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Input
                                            value={link}
                                            placeholder={`Paste ${p.type} link`}
                                            onChange={(e) =>
                                                updateLink(
                                                    pIndex,
                                                    li,
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <Button
                                            danger
                                            onClick={() => removeLink(pIndex, li)}
                                            className="w-full sm:w-auto"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </Form.Item>
                            ))}

                            {/* Add Link */}
                            <Button
                                onClick={() => addLinkField(pIndex)}
                                disabled={p.links.length >= 10}
                                className="border border-dashed w-full sm:w-auto"
                            >
                                + Add Another Link
                            </Button>
                        </div>
                    );
                })}
            </div>

            {/* SAVE ALL */}
            {platforms.length > 0 && (
                <div className="text-right mt-8">
                    <Button
                        type="primary"
                        size="large"
                        loading={saving}
                        onClick={saveAll}
                        className="!bg-[#0F122F] !border-[#0F122F] hover:!bg-[#1A1D45] 
                                   hover:!border-[#1A1D45] !text-white w-full sm:w-auto"
                    >
                        Save All
                    </Button>
                </div>
            )}

            {/* MODAL */}
            <Modal
                title="Select Platform"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
            >
                <Select
                    className="w-full"
                    placeholder="Choose platform"
                    options={PLATFORM_OPTIONS}
                    onChange={handleAddPlatform}
                />
            </Modal>
        </div>
    );
}
