import { RiCheckLine, RiExchange2Line, RiLoader4Line, RiStackLine } from '@remixicon/react';




const CampaignStats = () => {
    const stats =
        [
            { label: "Active Campaign", value: 2765, icon: <RiStackLine /> },
            { label: "Pending Campaign", value: 2765, icon: <RiExchange2Line /> },
            { label: "Completed Campaign", value: 2765, icon: <RiCheckLine /> },
        ]


    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map(({ label, value, icon }, idx) => (
                <div
                    key={idx}
                    className="bg-white p-6 rounded-2xl flex-row items-center space-x-4"
                >
                    {/* Circle icon */}
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0D132D] text-white text-lg mb-3">
                        {icon}
                    </div>

                    {/* Label and Value */}
                    <div>
                        <p className="text-md text-[#0D132D]">{label}</p>
                        <p className="text-xl font-bold text-[]">{value.toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CampaignStats;
