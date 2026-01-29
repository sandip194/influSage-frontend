import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { logout } from "../features/auth/authSlice";
import { decodeToken } from "../app/decodeToken";

const PrivateRoute = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  

  const token = Cookies.get("token");

  if (!token) {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  const decoded = decodeToken(token);

  // console.log(decoded)
  // ❌ Invalid or expired token
  if (!decoded || decoded.exp * 1000 < Date.now()) {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  // ❌ Role not allowed
  if (allowedRoles && !allowedRoles.includes(decoded.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
