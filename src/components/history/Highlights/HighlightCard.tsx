import styles from "./HighlightCard.module.css";
import clsx from "clsx";

export type HighlightCardProps = {
  value: string;
  label: string;
};

export const HighlightCard = ({
  value,
  label,
  className,
}: HighlightCardProps & { className?: string }) => {
  return (
    <div className={clsx(styles.card, className)} data-testid="highlight-card">
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};
