import { Navigate, Outlet } from "react-router-dom";
import Cookie from "js-cookie";

const ProtectedRoute = () => {
  const jwtToken = Cookie.get("jwt_token");

  if (jwtToken === undefined) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
