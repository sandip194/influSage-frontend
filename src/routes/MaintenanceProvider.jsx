import { useEffect, useState } from "react";
import axios from "axios";
import MaintenanceContext from "./MaintenanceContext";

const MaintenanceProvider = ({ children }) => {
    const [maintenance, setMaintenance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await axios.get("app-status"); // your backend
                setMaintenance(res.data.maintenance);
            } catch (err) {
                console.error("Failed to fetch app status:", err);
                setMaintenance(false);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();

    }, []);

    return (
        <MaintenanceContext.Provider value={{ maintenance, loading }}>
            {children}
        </MaintenanceContext.Provider>
    );
};

export default MaintenanceProvider;
