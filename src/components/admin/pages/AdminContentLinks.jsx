import React, { useState } from "react";
import { Tabs } from "antd";
import NewContent from "../chunks/NewContent";
import UpdateAnalytics from "../chunks/UpdateAnalytics";
import AllContent from "../chunks/AllContent";
import AnalyticsFormModal from "../chunks/AnalyticsFormModal";
import AnalyticsHistoryModal from "../chunks/AnalyticsHistoryModal";


const AdminContentLinks = () => {
    const [analyticsModal, setAnalyticsModal] = useState({ visible: false, data: null });
    const [historyModal, setHistoryModal] = useState({ visible: false, data: null });

    const openAnalyticsModal = (data) => setAnalyticsModal({ visible: true, data });
    const closeAnalyticsModal = () => setAnalyticsModal({ visible: false, data: null });

    const openHistoryModal = (history) => setHistoryModal({ visible: true, data: history });
    const closeHistoryModal = () => setHistoryModal({ visible: false, data: null });

    const handleSaveAnalytics = (formData) => {
        console.log("Saved analytics:", formData);
        closeAnalyticsModal();
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
                            children: <AllContent onViewHistory={openHistoryModal} />,
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
                onClose={closeHistoryModal}
                history={historyModal.data}
            />
        </div>
    );
};

export default AdminContentLinks;
