import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Upload } from "antd";
import { RiVerifiedBadgeLine, RiUpload2Line } from "@remixicon/react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

// Reusable file handlers
import useFileUpload from "../../../hooks/useFileUpload";
import FilePreview from "../../common/FilePreview";

const { TextArea } = Input;

const ApplyNowModal = ({ open, onClose, campaignId }) => {
    const [amount, setAmount] = useState("");
    const [proposal, setProposal] = useState("");
    const [errors, setErrors] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        fileList,
        existingFiles,
        deletedFilePaths,
        fileError,
        setExistingFiles,
        handleFileChange,
        handleRemove,
    } = useFileUpload();

    const token = useSelector((state) => state.auth.token);

    // ============= VALIDATION =============
    const validate = () => {
        const newErrors = {};
        if (!amount || Number(amount) <= 0) {
            newErrors.amount = "Please enter a valid amount greater than 0.";
        }

        if (amount && amount.length > 7) {
            newErrors.amount = "Amount cannot exceed 7 digits.";
        }
        if (!proposal.trim()) {
            newErrors.proposal = "Please describe your proposal.";
        }
        if (fileList.length + existingFiles.length < 1) {
            newErrors.portfolioFile = "Please upload at least one portfolio file.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setAmount("");
        setProposal("");
        setErrors({});
        setIsEdit(false);

        setExistingFiles([]);
    };

    // ============= SUBMIT FORM =============
    const handleSubmit = async () => {
        if (!validate()) return;

        const applycampaignjson = {
            amount,
            proposal,
            filepaths: existingFiles.map((f) => ({ filepath: f.filepath })),
        };

        const formData = new FormData();
        formData.append("applycampaignjson", JSON.stringify(applycampaignjson));

        fileList.forEach((f) => formData.append("portfolioFiles", f));

        // delete removed files
        for (const path of deletedFilePaths) {
            try {
                await axios.post(
                    "/user/apply-now/portfoliofile-delete",
                    { filePath: path },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (err) {
                toast.error(err)
                console.error("Delete failed:", path);
            }
        }

        try {
            setLoading(true);
            const res = await axios.post(
                `user/apply-for-campaign/${campaignId}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(res.data.message);

            onClose(); // close modal
            resetForm();
        } catch (err) {
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ============= LOAD EDIT DATA =============
    const loadData = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
            `user/signle-applied/${campaignId}`,
            { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = res.data?.data;
            if (!data) return;

            setIsEdit(data.isapplied);
            setAmount(data.budget || "");
            setProposal(data.description || "");

            // resetFiles();

            if (data.filepaths?.length > 0) {
            const formattedFiles = data.filepaths.map((f, i) => ({
                uid: `existing-${i}`,
                name: f.filepath.split("/").pop(),
                url: f.filepath,
                filepath: f.filepath,
                type: "file",
            }));

            setExistingFiles(formattedFiles);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        };

    useEffect(() => {
        if (open) loadData();
    }, [open]);

    return (
        <Modal
         key={campaignId} 
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
            destroyOnClose
        >
            <h2 className="text-xl font-semibold mb-4">
                {isEdit ? "Edit Application" : "Apply Now"}
            </h2>

            {isEdit && (
                <div className="p-3 mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
                    You already applied. Update your proposal & files below.
                </div>
            )}

            {/* Proposal */}
            <label className="font-medium mb-2">
                Describe Your Proposal <span className="text-red-500">*</span>
            </label>
            <TextArea
                rows={4}
                placeholder="Describe your proposal..."
                value={proposal}
                onChange={(e) => {
                    setProposal(e.target.value);
                    setErrors(prev => ({ ...prev, proposal: "" }));
                }}
                status={errors.proposal ? "error" : ""}
                className="mt-2"
            />
            {errors.proposal && <p className="text-red-500">{errors.proposal}</p>}

            {/* Files */}
            <h3 className="mt-5 font-semibold mb-2">Portfolio <span className="text-red-500">*</span></h3>

            <Upload.Dragger
                beforeUpload={() => false}
                fileList={[]}
                multiple
                showUploadList={false}
                onChange={(info) => {
                    handleFileChange(info);
                    info.fileList.length = 0;
                    setErrors(prev => ({ ...prev, portfolioFile: "" }));
                }}
            >
                <div className="flex flex-col items-center">
                    <RiUpload2Line className="text-3xl text-gray-400" />
                    <p className="text-sm">Upload your files</p>
                </div>
            </Upload.Dragger>

            {fileError && <p className="text-red-500">{fileError}</p>}
            {errors.portfolioFile && <p className="text-red-500">{errors.portfolioFile}</p>}

            <FilePreview
                files={[...existingFiles, ...fileList]}
                onRemove={(file) => handleRemove(file.uid)}
            />

            {/* Amount */}
            <label className="block mt-4 mb-2 font-medium">
                Proposal Amount <span className="text-red-500">*</span>
            </label>
            <Input
                type="number"
                addonBefore="₹"
                placeholder="0.00"
                maxLength={7}
                value={amount}
                onChange={(e) => {
                    const value = e.target.value;

                    // Allow only digits
                    if (!/^\d*$/.test(value)) return;

                    // Prevent entering more than 7 digits
                    if (value.length > 7) {
                        setErrors(prev => ({ ...prev, amount: "Amount cannot exceed 7 digits." }));
                        return;
                    }

                    setAmount(value);
                    setErrors(prev => ({ ...prev, amount: "" }));
                }}

            />
            {errors.amount && <p className="text-red-500">{errors.amount}</p>}

            {/* Submit */}
            <div className="mt-6 flex justify-end">
                <Button
                    type="primary"
                    className="!bg-[#0f122f]"
                    loading={loading}
                    onClick={handleSubmit}
                >
                    {isEdit ? "Save Changes" : "Apply Now"}
                </Button>
            </div>

        </Modal>
    );
};

export default ApplyNowModal;
