import React from "react";
import { useLocation } from "react-router-dom";
import Maintenance from "../pages/commonPages/Maintenance";
import useMaintenance from "./useMaintenance";

const MaintenanceGuard = ({ children }) => {
  const { maintenance, loading } = useMaintenance();
  const location = useLocation(); // 👈 listens to route changes

  if (loading) return null;

  if (maintenance && location.pathname !== "/") {
    return <Maintenance />;
  }

  return <>{children}</>;
};

export default MaintenanceGuard;
