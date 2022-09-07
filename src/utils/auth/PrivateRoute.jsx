import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { TAAG_TEAM_TOKEN } from "../constants/constants";
import { AuthContext } from "./AuthContext";

const PrivateRoute = ({ component: RouteComponent }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser && !localStorage.getItem(TAAG_TEAM_TOKEN)) {
    return <Navigate to="/login" />;
  }

  return <RouteComponent />;
};

export default PrivateRoute;
