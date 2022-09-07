import { useState, createContext, useEffect } from "react";
import { decodeToken } from "react-jwt";
import { API_ALL } from "../API";
import { TAAG_ADMIN_TOKEN } from "../constants/constants";

export const AuthContext = createContext({});

const AuthContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem(TAAG_ADMIN_TOKEN);
    if (user) {
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
