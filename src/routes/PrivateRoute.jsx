import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { logout } from "../features/auth/authSlice";

const PrivateRoute = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.auth);

  const cookieToken = Cookies.get("token");

  if (!cookieToken) {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  // Extra safety
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
