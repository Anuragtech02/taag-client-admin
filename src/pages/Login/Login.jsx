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
  const [error, setError] = useState("");

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

  useEffect(() => {
    console.log(values);
  });

  const { setCurrentUser, setLoading: setGlobalLoading } =
    useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
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
      }
    } catch (error) {
      // console.log("True error", error.response);
      // setError(error.toString());
      setGlobalLoading(false);
      showAlert("error", "Error: " + error.response.data.message);
      setLoading(false);
    }
  }

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
          style={{ marginTop: "2rem", color: "white" }}
        >
          New user? Register
        </p>
        {!loading && error && <span className={styles.error}>{error}</span>}
        {!error && loading && <LinearProgress className={styles.loading} />}
      </form>
    </div>
  );
};

export default Login;
