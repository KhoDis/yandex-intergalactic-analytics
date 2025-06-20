import styles from "./HighlightCard.module.css";

export type HighlightProps = {
  value: string;
  label: string;
};

export const HighlightCard = ({ value, label }: HighlightProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};
