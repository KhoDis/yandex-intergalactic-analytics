import styles from "./HistoryItemRow.module.css";
import { HistoryItemCard } from "./HistoryItemCard.tsx";

const RemoveButton = () => {
  return (
    <button className={styles["remove-button"]}>
      <img src="/trash-icon.svg" alt="remove" />
    </button>
  );
};

export const HistoryItemRow = () => {
  return (
    <div className={styles.row}>
      <HistoryItemCard />
      <RemoveButton />
    </div>
  );
};
