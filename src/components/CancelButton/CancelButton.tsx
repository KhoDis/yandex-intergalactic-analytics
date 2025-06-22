import styles from "../CancelButton/CancelButton.module.css";
import clsx from "clsx";

export type CancelButtonProps = {
  onClick: () => void;
};

export const CancelButton = ({
  onClick,
  className,
}: CancelButtonProps & { className?: string }) => (
  <button
    className={clsx(styles["cancel-button"], className)}
    onClick={onClick}
  >
    <img src="/cancel-icon.svg" alt="close" />
  </button>
);
