import { useState, createContext, useEffect } from "react";
import { decodeToken, isExpired } from "react-jwt";
import { useNavigate } from "react-router-dom";
import { API_ALL } from "../API";
import { TAAG_ADMIN_TOKEN } from "../constants/constants";

export const AuthContext = createContext({});

const AuthContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem(TAAG_ADMIN_TOKEN);
    const isTokenExpired = isExpired(user);

    if (user && isTokenExpired) {
      localStorage.removeItem(TAAG_ADMIN_TOKEN);
      navigate("/login");
    }
    if (user && !isTokenExpired) {
      console.log("Yes");
      setCurrentUser(decodeToken(user));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchAllUsers() {
      const res = await API_ALL().get("/user/all");
      setUsers(res.data);
    }

    if (currentUser?.id) {
      fetchAllUsers();
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, loading, setLoading, users }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
