import React, { useEffect, useState } from "react";
import axios from "axios";
import FilePreview from "../../../common/FilePreview";

const ApplicationTab = ({ campaignId, token }) => {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        if (!campaignId || !token) return;

        try {
            setLoading(true);
            const res = await axios.get(`user/signle-applied/${campaignId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = res.data?.data;
            if (!data) return;

            setApplication(data);
        } catch (err) {
            console.error("Failed to load application:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [campaignId, token]);

    if (loading) {
        return (
            <div className="p-6 bg-gray-100 rounded-lg text-center text-gray-700">
                Loading application details...
            </div>
        );
    }

    if (!application) {
        return (
            <div className="p-6 bg-gray-100 rounded-lg text-center text-gray-700">
                No application data available.
            </div>
        );
    }

    const { budget, description, filepaths } = application;

    return (
        <div className="p-4 ">
            <h2 className="text-2xl font-bold mb-6 text-[#0D132D]">
                Application Details
            </h2>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Left side: Description + Budget */}
                <div className="flex-1 flex flex-col gap-4">
                    {/* Description */}
                    <div className="p-4 bg-gray-50 rounded-2xl ">
                        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-700">{description || "No description provided"}</p>
                    </div>

                    {/* Budget */}
                    <div className="p-4 bg-gray-50 rounded-2xl ">
                        <h3 className="font-semibold text-gray-900 mb-2">Budget</h3>
                        <p className="text-[#0D132D] font-bold text-xl">
                            {budget ? `₹${budget}` : "Not set"}
                        </p>
                    </div>
                </div>

                {/* Right side: File Previews */}
                <div className="flex-1 p-4 bg-gray-50 rounded-2xl ">
                    <h3 className="font-semibold text-gray-900 mb-4">Files</h3>
                    {filepaths?.length > 0 ? (
                        <FilePreview files={filepaths} onRemove={null} />
                    ) : (
                        <p className="text-gray-700">No files uploaded.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationTab;
