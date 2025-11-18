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
} from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { useSelector } from "react-redux";

const { TextArea } = Input;

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
            title="Create New Contract"
            open={isOpen}
            onCancel={handleModalClose}
            footer={null}
            destroyOnClose
            width={850}
            bodyStyle={{ padding: "24px" }}
            maskClosable={false}
        >
            {submitError && <Alert message={submitError} type="error" showIcon style={{ marginBottom: 16 }} />}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                validateTrigger="onSubmit"  // Errors only on submit
            >
                <Row gutter={16}>
                    {/* Influencers (now API-fetched) */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Select Influencers"
                            name="influencers"
                            rules={[{ required: true, message: "Please select influencers" }]}
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
                            >
                                {influencers.map((inf) => (
                                    <Select.Option key={inf.id} value={inf.id}>
                                        {inf.name} ({inf.platform})
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    {/* Campaign Start */}
                    <Col xs={24} md={6}>
                        <Form.Item
                            label="Campaign Start Date"
                            name="campaignStart"
                            rules={[{ required: true, message: "Select campaign start date" }]}
                        >
                            <DatePicker
                                placeholder="Start Date"
                                format="DD-MM-YYYY"
                                size="large"
                                style={{ width: "100%" }}
                                disabledDate={(current) => current && current < dayjs().startOf("day")}
                            />
                        </Form.Item>
                    </Col>

                    {/* Campaign End */}
                    <Col xs={24} md={6}>
                        <Form.Item
                            label="Campaign End Date"
                            name="campaignEnd"
                            dependencies={["campaignStart"]}
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
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {/* Platforms & Deliverables */}
                    <Col xs={24} md={24}>
                        <Form.Item label="Platforms & Deliverables" required>
                            {loadingPlatforms ? (
                                <div style={{ textAlign: "center", padding: "20px" }}>
                                    <Spin tip="Loading platforms..." />
                                </div>
                            ) : (
                                <>
                                    {selectedPlatforms.length === 0 && (
                                        <p style={{ color: "#999", marginBottom: 12 }}>
                                            No platforms selected. Use dropdown below to add.
                                        </p>
                                    )}

                                    {selectedPlatforms.map((platform, idx) => (
                                        <div
                                            key={platform.providerid}
                                            style={{
                                                marginBottom: 10,
                                                border: "1px solid #ddd",
                                                padding: 10,
                                                borderRadius: 6,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    marginBottom: 12,
                                                }}
                                            >
                                                <strong style={{ fontSize: 16 }}>{platform.providername}</strong>
                                                <Button
                                                    type="link"
                                                    danger
                                                    aria-label={`Remove ${platform.providername} platform`}
                                                    onClick={() =>
                                                        setSelectedPlatforms(
                                                            selectedPlatforms.filter((_, i) => i !== idx)
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            </div>

                                            <Row gutter={[12, 12]}>
                                                {(contentTypesByPlatform[String(platform.providerid)] || []).map(
                                                    (ct) => {
                                                        const isChecked = platform.contentTypes.some(
                                                            (d) => d.id === ct.id
                                                        );

                                                        return (
                                                            <Col
                                                                xs={24}
                                                                sm={12}
                                                                md={8}
                                                                lg={6}
                                                                key={ct.id}
                                                                style={{ display: "flex", alignItems: "center" }}
                                                            >
                                                                <Checkbox
                                                                    checked={isChecked}
                                                                    onChange={(e) => {
                                                                        const updatedPlatforms = selectedPlatforms.map(
                                                                            (p, i) => {
                                                                                if (i !== idx) return p;
                                                                                const contentTypes = e.target.checked
                                                                                    ? [...p.contentTypes, { ...ct, count: 1 }]
                                                                                    : p.contentTypes.filter((d) => d.id !== ct.id);
                                                                                return { ...p, contentTypes };
                                                                            }
                                                                        );
                                                                        setSelectedPlatforms(updatedPlatforms);
                                                                    }}
                                                                    style={{ flex: 1 }}
                                                                >
                                                                    {ct.contenttypename}
                                                                </Checkbox>

                                                                {isChecked && (
                                                                    <InputNumber
                                                                        min={1}
                                                                        size="small"
                                                                        style={{ width: 70, marginLeft: 8 }}
                                                                        value={
                                                                            platform.contentTypes.find((d) => d.id === ct.id)
                                                                                ?.count
                                                                        }
                                                                        onChange={(value) => {
                                                                            const updatedPlatforms = selectedPlatforms.map(
                                                                                (p, i) => {
                                                                                    if (i !== idx) return p;
                                                                                    const contentTypes = p.contentTypes.map((d) =>
                                                                                        d.id === ct.id ? { ...d, count: value } : d
                                                                                    );
                                                                                    return { ...p, contentTypes };
                                                                                }
                                                                            );
                                                                            setSelectedPlatforms(updatedPlatforms);
                                                                        }}
                                                                    />
                                                                )}
                                                            </Col>
                                                        );
                                                    }
                                                )}
                                            </Row>
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
                                    >
                                        {platforms.map((p) => (
                                            <Select.Option key={p.providerid} value={p.providerid}>
                                                {p.providername}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </>
                            )}

                            {/* Updated: Hidden input with stricter validation */}
                            <Form.Item
                                name="deliverables"
                                rules={[
                                    {
                                        validator: () =>
                                            selectedPlatforms.some(p => p.contentTypes && p.contentTypes.length > 0)
                                                ? Promise.resolve()
                                                : Promise.reject("Select at least one platform with content"),
                                    },
                                ]}
                                hidden
                            >
                                <Input value={JSON.stringify(selectedPlatforms)} />
                            </Form.Item>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {/* Product Link */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Product Link"
                            name="productLink"
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
                            <Input size="large" placeholder="Enter product link" />
                        </Form.Item>
                    </Col>

                    {/* Vendor Address */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Vendor Address"
                            name="vendorAddress"
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
                            <Input size="large" placeholder="Enter vendor address" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {/* Payment */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Payment Amount (₹)"
                            name="payment"
                            rules={[{ required: true, message: "Enter payment amount" }]}
                        >
                            <InputNumber
                                size="large"
                                style={{ width: "100%" }}
                                formatter={(value) =>
                                    value ? `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
                                }
                                parser={(value) => value.replace(/\₹\s?|(,*)/g, "")}
                                min={0}
                                placeholder="0"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Notes */}
                <Form.Item label="Notes" name="notes">
                    <TextArea
                        rows={4}
                        maxLength={200}
                        showCount
                        placeholder="e.g. #BrandName hashtag"
                    />
                </Form.Item>

                {/* Updated: Button enabled based on silent validation */}
                <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    block
                    disabled={submitLoading}
                    loading={submitLoading}
                >
                    Create Contract
                </Button>
            </Form>
        </Modal>
    );
}
