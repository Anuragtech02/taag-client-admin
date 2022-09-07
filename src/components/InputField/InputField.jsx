import clsx from "clsx";
import { useEffect } from "react";
import styles from "./InputField.module.scss";
import { icons } from "../../assets";
import { forwardRef } from "react";

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
          type={type}
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
