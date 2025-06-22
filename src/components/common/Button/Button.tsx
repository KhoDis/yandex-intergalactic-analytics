import styles from "./Button.module.css";
import clsx from "clsx";
import React from "react";

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type: "submit" | "download" | "clear" | "disabled";
};

export const Button = ({ children, onClick, type }: ButtonProps) => {
  const typeClass = {
    submit: styles["button--submit"],
    download: styles["button--download"],
    clear: styles["button--clear"],
    disabled: styles["button--disabled"],
  };

  return (
    <button className={clsx(styles.button, typeClass[type])} onClick={onClick}>
      {children}
    </button>
  );
};
