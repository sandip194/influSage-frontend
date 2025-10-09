import React, { Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/role.css'; // Reuse the same CSS
import SideImageSlider from '../../components/common/SideImageSlider';
import axios from 'axios';



const RoleDefault = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showError, setShowError] = useState(false)
  const [roles, setRoles] = useState([])

  const navigate = useNavigate();

  const fatchRoles = async () => {
    try {
      const res = await axios.get("roles")
      setRoles(res.data?.roles)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fatchRoles();
  }, [])

  //   const handleContinue = () => {
  //      if (selectedRole) {
  //       localStorage.setItem("selectedRole", selectedRole);
  //     // sessionStorage.setItem("selectedRole", selectedRole);
  //     //   window.location.href = `http://localhost:3001/auth/google?roleid=${selectedRole}`;
  //     navigate("/setPassword");
  //     } else {
  //       setShowError(true);
  //     }
  // };

  const handleContinue = () => {
    if (!selectedRole) {
      setShowError(true);
      return;
    }

    const params = new URLSearchParams(location.search);
    const email = params.get("email");
    const firstName = params.get("firstName");
    const lastName = params.get("lastName");

    navigate(
      `/setPassword?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&roleId=${selectedRole}`
    );
  };


  return (
    <div className="login-container">
      <Suspense fallback={<div className="loader">Loading...</div>}>
        <SideImageSlider />
      </Suspense>
      <div className="relative z-20 login-card h-90vh">
        <div className="login-right">
          <div className="form-box">
            <div className="mb-2 ">
              <img src="/influSage-logo.png" alt="Logo" className="h-8 w-auto" />
            </div>
            <h2>Select Your Role</h2>
            <p>Select your role based on your requirements</p>

            <div className="role-options">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`role-box flex-col items-center justify-items-center ${selectedRole === role.id ? 'selected' : ''}`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <img src={role.iconpath} alt={role.name} className="bg-gray-100 rounded-full w-80" />
                  <p>{role.name}</p>
                </div>
              ))}
            </div>
            {showError && <p className="error-text">Please select a role</p>}
            <button onClick={handleContinue} className="login-btn">Continue</button>

            {/* <p className="signup-link" style={{ marginTop: '20px' }}>
            Back to <span onClick={() => navigate('/login')} style={{ fontWeight: 'bold', cursor: 'pointer' }}>Login</span>
          </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export { RoleDefault };
