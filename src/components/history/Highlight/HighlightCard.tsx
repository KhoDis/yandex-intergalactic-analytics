import styles from "./HighlightCard.module.css";
import clsx from "clsx";

export type HighlightProps = {
  value: string;
  label: string;
};

export const HighlightCard = ({
  value,
  label,
  className,
}: HighlightProps & { className?: string }) => {
  return (
    <div className={clsx(styles.card, className)}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};
