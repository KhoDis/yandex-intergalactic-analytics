import { NavLink } from "react-router-dom";
import clsx from "clsx";
import styles from "./Header.module.css";
import React from "react";

type NavigationItemProps = {
  title: string;
  to: string;
  icon: React.ReactNode;
};

function NavigationItem({ title, to, icon }: NavigationItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => {
        return clsx(
          styles["menu-item"],
          isActive && styles["menu-item_active"],
        );
      }}
    >
      {icon}
      <span className={styles.navTitle}>{title}</span>
    </NavLink>
  );
}

export default NavigationItem;
