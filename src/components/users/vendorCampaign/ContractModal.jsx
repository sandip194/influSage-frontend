import React, { useEffect, useState, useCallback } from "react";
import {
    Modal,
    Form,
    Select,
    Input,
    InputNumber,
    DatePicker,
    Checkbox,
    Spin,
    Alert,
    Collapse,
    Avatar,
} from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { Panel } = Collapse;

const safeDayjs = (date) => {
    if (!date) return null;
    const d = dayjs(date, "DD-MM-YYYY");
    return d.isValid() ? d : null;
};

export default function ContractModal({
    isOpen,
    onClose,
    onSubmit,  // Now expects this to handle the API call (e.g., POST contract data)
    existingCampaignStart,
    existingCampaignEnd,
    campaignId,
    editData
}) {
    const [form] = Form.useForm();
    const { token } = useSelector((state) => state.auth);

    const campaignStartLimit = safeDayjs(existingCampaignStart);
    const campaignEndLimit = safeDayjs(existingCampaignEnd);

    const [startPickerMonth, setStartPickerMonth] = useState(campaignStartLimit || dayjs());
    const [endPickerMonth, setEndPickerMonth] = useState(campaignEndLimit || dayjs());

    const [platforms, setPlatforms] = useState([]);
    const [contentTypesByPlatform, setContentTypesByPlatform] = useState({});
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [loadingPlatforms, setLoadingPlatforms] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [influencers, setInfluencers] = useState([]);  // New: State for API-fetched influencers
    const [loadingInfluencers, setLoadingInfluencers] = useState(false);  // New: Loading for influencers
    const [influencerError, setInfluencerError] = useState(null);  // New: Error for influencers
    const [submitError, setSubmitError] = useState(null);  // New: Error for submit
    const [submitAttempted, setSubmitAttempted] = useState(false);


    const isPlatformInvalid = (platform) =>
        submitAttempted && (!platform.contenttypes || platform.contenttypes.length === 0);


    // New: Fetch influencers via API (replace with your real endpoint)
    useEffect(() => {
        const fetchInfluencers = async () => {
            setLoadingInfluencers(true);
            setInfluencerError(null);

            try {
                const res = await axios.get("/vendor/selected/influencer", {
                    params: { campaign_id: campaignId },
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = res.data?.data;

                // 🔥 Case 1: API returns a message like:
                // [ { "message": "No influencer selected" } ]
                if (Array.isArray(data) && data.length === 1 && data[0].message) {
                    setInfluencers([]);
                    return;
                }

                // 🔥 Case 2: Normal case — array of influencers
                const converted = (data || []).map((inf) => ({
                    id: inf.campaignapplicationid,
                    name: `${inf.influencername}`,
                    photo: inf.userphotopath,
                    platform: null,
                }));

                setInfluencers(converted);

            } catch (err) {
                console.error("Error fetching influencers:", err);
                setInfluencerError("Failed to load influencers. Please try again.");
            } finally {
                setLoadingInfluencers(false);
            }
        };

        fetchInfluencers();
    }, [campaignId]);

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
                        id: item.providercontenttypeid
                            ? Number(item.providercontenttypeid)
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

    useEffect(() => {
        if (!editData || platforms.length === 0) return;

        const paymentNumber = Number(
            String(editData.payment || "").replace(/[^\d]/g, "")
        );

        const editInfluencer = {
            id: editData.influencer.id,
            name: editData.influencer?.name || `Influencer ${editData.influencerSelectId}`,
            photo: editData.influencer?.photo || null,
        };

        setInfluencers([editInfluencer]);

        // ✅ Map + resolve providerid safely
        const mappedPlatforms = (editData.deliverables || [])
            .map((p) => {
                const platform = platforms.find(
                    (pl) => pl.providername === p.provider
                );

                if (!platform) return null;

                return {
                    providerid: platform.providerid,
                    providername: platform.providername,
                    contenttypes: (p.contenttypes || []).map((ct) => ({
                        providercontenttypeid: ct.providercontenttypeid,
                        contenttypename: ct.contenttypename,
                    })),
                };
            })
            .filter(Boolean);

        // ✅ DEDUPLICATE platforms (🔥 fixes double Instagram issue)
        const uniquePlatforms = Array.from(
            new Map(
                mappedPlatforms.map((p) => [p.providerid, p])
            ).values()
        );

        setSelectedPlatforms(uniquePlatforms);

        // ✅ Sync AntD form once
        form.setFieldsValue({
            influencers: editInfluencer.id,
            payment: paymentNumber,
            contractStart: dayjs(editData.contractStart, "DD-MM-YYYY"),
            contractEnd: dayjs(editData.contractEnd, "DD-MM-YYYY"),
            notes: editData.notes || "",
            productLink: editData.productLink || "",
            vendorAddress: editData.vendorAddress || "",
            deliverables: uniquePlatforms,
        });

    }, [editData, platforms]); // ❌ remove `form` from deps




    // New: Permanent validation check (silent, doesn't show errors until submit)
    const isFormValid = useCallback(async () => {
        try {
            await form.validateFields({ validateOnly: true });
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


    const handleFinish = async (values) => {
        setSubmitAttempted(true);
        const isValid = await isFormValid();
        if (!isValid) return;


        // 🔥 REMOVE platforms with empty contenttypes
        const filteredPlatforms = selectedPlatforms.filter(
            (p) => p.contenttypes && p.contenttypes.length > 0
        );

        if (filteredPlatforms.length !== selectedPlatforms.length) {
            setSubmitError("Each platform must have at least one content type selected.");
            return;
        }

        values.deliverables = filteredPlatforms;

        try {
            setSubmitLoading(true);
            await onSubmit(values);
            handleModalClose();
        } catch (err) {
            console.error("Submit error:", err);
            setSubmitError("Failed to create contract. Please try again.");
            setSubmitLoading(false);
        }
    };


    const handleFinishFailed = () => {
        setSubmitAttempted(true);
    };



    useEffect(() => {
        form.validateFields(["deliverables"]);
    }, [selectedPlatforms]);

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
                {/* {submitError && (
                    <Alert message={submitError} type="error" showIcon style={{ marginBottom: 16 }} />
                )} */}

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    onFinishFailed={handleFinishFailed}
                    validateTrigger="onSubmit"
                    requiredMark={false}
                >

                    {/* ---------- GRID START ---------- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                        {/* ===========================
                             ROW 1: Influencers + Payment
                            ============================== */}
                        {/* Influencers */}
                        <div>
                            <Form.Item
                                label={
                                    <span className="block text-sm font-medium text-text-light mb-1">
                                        Select Influencers <span className="text-red-500">*</span>
                                    </span>
                                }
                                name="influencers"
                                rules={[{ required: true, message: "Please select influencers" }]}
                                style={{ marginBottom: 2 }}
                            >
                                <Select
                                    placeholder={loadingInfluencers ? "Loading..." : "Select influencers"}
                                    size="large"
                                    showSearch
                                    allowClear
                                    onChange={() => form.validateFields(["influencers"])}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    disabled={loadingInfluencers || !!editData}
                                    notFoundContent={
                                        loadingInfluencers
                                            ? "Loading..."
                                            : influencerError
                                                ? influencerError
                                                : influencers.length === 0
                                                    ? "No influencers found"
                                                    : null
                                    }
                                    className="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark"
                                >
                                    {influencers.map((inf) => (
                                        <Select.Option key={inf.id} value={inf.id}>
                                            <div className="flex items-center gap-2">
                                                <Avatar
                                                    size="small"
                                                    src={inf.photo}
                                                >
                                                    {!inf.photo && inf.name?.charAt(0)}
                                                </Avatar>
                                                <span >{inf.name}</span>
                                            </div>
                                        </Select.Option>

                                    ))}
                                </Select>

                            </Form.Item>
                        </div>

                        {/* Payment */}
                        <div>
                            <Form.Item
                                label={
                                    <span className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                                        Payment Amount (₹) <span className="text-red-500">*</span>
                                    </span>
                                }
                                name="payment"
                                rules={[{ required: true, message: "Enter payment amount" }]}
                                style={{ marginBottom: 2 }}
                            >
                                <InputNumber
                                    size="large"
                                    addonBefore="₹"
                                    style={{ width: "100%" }}
                                    min={0}
                                    maxLength={10}
                                    onChange={() => form.validateFields(["payment"])}
                                    placeholder="0"
                                    controls={false} // hides the up/down arrows
                                    formatter={(value) => {
                                        if (!value) return;
                                        const num = Number(String(value).replace(/[^\d]/g, ""));
                                        return num.toLocaleString("en-IN");
                                    }}
                                    parser={(value) => {
                                        // Remove anything that is not a digit
                                        return value.replace(/[^\d]/g, "");
                                    }}
                                    className="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
                                    onKeyDown={(e) => {
                                        // block non-numeric keys
                                        if (
                                            ["e", "E", "+", "-", ".", ","].includes(e.key) ||
                                            (!/^\d$/.test(e.key) && e.key.length === 1)
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                />

                            </Form.Item>
                        </div>

                        {/* ===========================
                             ROW 2: Contract Start + Contract End
                            ============================== */}
                        {/* Contract Start */}
                        <div>
                            <Form.Item
                                label={
                                    <span className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                                        Contract Start Date <span className="text-red-500">*</span>
                                    </span>
                                }
                                name="contractStart"
                                rules={[
                                    { required: true, message: "Select contract start date" },
                                    () => ({
                                        validator(_, value) {
                                            if (!value) return Promise.resolve();

                                            if (campaignStartLimit && value.isBefore(campaignStartLimit, "day")) {
                                                return Promise.reject(
                                                    `Start date cannot be before campaign start (${campaignStartLimit.format("DD-MM-YYYY")})`
                                                );
                                            }

                                            if (campaignEndLimit && value.isAfter(campaignEndLimit, "day")) {
                                                return Promise.reject(
                                                    `Start date cannot be after campaign end (${campaignEndLimit.format("DD-MM-YYYY")})`
                                                );
                                            }

                                            return Promise.resolve();
                                        }
                                    })
                                ]}

                                style={{ marginBottom: 2 }}
                            >
                                <DatePicker
                                    placeholder="Start Date"
                                    format="DD-MM-YYYY"
                                    size="large"
                                    value={form.getFieldValue("contractStart")}
                                    onChange={(date) => {
                                        form.setFieldsValue({ contractStart: date });
                                        form.validateFields(["contractStart", "contractEnd"]);
                                        setStartPickerMonth(date || campaignStartLimit);
                                    }}
                                    disabledDate={(current) => {
                                        if (!current) return false;
                                        return (
                                            (campaignStartLimit && current.isBefore(campaignStartLimit, "day")) ||
                                            (campaignEndLimit && current.isAfter(campaignEndLimit, "day"))
                                        );
                                    }}
                                    pickerValue={startPickerMonth} // <-- controls which month opens
                                    onPanelChange={(date) => setStartPickerMonth(date)} // update if user changes month manually
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </div>

                        {/* Contract End */}
                        <div>
                            <Form.Item
                                label={
                                    <span className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                                        Contract End Date <span className="text-red-500">*</span>
                                    </span>
                                }
                                name="contractEnd"
                                dependencies={["contractStart"]}
                                style={{ marginBottom: 2 }}
                                rules={[
                                    { required: true, message: "Select contract end date" },

                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const start = getFieldValue("contractStart");
                                            if (!value) return Promise.resolve();

                                            // Must be >= contractStart
                                            if (start && value.isBefore(start, "day")) {
                                                return Promise.reject("End date must be same or after start date");
                                            }

                                            // Must be within campaign bounds
                                            if (campaignStartLimit && value.isBefore(campaignStartLimit, "day")) {
                                                return Promise.reject(
                                                    `End date cannot be before campaign start (${campaignStartLimit.format("DD-MM-YYYY")})`
                                                );
                                            }

                                            if (campaignEndLimit && value.isAfter(campaignEndLimit, "day")) {
                                                return Promise.reject(
                                                    `End date cannot be after campaign end (${campaignEndLimit.format("DD-MM-YYYY")})`
                                                );
                                            }

                                            return Promise.resolve();
                                        }
                                    }),
                                ]}

                            >
                                <DatePicker
                                    placeholder="End Date"
                                    format="DD-MM-YYYY"
                                    size="large"
                                    value={form.getFieldValue("contractEnd")}
                                    onChange={(date) => {
                                        form.setFieldsValue({ contractEnd: date });
                                        form.validateFields(["contractEnd"]);
                                        setEndPickerMonth(date || campaignStartLimit);
                                    }}
                                    disabledDate={(current) => {
                                        if (!current) return false;
                                        const start = form.getFieldValue("contractStart");
                                        return (
                                            (start && current.isBefore(start.startOf("day"))) ||
                                            (campaignStartLimit && current.isBefore(campaignStartLimit.startOf("day"))) ||
                                            (campaignEndLimit && current.isAfter(campaignEndLimit.endOf("day")))
                                        );
                                    }}
                                    pickerValue={endPickerMonth} // <-- controls which month opens
                                    onPanelChange={(date) => setEndPickerMonth(date)}
                                    style={{ width: "100%" }}
                                />

                            </Form.Item>
                        </div>

                        {/* ROW 3: Platforms & Deliverables Section */}
                        <div className="md:col-span-2">
                            <Form.Item
                                label={
                                    <span className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                                        Platforms & Deliverables <span className="text-red-500">*</span>
                                    </span>
                                }
                                name="deliverables"
                                rules={[
                                    {
                                        validator: () =>
                                            selectedPlatforms.length > 0
                                                ? Promise.resolve()
                                                : Promise.reject("Select at least one platform"),
                                    },
                                ]}
                            >

                                {/* Custom UI for Platforms & Deliverables */}
                                {loadingPlatforms ? (
                                    <div className="text-center p-4">
                                        <Spin tip="Loading platforms..." />
                                    </div>
                                ) : (
                                    <div className="border border-gray-300 rounded-md p-4 space-y-2">
                                        {selectedPlatforms.length === 0 && (
                                            <p className="text-subtext-light dark:text-subtext-dark">
                                                No platforms selected. Use dropdown below to add.
                                            </p>
                                        )}

                                        {selectedPlatforms.map((platform, idx) => (
                                            <div key={platform.providerid} className="space-y-6 border-b border-gray-200 pb-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold text-text-light dark:text-text-dark">
                                                        {platform.providername}
                                                    </h3>
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


                                                <div className="flex items-center space-x-6 flex-wrap ps-4 mb-1">
                                                    {(contentTypesByPlatform[String(platform.providerid)] || []).map((ct) => {
                                                        const isChecked = platform.contenttypes?.some(
                                                            (d) => d.providercontenttypeid === ct.id
                                                        );

                                                        return (
                                                            <label
                                                                key={ct.id}
                                                                className="flex items-center space-x-2 text-sm text-subtext-light dark:text-subtext-dark "
                                                            >
                                                                <Checkbox
                                                                    checked={isChecked}
                                                                    onChange={(e) => {
                                                                        const updatedPlatforms = selectedPlatforms.map((p, i) => {
                                                                            if (i !== idx) return p;

                                                                            const contenttypes = e.target.checked
                                                                                ? [
                                                                                    ...(p.contenttypes || []),
                                                                                    {
                                                                                        providercontenttypeid: ct.id,
                                                                                        contenttypename: ct.contenttypename
                                                                                    }
                                                                                ]
                                                                                : (p.contenttypes || []).filter(
                                                                                    (d) => d.providercontenttypeid !== ct.id
                                                                                );

                                                                            return { ...p, contenttypes };
                                                                        });

                                                                        setSelectedPlatforms(updatedPlatforms);
                                                                    }}
                                                                />
                                                                <span className="ps-2">{ct.contenttypename}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                                {isPlatformInvalid(platform) && (
                                                    <p className="text-red-500 text-sm">
                                                        Select at least one content type for {platform.providername}
                                                    </p>
                                                )}

                                            </div>
                                        ))}

                                        <Select
                                            placeholder="Add Platform"
                                            size="large"
                                            value={null}
                                            onChange={(val) => {
                                                if (!selectedPlatforms.some((p) => p.providerid === val)) {
                                                    const p = platforms.find((p) => p.providerid === val);
                                                    if (p)
                                                        setSelectedPlatforms([...selectedPlatforms, { ...p, contenttypes: [] }]);
                                                }
                                                setSubmitAttempted(false);
                                            }}
                                            style={{ width: "100%" }}
                                            disabled={loadingPlatforms }
                                        >
                                            {platforms.map((p) => (
                                                <Select.Option key={p.providerid} value={p.providerid}>
                                                    {p.providername}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                )}
                            </Form.Item>
                        </div>

                        {/*  Product Link + Vendor Address (OR)  */}
                        <div className="md:col-span-2">

                            {/* One-line layout */}
                            <Form.Item
                                label="Product Link / Vendor Address"
                                name="productOrAddress"
                                dependencies={["productLink", "vendorAddress"]}
                                rules={[
                                    () => ({
                                        validator(_, __) {
                                            const link = form.getFieldValue("productLink");
                                            const address = form.getFieldValue("vendorAddress");

                                            if (link || address) {
                                                return Promise.resolve();
                                            }

                                            return Promise.reject(
                                                "Please fill Product Link OR Vendor Address"
                                            );
                                        },
                                    }),
                                ]}
                                style={{ marginBottom: 4 }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">

                                    {/* Product Link */}
                                    <Form.Item name="productLink" noStyle>
                                        <Input size="large" placeholder="Enter product link" />
                                    </Form.Item>

                                    {/* OR */}
                                    <div className="flex justify-center items-center text-sm font-semibold text-subtext-light">
                                        OR
                                    </div>

                                    {/* Vendor Address */}
                                    <Form.Item name="vendorAddress" noStyle>
                                        <Input size="large" placeholder="Enter vendor address" />
                                    </Form.Item>

                                </div>
                            </Form.Item>
                        </div>



                        {/* Notes (full width) */}
                        <div className="md:col-span-2">
                            <Form.Item
                                label={
                                    <span className="block text-sm font-medium text-text-light mb-1">
                                        Notes
                                    </span>
                                }
                                name="notes"
                            >
                                <TextArea
                                    rows={4}
                                    maxLength={250}
                                    showCount
                                    placeholder="e.g. #BrandName hashtag"
                                    className="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
                                />
                            </Form.Item>
                        </div>
                    </div>
                    {/* ---------- GRID END ---------- */}

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
