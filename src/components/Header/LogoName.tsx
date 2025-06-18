import styles from "./Header.module.css";

function LogoName() {
  return (
    <div className={styles.logoName}>
      <img src="/Logo%20SS.svg" alt="logo" className={styles.logo} />
      <h1 className={styles.name}>МЕЖГАЛАКТИЧЕСКАЯ АНАЛИТИКА</h1>
    </div>
  );
}

export default LogoName;
