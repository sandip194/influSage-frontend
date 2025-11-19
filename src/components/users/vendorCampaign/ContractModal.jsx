import React, { useEffect, useState, useCallback } from "react";
import {
    Modal,
    Form,
    Select,
    Input,
    InputNumber,
    DatePicker,
    Checkbox,
    Button,
    Row,
    Col,
    Spin,
    Alert,
    Collapse,
} from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { Panel } = Collapse;

export default function ContractModal({
    isOpen,
    onClose,
    onSubmit,  // Now expects this to handle the API call (e.g., POST contract data)
    existingCampaignStart = null,
    existingCampaignEnd = null,
}) {
    const [form] = Form.useForm();
    const { token } = useSelector((state) => state.auth);

    const [platforms, setPlatforms] = useState([]);
    const [contentTypesByPlatform, setContentTypesByPlatform] = useState({});
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [loadingPlatforms, setLoadingPlatforms] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [influencers, setInfluencers] = useState([]);  // New: State for API-fetched influencers
    const [loadingInfluencers, setLoadingInfluencers] = useState(false);  // New: Loading for influencers
    const [influencerError, setInfluencerError] = useState(null);  // New: Error for influencers
    const [submitError, setSubmitError] = useState(null);  // New: Error for submit

    // New: Fetch influencers via API (replace with your real endpoint)
    useEffect(() => {
        const fetchInfluencers = async () => {
            setLoadingInfluencers(true);
            setInfluencerError(null);
            try {
                const res = await axios.get("/api/influencers", {  // Replace with your API endpoint
                    headers: { Authorization: `Bearer ${token}` },
                });
                setInfluencers(res.data || []);  // Assume API returns an array of { id, name, platform }
            } catch (err) {
                console.error("Error fetching influencers:", err);
                setInfluencerError("Failed to load influencers. Please try again.");
            } finally {
                setLoadingInfluencers(false);
            }
        };

        if (isOpen) {
            fetchInfluencers();
        }
    }, [isOpen, token]);

    // Fetch platforms & content types (unchanged, but kept for completeness)
    useEffect(() => {
        const fetchPlatforms = async () => {
            setLoadingPlatforms(true);
            try {
                const res = await axios.get("/vendor/provider-content-type", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const apiPlatforms = res.data.providorType || [];

                // Group content types by providerid
                const grouped = apiPlatforms.reduce((acc, item, index) => {
                    const key = String(item.providerid);
                    if (!acc[key]) acc[key] = [];
                    acc[key].push({
                        id: item.contenttypeid
                            ? Number(item.contenttypeid)
                            : Number(`${item.providerid}${index}`),
                        contenttypename: item.contenttypename || "Unknown",
                        providerid: item.providerid,
                    });
                    return acc;
                }, {});

                setContentTypesByPlatform(grouped);

                // Extract unique platforms
                const uniquePlatforms = apiPlatforms.reduce((acc, item) => {
                    if (!acc.some((p) => p.providerid === item.providerid)) {
                        acc.push({
                            providerid: item.providerid,
                            providername: item.providername,
                        });
                    }
                    return acc;
                }, []);

                setPlatforms(uniquePlatforms);
            } catch (err) {
                console.error("Error fetching provider content types:", err);
            } finally {
                setLoadingPlatforms(false);
            }
        };

        if (isOpen) {
            fetchPlatforms();
        }
    }, [isOpen, token]);

    // New: Permanent validation check (silent, doesn't show errors until submit)
    const isFormValid = useCallback(async () => {
        try {
            await form.validateFields({ validateOnly: true });  // Silent validation
            return true;
        } catch {
            return false;
        }
    }, [form]);

    const resetState = () => {
        form.resetFields();
        setSelectedPlatforms([]);
        setSubmitLoading(false);
        setSubmitError(null);
        setInfluencerError(null);
    };

    const handleModalClose = () => {
        resetState();
        onClose();
    };

    // Fixed: Safe dayjs helper
    const safeDayjs = (date) => {
        if (!date) return null;
        const d = dayjs(date, "DD-MM-YYYY");
        return d.isValid() ? d : null;
    };

    // Set initial dates
    useEffect(() => {
        if (isOpen) {
            form.resetFields();
            const fields = {};
            const start = safeDayjs(existingCampaignStart);
            const end = safeDayjs(existingCampaignEnd);
            if (start) fields.campaignStart = start;
            if (end) fields.campaignEnd = end;
            form.setFieldsValue(fields);
        }
    }, [isOpen, existingCampaignStart, existingCampaignEnd, form]);

    // Updated: Handle form submission with API integration
    const handleFinish = async (values) => {
        isFormValid()
        setSubmitLoading(true);
        setSubmitError(null);
        values.deliverables = selectedPlatforms;
        try {
            await onSubmit(values);  // Call the prop, which should handle the API (e.g., axios.post)
            handleModalClose();
        } catch (err) {
            console.error("Submit error:", err);
            setSubmitError("Failed to create contract. Please check your inputs and try again.");
            setSubmitLoading(false);  // Re-enable button on error
        }
    };

    return (
        <Modal
            title={null}  // Remove default title to match custom header
            open={isOpen}
            onCancel={handleModalClose}
            footer={null}
            destroyOnClose
            width={900}
            bodyStyle={{ padding: 0 }}  // Remove padding for custom layout
            maskClosable={false}
            className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-2xl"  // Apply Tailwind classes
        >
            {/* Custom Header */}
            <header className="flex items-center justify-between ">
                <h1 className="text-xl font-bold text-text-light dark:text-text-dark">Create New Contract</h1>

            </header>

            {/* Main Content */}
            <main className="p-2 space-y-0 bg-background-light dark:bg-background-dark">
                {submitError && <Alert message={submitError} type="error" showIcon style={{ marginBottom: 16 }} />}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    validateTrigger="onSubmit"  // Errors only on submit
                    requiredMark={false}  // Disable Ant Design's default * to avoid duplication
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Influencers */}
                        <div className="md:col-span-1">
                            <Form.Item
                                label={<span className="block text-sm font-medium text-text-light mb-1">Select Influencers <span className="text-red-500">*</span></span>}
                                name="influencers"
                                rules={[{ required: true, message: "Please select influencers" }]}
                                style={{ marginBottom: 2 }}
                            >
                                <Select
                                    placeholder={loadingInfluencers ? "Loading..." : "Select influencers"}
                                    size="large"
                                    showSearch
                                    allowClear
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    disabled={loadingInfluencers}
                                    notFoundContent={influencerError ? <Alert message={influencerError} type="error" /> : null}
                                    className="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-primary focus:border-primary"
                                >
                                    {influencers.map((inf) => (
                                        <Select.Option key={inf.id} value={inf.id}>
                                            {inf.name} ({inf.platform})
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        {/* Contract Start */}
                        <div className="md:col-span-1">
                            <Form.Item
                                label={<span className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Contract Start Date <span className="text-red-500">*</span></span>}
                                name="contractStart"
                                rules={[{ required: true, message: "Select contract start date" }]}
                                style={{ marginBottom: 2 }}
                            >
                                <DatePicker
                                    placeholder="Start Date"
                                    format="DD-MM-YYYY"
                                    size="large"
                                    style={{ width: "100%" }}
                                    disabledDate={(current) => current && current < dayjs().startOf("day")}
                                    className="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-primary focus:border-primary"
                                />
                            </Form.Item>
                        </div>

                        {/* Contract End */}
                        <div className="md:col-span-1">
                            <Form.Item
                                label={<span className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Contract End Date <span className="text-red-500">*</span></span>}
                                name="contractEnd"
                                dependencies={["contractStart"]}
                                style={{ marginBottom: 2 }}
                                rules={[
                                    { required: true, message: "Select contract end date" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const start = getFieldValue("contractStart");
                                            if (!value || !start) return Promise.resolve();
                                            if (value.isSame(start, "day") || value.isAfter(start)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error("End date must be same or after start date")
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker
                                    placeholder="End Date"
                                    format="DD-MM-YYYY"
                                    size="large"
                                    style={{ width: "100%" }}
                                    disabledDate={(current) => {
                                        const start = form.getFieldValue("contractStart");
                                        return start ? current && current < start : false;
                                    }}
                                    className="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-primary focus:border-primary"
                                />
                            </Form.Item>
                        </div>

                        {/* Campaign Start */}
                        <div className="md:col-span-1">
                            <Form.Item
                                label={<span className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Campaign Start Date <span className="text-red-500">*</span></span>}
                                name="campaignStart"
                                rules={[{ required: true, message: "Select campaign start date" }]}
                                style={{ marginBottom: 2 }}
                            >
                                <DatePicker
                                    placeholder="Start Date"
                                    format="DD-MM-YYYY"
                                    size="large"
                                    style={{ width: "100%" }}
                                    disabledDate={(current) => current && current < dayjs().startOf("day")}
                                    className="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-primary focus:border-primary"
                                />
                            </Form.Item>
                        </div>

                        {/* Campaign End */}
                        <div className="md:col-span-1">
                            <Form.Item
                                label={<span className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Campaign End Date <span className="text-red-500">*</span></span>}
                                name="campaignEnd"
                                dependencies={["campaignStart"]}
                                style={{ marginBottom: 2 }}
                                rules={[
                                    { required: true, message: "Select campaign end date" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const start = getFieldValue("campaignStart");
                                            if (
                                                !value ||
                                                !start ||
                                                value.isAfter(start) ||
                                                value.isSame(start, "day")
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error("End date must be same or after start date")
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker
                                    placeholder="End Date"
                                    format="DD-MM-YYYY"
                                    size="large"
                                    style={{ width: "100%" }}
                                    disabledDate={(current) => {
                                        const start = form.getFieldValue("campaignStart");
                                        return !start
                                            ? current && current < dayjs().startOf("day")
                                            : current && current < start;
                                    }}
                                    className="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-primary focus:border-primary"
                                />
                            </Form.Item>
                        </div>



                        {/* Payment */}
                        <div className="md:col-span-1">
                            <Form.Item
                                label={<span className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Payment Amount (₹) <span className="text-red-500">*</span></span>}
                                name="payment"
                                rules={[{ required: true, message: "Enter payment amount" }]}
                                style={{ marginBottom: 2 }}
                            >
                                <InputNumber
                                    size="large"
                                    style={{ width: "100%" }}
                                    formatter={(value) =>
                                        value ? `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
                                    }
                                    parser={(value) => value.replace(/\₹\s?|(,*)/g, "")}
                                    min={0}
                                    maxLength={13}
                                    placeholder="0"
                                    className="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-primary focus:border-primary"
                                />
                            </Form.Item>
                        </div>

                        {/* Platforms & Deliverables */}
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                                Platforms &amp; Deliverables <span className="text-red-500">*</span>
                            </label>
                            {loadingPlatforms ? (
                                <div className="text-center p-4">
                                    <Spin tip="Loading platforms..." />
                                </div>
                            ) : (
                                <div className="border border border-gray-300  rounded-md p-4 space-y-2">
                                    {selectedPlatforms.length === 0 && (
                                        <p className="text-subtext-light dark:text-subtext-dark">No platforms selected. Use dropdown below to add.</p>
                                    )}
                                    {selectedPlatforms.map((platform, idx) => (
                                        <div key={platform.providerid} className="space-y-6">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold text-text-light dark:text-text-dark">{platform.providername}</h3>
                                                <button
                                                    type="button"
                                                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                                                    onClick={() =>
                                                        setSelectedPlatforms(
                                                            selectedPlatforms.filter((_, i) => i !== idx)
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="flex items-center space-x-6 flex-wrap ps-4">
                                                {(contentTypesByPlatform[String(platform.providerid)] || []).map(
                                                    (ct) => {
                                                        const isChecked = platform.contentTypes.some(
                                                            (d) => d.id === ct.id
                                                        );

                                                        return (
                                                            <label key={ct.id} className="flex items-center space-x-2 text-sm text-subtext-light dark:text-subtext-dark">
                                                                <Checkbox
                                                                    checked={isChecked}
                                                                    onChange={(e) => {
                                                                        const updatedPlatforms = selectedPlatforms.map(
                                                                            (p, i) => {
                                                                                if (i !== idx) return p;

                                                                                const contentTypes = e.target.checked
                                                                                    ? [...p.contentTypes, { ...ct }]
                                                                                    : p.contentTypes.filter(
                                                                                        (d) => d.id !== ct.id
                                                                                    );

                                                                                return { ...p, contentTypes };
                                                                            }
                                                                        );
                                                                        setSelectedPlatforms(updatedPlatforms);
                                                                    }}
                                                                    className="rounded text-primary focus:ring-primary/50"
                                                                />
                                                                <span className="ps-2">{ct.contenttypename}</span>
                                                            </label>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <Select
                                        placeholder="Add Platform"
                                        value={null}
                                        onChange={(val) => {
                                            if (!selectedPlatforms.some((p) => p.providerid === val)) {
                                                const p = platforms.find((p) => p.providerid === val);
                                                if (p)
                                                    setSelectedPlatforms([...selectedPlatforms, { ...p, contentTypes: [] }]);
                                            }
                                        }}
                                        size="large"
                                        style={{ width: "100%" }}
                                        disabled={loadingPlatforms}
                                        className="form-select w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-primary focus:border-primary"
                                    >
                                        {platforms.map((p) => (
                                            <Select.Option key={p.providerid} value={p.providerid}>
                                                {p.providername}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div>
                            )}

                            {/* Hidden validation */}
                            <Form.Item
                                name="deliverables"
                                rules={[
                                    {
                                        validator: () =>
                                            selectedPlatforms.some(p => p.contentTypes.length > 0)
                                                ? Promise.resolve()
                                                : Promise.reject("Select at least one platform with content type"),
                                    },
                                ]}
                                hidden
                            >
                                <Input value={JSON.stringify(selectedPlatforms)} />
                            </Form.Item>
                        </div>

                        {/* Product Link and Vendor Address in a 2-column sub-grid */}
                        <div className="md:col-span-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Product Link */}
                                <div>
                                    <Form.Item
                                        label={<span className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Product Link</span>}
                                        name="productLink"
                                        style={{ marginBottom: 2 }}
                                        rules={[
                                            { type: "url", message: "Enter a valid URL" },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (value || getFieldValue("vendorAddress")) return Promise.resolve();
                                                    return Promise.reject(
                                                        new Error("Fill Product Link or Vendor Address")
                                                    );
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Enter product link"
                                            className="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-primary focus:border-primary"
                                        />
                                    </Form.Item>
                                </div>

                                {/* Vendor Address */}
                                <div>
                                    <Form.Item
                                        label={<span className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Vendor Address</span>}
                                        name="vendorAddress"
                                        style={{ marginBottom: 2 }}
                                        rules={[
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (value || getFieldValue("productLink")) return Promise.resolve();
                                                    return Promise.reject(
                                                        new Error("Fill Vendor Address or Product Link")
                                                    );
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Enter vendor address"
                                            className="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-primary focus:border-primary"
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="md:col-span-3">
                            <Form.Item
                                label={<span className="block text-sm font-medium text-text-light  mb-1">Notes</span>}
                                name="notes"
                            >
                                <TextArea
                                    rows={4}
                                    maxLength={250}
                                    showCount
                                    placeholder="e.g. #BrandName hashtag"
                                    className="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-primary focus:border-primary"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="pt-4 text-right">
                        <button
                            type="submit"
                            disabled={submitLoading}
                            className={`
      bg-[#0f122f] text-white px-6 py-2 cursor-pointer rounded-full border border-[#0f122f]
      font-semibold hover:bg-[#1a1d4f] transition
      inline-flex items-center justify-center gap-2
      ${submitLoading ? "opacity-70 cursor-not-allowed" : ""}
    `}
                        >
                            {submitLoading && (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            )}
                            {submitLoading ? "Processing..." : "Create Contract"}
                        </button>
                    </footer>

                </Form>
            </main>
        </Modal>
    );

}