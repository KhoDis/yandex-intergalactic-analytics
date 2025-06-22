import styles from "./History.module.css";
import { HistoryItemRow } from "../../components/HistoryItemRow/HistoryItemRow.tsx";
import type { HistoryEntry } from "../../stores/useHistoryStore.ts";
import type { RawHighlight } from "../../types/types.tsx";

export type HistoryProps = {
  history: HistoryEntry[];
  onItemClick: (highlight: RawHighlight) => void;
  onItemRemove: (id: string) => void;
};

export const History = ({
  history,
  onItemClick,
  onItemRemove,
}: HistoryProps) => {
  if (history.length === 0) {
    return (
      <div className={styles.empty}>
        <p>История загрузок пуста</p>
      </div>
    );
  }

  return (
    <div className={styles.history}>
      {history.map((item) => (
        <HistoryItemRow
          key={item.id}
          item={item}
          onCardClick={() => onItemClick(item.highlight)}
          onRemove={() => onItemRemove(item.id)}
        />
      ))}
    </div>
  );
};
