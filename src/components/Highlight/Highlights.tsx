import styles from "./Highlights.module.css";
import { HighlightCard } from "./HighlightCard.tsx";
import type { RawHighlight } from "../../types/types.tsx";
import { mapRawHighlightToDisplayList } from "../../utils/mapRawHighlightToDisplayList.ts";

export type HighlightsProps = {
  highlight: RawHighlight | null;
};

export const Highlights = ({ highlight }: HighlightsProps) => {
  if (!highlight) {
    return (
      <span className={styles["no-highlights"]}>
        Здесь
        <br />
        появятся хайлайты
      </span>
    );
  }

  const displayHighlights = mapRawHighlightToDisplayList(highlight);

  return (
    <div className={styles.highlights}>
      {displayHighlights.map((highlight, index) => (
        <HighlightCard key={index} {...highlight} />
      ))}
    </div>
  );
};
