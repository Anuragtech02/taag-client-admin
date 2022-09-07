import styles from "./RadioButton.module.scss";

const RadioButton = ({ name, label, value, onChange, ...remaining }) => {
  const randomId = Date.now() * (3 * Math.random() - 2 * Math.random()) * 1000;

  return (
    <label htmlFor={randomId} className={styles.container}>
      <input
        {...remaining}
        id={randomId}
        onChange={onChange}
        type="radio"
        name={name}
        value={value}
      />
      <div>
        <label htmlFor={randomId}>{label}</label>
        <div className={styles.background}></div>
      </div>
    </label>
  );
};

export default RadioButton;
