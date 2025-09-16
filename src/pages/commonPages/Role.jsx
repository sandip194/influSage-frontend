import React, {
  useEffect,
  useState,
  useCallback,
  Suspense,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../../assets/role.css";

// ✅ Lazy load heavy side image component
const SideImageSlider = React.lazy(() =>
  import("../../components/common/SideImageSlider")
);

const Role = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showError, setShowError] = useState(false);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch roles from API
  useEffect(() => {
    let isMounted = true;
    const fetchRoles = async () => {
      try {
        const res = await axios.get("/roles");
        if (isMounted) {
          setRoles(res.data?.roles || []);
        }
      } catch (error) {
        console.error("Failed to fetch roles", error);
      }
    };

    fetchRoles();
    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ Stable handler
  const handleContinue = useCallback(() => {
    if (selectedRole) {
      localStorage.setItem("selectedRole", selectedRole);
      navigate("/signup");
    } else {
      setShowError(true);
    }
  }, [selectedRole, navigate]);

  return (
    <div className="login-container">
      <Suspense fallback={<div className="loader">Loading...</div>}>
        <SideImageSlider />
      </Suspense>

      <div className="relative z-20 login-card h-90vh">
        
        <div className="login-right">

          <div className="form-box">
            <div className="mb-2 ">
          <img src="/public/influSage-logo.png" alt="Logo" className="h-8 w-auto" />
        </div>
            <h2>Select Your Role</h2>
            <p>Select your role based on your requirements</p>

            <div className="role-options">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`role-box flex-col items-center justify-items-center ${Number(selectedRole) === role.id ? "selected" : ""
                    }`}
                  onClick={() => {
                    setSelectedRole(role.id);
                    setShowError(false); // Hide error on new selection
                  }}
                >
                  <img
                    src={role.iconpath}
                    alt={role.name}
                    className="bg-gray-100 rounded-full w-80"
                  />
                  <p>{role.name}</p>
                </div>
              ))}
            </div>

            {showError && (
              <p className="error-text">Please select a role</p>
            )}

            <button onClick={handleContinue} className="login-btn">
              Continue
            </button>

            <p className="signup-link" style={{ marginTop: "20px" }}>
              Back to{" "}
              <span
                onClick={() => navigate("/login")}
                style={{ fontWeight: "bold", cursor: "pointer" }}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Role };
