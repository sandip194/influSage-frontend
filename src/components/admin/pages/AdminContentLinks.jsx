import React, { useState } from "react";
import { Tabs } from "antd";
import NewContent from "../chunks/NewContent";
import UpdateAnalytics from "../chunks/UpdateAnalytics";
import AllContent from "../chunks/AllContent";
import AnalyticsFormModal from "../chunks/AnalyticsFormModal";
import AnalyticsHistoryModal from "../chunks/AnalyticsHistoryModal";
import api from "../../../api/axios";import { useSelector } from "react-redux";


const AdminContentLinks = () => {
    const { token } = useSelector((state) => state.auth);
    const [analyticsModal, setAnalyticsModal] = useState({ visible: false, data: null });
    const [historyModal, setHistoryModal] = useState({
        visible: false,
        data: [],
        page: 1,
        loading: false,
        item: null,
    });

    const openAnalyticsModal = (data) => setAnalyticsModal({ visible: true, data });
    const closeAnalyticsModal = () => setAnalyticsModal({ visible: false, data: null });



    const handleSaveAnalytics = (formData) => {
        console.log("Saved analytics:", formData);
        closeAnalyticsModal();
    };

    const handleViewHistory = async (item, page = 1) => {
        try {
            setHistoryModal(prev => ({ ...prev, loading: true }));

            const res = await api.get(
                `/admin/analytics/content-history/${item.contractcontentlinkid}`,
                {
                    params: { p_pagenumber: page, p_pagesize: 10 },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const records = res.data?.data?.records || [];

            setHistoryModal(prev => ({
                visible: true,
                item,
                page,
                loading: false,
                data: page === 1 ? records : [...prev.data, ...records],
            }));
        } catch (err) {
            console.error(err);
            setHistoryModal(prev => ({ ...prev, loading: false }));
        }
    };

    return (
        <div className="">

            <div className="my-3">
                <Tabs
                    defaultActiveKey="new"
                    type="card"
                    className="rounded-2xl p-4"
                    items={[
                        {
                            key: "new",
                            label: "New Content",
                            children: <NewContent onAddAnalytics={openAnalyticsModal} />,
                        },
                        {
                            key: "update",
                            label: "Update Analytics",
                            children: <UpdateAnalytics onUpdateAnalytics={openAnalyticsModal} />,
                        },
                        {
                            key: "all",
                            label: "All Content",
                            children: <AllContent onViewHistory={handleViewHistory} />,
                        },
                    ]}
                />
            </div>



            <AnalyticsFormModal
                visible={analyticsModal.visible}
                onClose={closeAnalyticsModal}
                onSave={handleSaveAnalytics}
                data={analyticsModal.data}
            />

            <AnalyticsHistoryModal
                visible={historyModal.visible}
                onClose={() =>
                    setHistoryModal({ visible: false, data: [], page: 1, loading: false, item: null })
                }
                history={historyModal.data}
                loading={historyModal.loading}
                onLoadMore={() =>
                    handleViewHistory(historyModal.item, historyModal.page + 1)
                }
            />
        </div>
    );
};

export default AdminContentLinks;
