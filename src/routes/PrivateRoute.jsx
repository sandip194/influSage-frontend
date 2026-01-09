import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { logout } from "../features/auth/authSlice";

const PrivateRoute = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);

  const token = Cookies.get("token");
  const tokenExpiry = Cookies.get("tokenExpiry");

  // ❌ No token or expired token
  if (!token || !tokenExpiry || Date.now() > Number(tokenExpiry)) {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  // ❌ Role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
