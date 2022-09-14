import { useState, useContext, useEffect } from "react";
import { Button, InputField, Navbar } from "../../components";
import styles from "../Login/Login.module.scss";
import { decodeToken } from "react-jwt";
import axios from "axios";
import { AuthContext } from "../../utils/auth/AuthContext";
import { useNavigate, useParams } from "react-router";
import { LinearProgress } from "@mui/material";
import Logo from "../../components/Logo/Logo";
import { showAlert } from "../../utils";
import { API_AUTH } from "../../utils/API";

const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isValidURI, setIsValidURI] = useState(false);
  const [user, setUser] = useState(null);

  const { token } = useParams();

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
    async function confirmToken() {
      // console.log({ uri: window.location.href, id });
      try {
        const res = await API_AUTH().get(`/verify-reset-token/`, {
          params: {
            uri: window.location.href,
            token,
          },
        });
        if (res.status === 200) {
          setIsValidURI(true);
        } else {
          return showAlert("error", "Invalid Reset Link");
        }
      } catch (error) {
        showAlert("error", error.message);
      }
    }
    if (token) {
      let tempUser = decodeToken(token);
      setUser(tempUser);
      confirmToken();
    }
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (token && user?.userId && isValidURI) {
      if (values.confirmPassword !== values.newPassword) {
        setLoading(false);
        return showAlert("error", "Passwords do not match");
      }
      try {
        const res = await API_AUTH().post(`/reset-password/`, {
          email: user.email,
          newPassword: values.newPassword,
          userType: "admin",
        });
        setLoading(false);
        showAlert("success", res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } catch (error) {
        setLoading(false);
        return showAlert("error", error.message);
      }
    }

    if (!token && !user?.userId && !isValidURI) {
      try {
        const response = await API_AUTH().post(`/request-password-reset/`, {
          email: values?.email,
          userType: "admin",
        });

        if (response.status === 200) {
          showAlert("success", "Reset Link sent on your email");
          setLoading(false);
          // navigate("/");
        } else {
        }
      } catch (error) {
        // console.log("True error", error.response);
        setError(error.response.data.message);
        setLoading(false);
      }
    }
  }

  return (
    <div className={styles.container}>
      <Logo withText />
      <form onSubmit={handleSubmit}>
        {!isValidURI && (
          <InputField
            id="email"
            label="Email"
            required
            value={values?.email}
            onChange={handleChange}
            type="email"
            disabled={loading}
          />
        )}

        {isValidURI && (
          <InputField
            id="newPassword"
            label="New Password"
            required
            value={values?.newPassword}
            onChange={handleChange}
            type="password"
            disabled={loading}
          />
        )}
        {isValidURI && (
          <InputField
            id="confirmPassword"
            label="Confirm Password"
            required
            value={values?.confirmPassword}
            onChange={handleChange}
            type="password"
            disabled={loading}
          />
        )}
        <div className={styles.buttons}>
          <Button title="Submit" type="submit" disabled={loading}>
            {token && user?.userId ? "Submit" : "Send Link"}
          </Button>
        </div>
        {!loading && error && <span className={styles.error}>{error}</span>}
        {!error && loading && <LinearProgress className={styles.loading} />}
      </form>
    </div>
  );
};

export default Login;
