import { useState, useContext, useEffect } from "react";
import { Button, InputField, Navbar } from "../../components";
import styles from "./Login.module.scss";
import { decodeToken } from "react-jwt";
import axios from "axios";
import { AuthContext } from "../../utils/auth/AuthContext";
import { useNavigate } from "react-router";
import logo from "../../assets/icons/logo.svg";
import { LinearProgress } from "@mui/material";
import Logo from "../../components/Logo/Logo";
import { showAlert } from "../../utils";
import { API_AUTH } from "../../utils/API";
import { TAAG_ADMIN_TOKEN } from "../../utils/constants/constants";

const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { id, value, name } = e.target;
    // console.log(id, value, name);
    setValues((prev) => {
      return {
        ...prev,
        [name ? name : id]: value,
      };
    });
  }

  const {
    currentUser,
    setCurrentUser,
    setLoading: setGlobalLoading,
  } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const tld = values.email.split("@")[1];
      if (tld !== "taag.one") {
        setLoading(false);
        return showAlert("error", "Not a valid @taag mail address");
      }

      const response = await API_AUTH().post(`/login/`, {
        email: values?.email,
        password: values?.password,
        userType: "admin",
      });

      if (response.status === 200) {
        let decoded = decodeToken(response.data.token);
        setCurrentUser({
          ...decoded,
        });
        localStorage.setItem(TAAG_ADMIN_TOKEN, response.data.token);
        setLoading(false);
        setGlobalLoading(false);
        navigate("/");
      } else {
        setLoading(false);
        return showAlert("error", "Something went wrong");
      }
    } catch (error) {
      // console.log("True error", error.response);
      setGlobalLoading(false);
      showAlert("error", "Error: " + error.response.data.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    // Check if user is logged in
    if (localStorage.getItem(TAAG_ADMIN_TOKEN) && currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  return (
    <div className={styles.container}>
      <Logo withText />
      <form onSubmit={handleSubmit}>
        <InputField
          id="email"
          label="Email"
          required
          value={values?.email}
          onChange={handleChange}
          type="email"
          disabled={loading}
        />
        <InputField
          id="password"
          label="Password"
          required
          value={values?.password}
          onChange={handleChange}
          type="password"
          disabled={loading}
        />
        <div className={styles.buttons}>
          <Button title="Submit" type="submit" disabled={loading}>
            Login
          </Button>
          <p onClick={() => navigate("/reset-password")}>Forgot Password</p>
        </div>
        <p
          onClick={() => navigate("/register")}
          style={{ marginTop: "2rem", color: "white", cursor: "pointer" }}
        >
          New user? Register
        </p>
        {loading && <LinearProgress className={styles.loading} />}
      </form>
    </div>
  );
};

export default Login;
