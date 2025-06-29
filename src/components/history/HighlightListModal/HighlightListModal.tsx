import styles from "./HighlightListModal.module.css";
import { HighlightCard } from "../Highlights/HighlightCard.tsx";
import { mapRawHighlightToDisplayList } from "../../../utils/mapRawHighlightToDisplayList.ts";
import type { HistoryEntry } from "../../../stores/useHistoryStore.ts";

export type HighlightListModalProps = {
  historyEntry: HistoryEntry | null;
};

export const HighlightListModal = ({
  historyEntry,
}: HighlightListModalProps) => {
  if (!historyEntry) {
    return (
      <div className={styles.empty}>
        Здесь
        <br />
        появятся хайлайты
      </div>
    );
  }

  if (!historyEntry.highlight) {
    return <div className={styles.empty}>Ошибка: {historyEntry.error}</div>;
  }

  const displayHighlights = mapRawHighlightToDisplayList(
    historyEntry.highlight,
  );

  return (
    <div className={styles["highlight-list"]}>
      {displayHighlights.map((item, index) => (
        <HighlightCard
          key={index}
          {...item}
          className={styles["highlight-item"]}
        />
      ))}
    </div>
  );
};
