import styles from "./Button.module.scss";

const Button = ({
  children,
  leftIcon,
  rightIcon,
  type,
  onClick,
  ...reamaining
}) => {
  return (
    <button
      type={type ? type : "button"}
      className={styles.btn}
      onClick={onClick}
      {...reamaining}
    >
      <span>
        {leftIcon}
        <span>{children}</span>
        {rightIcon}
      </span>
    </button>
  );
};

export default Button;
