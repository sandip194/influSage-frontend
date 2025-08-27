import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/role.css'; // Reuse the same CSS
import influencerIcon from '../../assets/icons/influencer.png';
import vendorIcon from '../../assets/icons/vendor.png';
import agencyIcon from '../../assets/icons/agancy.png';

const roles = [
  { id: 1, label: 'Influencer', icon: influencerIcon },
  { id: 2, label: 'Vendor', icon: vendorIcon },
  { id: 3, label: 'Agency', icon: agencyIcon }
];

const Role = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showError, setShowError] = useState(false)

  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole) {
      localStorage.setItem('selectedRole', selectedRole);
      navigate('/signup');
    } else {
      setShowError(true);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card h-90vh">
        <div className="login-card-left">
          <div className="branding">
            <h2>InfluSage</h2>
            <p>Built for Creators.<br />Backed by Brands.</p>
          </div>
        </div>

      <div className="login-right">
        <div className="form-box">
          <h2>Select Your Role</h2>
          <p>Select your role based on your requirements</p>

          <div className="role-options">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`role-box flex-col items-center justify-items-center ${selectedRole === role.id ? 'selected' : ''}`}
                onClick={() => setSelectedRole(role.id)}
              >
                  <img src={role.icon} alt={role.label} className="role-icon bg-gray-100 rounded-full" width="100px" />
                <p>{role.label}</p>
              </div>
            ))}
          </div>
          {showError && <p className="error-text">Please select a role</p>}
          <button onClick={handleContinue} className="login-btn">Continue</button>

          <p className="signup-link" style={{ marginTop: '20px' }}>
            Back to <span onClick={() => navigate('/login')} style={{ fontWeight: 'bold', cursor: 'pointer' }}>Login</span>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export { Role };
