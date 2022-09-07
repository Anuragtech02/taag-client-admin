import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { TAAG_ADMIN_TOKEN } from "../constants/constants";
import { AuthContext } from "./AuthContext";

const PrivateRoute = ({ component: RouteComponent }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser && !localStorage.getItem(TAAG_ADMIN_TOKEN)) {
    return <Navigate to="/login" />;
  }

  return <RouteComponent />;
};

export default PrivateRoute;
