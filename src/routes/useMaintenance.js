import { useContext } from "react";
import MaintenanceContext from "./MaintenanceContext";

const useMaintenance = () => {
  return useContext(MaintenanceContext);
};

export default useMaintenance;
