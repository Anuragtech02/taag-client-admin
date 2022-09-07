import { useState, createContext, useEffect } from "react";
import { decodeToken } from "react-jwt";
import { TAAG_TEAM_TOKEN } from "../constants/constants";

export const AuthContext = createContext({});

const AuthContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem(TAAG_TEAM_TOKEN);
    if (user) {
      console.log("Yes");
      setCurrentUser(decodeToken(user));
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, loading, setLoading }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
