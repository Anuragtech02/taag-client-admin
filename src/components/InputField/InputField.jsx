import clsx from "clsx";
import { useEffect, useState } from "react";
import styles from "./InputField.module.scss";
import { icons } from "../../assets";
import { forwardRef } from "react";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const { searchIcon } = icons;

const InputField = forwardRef((props, ref) => {
  const {
    id,
    type,
    label,
    placeholder,
    variant,
    value,
    onChange,
    children,
    ...remaining
  } = { ...props };

  const [togglePassword, setTogglePassword] = useState(false);

  function handleTogglePassword() {
    setTogglePassword((prev) => !prev);
  }

  if (type === "search") return <Search searchProps={props} ref={ref} />;

  return (
    <div
      style={variant !== "large" ? {} : { width: "650px" }}
      className={styles.container}
    >
      {children}
      {variant !== "large" ? (
        <input
          {...remaining}
          id={id}
          type={
            type === "password" ? (togglePassword ? "text" : "password") : type
          }
          value={value || ""}
          placeholder={placeholder}
          onChange={onChange}
        />
      ) : (
        <textarea
          {...remaining}
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          rows={10}
          onChange={onChange}
        ></textarea>
      )}
      <label htmlFor="">{label}</label>
      {type === "password" && (
        <IconButton
          className={styles.showHidePassword}
          onClick={handleTogglePassword}
        >
          {!togglePassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      )}
    </div>
  );
});

const Search = forwardRef(({ searchProps }, ref) => {
  const { id, type, placeholder, value, onChange, children, ...remaining } = {
    ...searchProps,
  };
  useEffect(() => {
    console.log(remaining);
  });
  return (
    <div className={clsx(styles.container, styles.search)}>
      {children}

      <input
        id={id}
        ref={ref}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        {...remaining}
      />

      <img src={searchIcon} alt="Search" />
      <div className={styles.autofill}></div>
    </div>
  );
});

export default InputField;
