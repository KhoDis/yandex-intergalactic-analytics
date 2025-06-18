import styles from "./Header.module.css";
import LogoName from "./LogoName.tsx";
import Navigation from "./Navigation.tsx";

function Header() {
  return (
    <header className={styles.header}>
      <LogoName />
      <Navigation />
    </header>
  );
}

export default Header;
