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
import { API_ALL } from "../../utils/API";

const Register = () => {
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

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API_ALL().post(`/user/create/`, {
        ...values,
        userType: "team",
      });
      console.log({ res });
      showAlert("success", "You have successfully registered");
      setValues({});
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.log(error);
      showAlert("error", "Error: " + error);
    }
  }

  return (
    <div className={styles.container}>
      <Logo withText />
      <form onSubmit={handleSubmit}>
        <InputField
          id="name"
          label="Name"
          required
          value={values?.name}
          onChange={handleChange}
          type="text"
          disabled={loading}
        />
        <InputField
          id="email"
          label="Email"
          required
          value={values?.email}
          onChange={handleChange}
          type="text"
          disabled={loading}
        />
        <InputField
          id="contact"
          label="Contact"
          required
          value={values?.contact}
          onChange={handleChange}
          type="text"
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
            Register
          </Button>
          <p onClick={() => navigate("/login")}>Already Have an Account?</p>
        </div>
        {!loading && error && <span className={styles.error}>{error}</span>}
        {!error && loading && <LinearProgress className={styles.loading} />}
      </form>
    </div>
  );
};

export default Register;
