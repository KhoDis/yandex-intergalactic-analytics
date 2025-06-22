import styles from "./HistoryItemRow.module.css";
import { HistoryItemCard } from "./HistoryItemCard.tsx";
import type { HistoryEntry } from "../../stores/useHistoryStore.ts";

type RemoveButtonProps = {
  onRemove: () => void;
};

const RemoveButton = ({ onRemove }: RemoveButtonProps) => {
  return (
    <button className={styles["remove-button"]} onClick={onRemove}>
      <img src="/trash-icon.svg" alt="remove" />
    </button>
  );
};

export type HistoryItemRowProps = {
  item: HistoryEntry;
  onCardClick: () => void;
  onRemove: () => void;
};

export const HistoryItemRow = ({
  item,
  onCardClick,
  onRemove,
}: HistoryItemRowProps) => {
  return (
    <div className={styles.row}>
      <HistoryItemCard item={item} onClick={onCardClick} />
      <RemoveButton onRemove={onRemove} />
    </div>
  );
};
