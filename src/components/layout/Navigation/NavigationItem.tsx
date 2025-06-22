import { NavLink } from "react-router-dom";
import clsx from "clsx";
import styles from "./Navigation.module.css";
import React from "react";

type NavigationItemProps = {
  title: string;
  to: string;
  icon: React.ReactNode;
};

export const NavigationItem = ({ title, to, icon }: NavigationItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) => {
      return clsx(styles["menu-item"], isActive && styles["menu-item_active"]);
    }}
  >
    {icon}
    <span className={styles.navTitle}>{title}</span>
  </NavLink>
);
