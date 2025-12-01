import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Select, message, Form, Alert } from "antd";
import { RiAddLine } from "@remixicon/react";
import { toast } from "react-toastify";
import axios from "axios";

export default function ContentLinksTab({ token, contractId, campaignId }) {
    const [platforms, setPlatforms] = useState([]);
    const [availablePlatforms, setAvailablePlatforms] = useState([]);
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [confirmRemove, setConfirmRemove] = useState({ open: false, pIndex: null });


    // ---------------- URL Validation ----------------
    const validateLink = (value, existingLinks = [], currentIndex = null) => {
        const trimmed = value.trim();
        if (!trimmed) return "Link cannot be empty.";
        // Generic URL validation
        if (!/^https?:\/\/.+/.test(trimmed)) return "Invalid URL.";
        const duplicate = existingLinks.some((l, i) => i !== currentIndex && l.trim() === trimmed);
        if (duplicate) return "This link already exists.";
        return "";
    };

    // ---------------- Validate Entire Platform ----------------
    const validatePlatform = (pIndex) => {
        const p = platforms[pIndex];
        const platformErrors = {};
        let valid = true;

        p.links.forEach((link, li) => {
            const err = validateLink(link, p.links, li);
            if (err) valid = false;
            platformErrors[li] = err;
        });

        setErrors((prev) => ({ ...prev, [pIndex]: platformErrors }));
        return valid;
    };

    // ---------------- Add Platform ----------------
    const handleAddPlatform = (platformId) => {
        const selected = availablePlatforms.find((p) => p.id === platformId);
        if (!selected) return;

        if (platforms.some((p) => p.id === platformId)) {
            message.error("Platform already added.");
            return;
        }

        setPlatforms([...platforms, { id: selected.id, name: selected.name, icon: selected.iconpath, links: [""] }]);
        setIsModalOpen(false);
    };

    // ---------------- Update Link ----------------
    const updateLink = (pIndex, linkIndex, value) => {
        setPlatforms((prev) =>
            prev.map((p, idx) =>
                idx === pIndex ? { ...p, links: p.links.map((l, li) => (li === linkIndex ? value : l)) } : p
            )
        );

        const err = validateLink(value, platforms[pIndex].links, linkIndex);
        setErrors((prev) => ({ ...prev, [pIndex]: { ...prev[pIndex], [linkIndex]: err } }));
    };

    // ---------------- Add Link Field ----------------
    const addLinkField = (pIndex) => {
        setPlatforms((prev) =>
            prev.map((p, i) => (i === pIndex && p.links.length < 10 ? { ...p, links: [...p.links, ""] } : p))
        );
        setErrors((prev) => ({ ...prev, [pIndex]: { ...prev[pIndex], [platforms[pIndex].links.length]: "" } }));
    };

    // ---------------- Remove Link ----------------
    const removeLink = (pIndex, linkIndex) => {
        setPlatforms((prev) =>
            prev.map((p, i) => (i === pIndex ? { ...p, links: p.links.filter((_, li) => li !== linkIndex) } : p))
        );

        setErrors((prev) => {
            const copy = { ...prev };
            if (copy[pIndex]) {
                delete copy[pIndex][linkIndex];
                if (!Object.keys(copy[pIndex]).length) delete copy[pIndex];
            }
            return copy;
        });
    };



    // ---------------- Save All ----------------
    const saveAll = async () => {
        let valid = true;
        platforms.forEach((_, pIndex) => {
            if (!validatePlatform(pIndex)) valid = false;
        });
        if (!valid) {
            toast.error("Please fix validation errors before saving.");
            return;
        }

        if (!contractId) {
            toast.error("Contract ID not found.");
            return;
        }

        setSaving(true);
        try {
            const payload = platforms.map((p) => ({
                providerid: p.id,
                providername: p.name,
                contentlinks: p.links.map((link) => ({
                    links: link
                }))
            }));

            await axios.post(
                "/user/upload/content-link",
                { p_contractid: contractId, p_contentlinkjson: payload },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("All links saved successfully!");
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to save links.");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. Load all available platforms
                const platformRes = await axios.get("/providers");
                const aps = platformRes?.data?.data || [];
                setAvailablePlatforms(aps);

                // 2. Load influencer's previously uploaded content links
                const linkRes = await axios.get(`/user/content-links/${campaignId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const entry = linkRes?.data?.data?.[0] || {};
                const oldData = entry?.contentlink;

                // 3. If influencer has never uploaded content links → show empty UI
                if (!oldData || oldData.length === 0) {
                    setPlatforms([]);
                    return;
                }

                // 4. Convert backend structure into UI format
                const mapped = oldData.map((item) => ({
                    id: item.providerid,
                    name: item.providername,
                    icon: item.iconpath,
                    // extract only the link string
                    links: item.links?.map((l) => l.link) || []
                }));

                setPlatforms(mapped);

            } catch (error) {
                console.error("Failed to load content links:", error);
                message.error("Failed to load content links");
            }
        };

        fetchInitialData();
    }, [campaignId, token]);



    const PLATFORM_OPTIONS = availablePlatforms.map((p) => ({
        value: p.id,
        label: (
            <div className="flex items-center gap-2">
                <img src={p.iconpath} alt={p.name} className="w-5 h-5" />
                <span>{p.name}</span>
            </div>
        ),
    }));

    const hasGlobalErrors = Object.values(errors).some((p) => Object.values(p).some((e) => e));

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold">Manage Content Links</h2>
                <Button
                    type="primary"
                    icon={<RiAddLine />}
                    onClick={() => setIsModalOpen(true)}
                    className="!bg-[#0F122F] !border-[#0F122F] hover:!bg-[#1A1D45] hover:!border-[#1A1D45] !text-white w-full sm:w-auto"
                >
                    Add New Platform
                </Button>
            </div>

            {/* Global Error Panel */}
            {hasGlobalErrors && (
                <Alert
                    message="Validation Errors"
                    description="Please fix the highlighted fields below."
                    type="error"
                    showIcon
                    className="mb-4"
                />
            )}

            {/* Platform Cards */}
            <div className="space-y-4">

                {/* EMPTY STATE WHEN NO CONTENT LINKS */}
                {platforms?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4076/4076508.png"
                            alt="No content"
                            className="w-28 h-28 opacity-70 mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">No Content Links Added Yet</h3>
                        <p className="text-gray-600 max-w-md mb-6">
                            You haven’t uploaded any content links yet.
                            Please add the platforms where you’ve posted your campaign content.
                        </p>
                        <Button
                            type="primary"
                            size="large"
                            icon={<RiAddLine />}
                            onClick={() => setIsModalOpen(true)}
                            className="!bg-[#0F122F] !border-[#0F122F] hover:!bg-[#1A1D45] hover:!border-[#1A1D45] !text-white"
                        >
                            Add Your First Platform
                        </Button>
                    </div>
                )}

                {platforms?.map((p, pIndex) => (
                    <div key={pIndex} className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-white shadow-sm">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                            <div className="flex items-center gap-2">
                                <img src={p.icon} alt={p.name} className="w-6 h-6" />
                                <span className="text-lg font-medium">{p.name}</span>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button onClick={() => saveAll()} loading={saving}>
                                    Update Links
                                </Button>
                                <Button
                                    danger
                                    onClick={() => setConfirmRemove({ open: true, pIndex })}
                                >
                                    Remove Platform
                                </Button>
                            </div>
                        </div>

                        {/* Link Fields */}
                        {p.links.map((link, li) => (
                            <Form.Item
                                key={li}
                                validateStatus={errors[pIndex]?.[li] ? "error" : ""}
                                help={errors[pIndex]?.[li]}
                            >
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Input
                                        value={link}
                                        placeholder={`Paste ${p.name} link`}
                                        onChange={(e) => updateLink(pIndex, li, e.target.value)}
                                    />
                                    <Button danger onClick={() => removeLink(pIndex, li)} className="w-full sm:w-auto">
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
                ))}
            </div>

            {/* Save All */}
            {platforms.length > 0 && (
                <div className="text-right mt-8">
                    <Button
                        type="primary"
                        size="large"
                        loading={saving}
                        onClick={saveAll}
                        className="!bg-[#0F122F] !border-[#0F122F] hover:!bg-[#1A1D45] hover:!border-[#1A1D45] !text-white w-full sm:w-auto"
                    >
                        Save All
                    </Button>
                </div>
            )}

            {/* Modal */}
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
                    optionLabelProp="label"
                    onChange={handleAddPlatform}
                />
            </Modal>


            <Modal
                title="Confirm Removal"
                open={confirmRemove.open}
                onCancel={() => setConfirmRemove({ open: false, pIndex: null })}
                onOk={async () => {
                    const pIndex = confirmRemove.pIndex;
                    const removedPlatform = platforms[pIndex];

                    // Remove from state
                    const updatedPlatforms = platforms.filter((_, i) => i !== pIndex);
                    setPlatforms(updatedPlatforms);

                    // Also remove errors
                    setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors[pIndex];
                        return newErrors;
                    });

                    setConfirmRemove({ open: false, pIndex: null });

                    // Call Save API immediately to persist deletion
                    if (contractId) {
                        try {
                            setSaving(true);
                            const payload = updatedPlatforms.map((p) => ({
                                providerid: p.id,
                                providername: p.name,
                                contentlinks: p.links.map((link) => ({ links: link }))
                            }));

                            await axios.post(
                                "/user/upload/content-link",
                                { p_contractid: contractId, p_contentlinkjson: payload },
                                { headers: { Authorization: `Bearer ${token}` } }
                            );

                            
                            toast.success(`${removedPlatform.name} removed successfully!`);
                        } catch (error) {
                            console.error(error);
                            toast.error(error?.response?.data?.message || "Failed to remove platform.");
                            // Optional: revert platform in case of API failure
                            setPlatforms((prev) => [...prev, removedPlatform]);
                        } finally {
                            setSaving(false);
                        }
                    }
                }}
                okText="Yes, Remove"
                cancelText="Cancel"
                centered
            >
                <p>Are you sure you want to remove this platform? This action cannot be undone.</p>
            </Modal>

        </div>
    );
}
