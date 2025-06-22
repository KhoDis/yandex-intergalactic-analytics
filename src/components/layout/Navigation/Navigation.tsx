import styles from "../Header/Header.module.css";
import { NavigationItem } from "./NavigationItem.tsx";

export const Navigation = () => (
  <nav className={styles.menu}>
    <NavigationItem
      title="CSV Аналитик"
      to="/"
      icon={<img src="/upload-icon.svg" alt="home" />}
    />
    <NavigationItem
      title="CSV Генератор"
      to="/generate"
      icon={<img src="/generate-icon.svg" alt="generate" />}
    />
    <NavigationItem
      title="История"
      to="/history"
      icon={<img src="/history-icon.svg" alt="history" />}
    />
  </nav>
);
