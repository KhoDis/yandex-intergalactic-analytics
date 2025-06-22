import styles from "./HighlightListModal.module.css";
import { HighlightCard } from "../Highlight/HighlightCard.tsx";
import type { RawHighlight } from "../../types/types.tsx";
import { mapRawHighlightToDisplayList } from "../../utils/mapRawHighlightToDisplayList.ts";

export type HighlightListModalProps = {
  highlight: RawHighlight | null;
};

export const HighlightListModal = ({ highlight }: HighlightListModalProps) => {
  if (!highlight) {
    return (
      <div className={styles.empty}>
        Здесь
        <br />
        появятся хайлайты
      </div>
    );
  }

  const displayHighlights = mapRawHighlightToDisplayList(highlight);

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
