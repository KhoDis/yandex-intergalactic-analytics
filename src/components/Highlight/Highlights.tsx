import styles from "./Highlights.module.css";
import { HighlightCard } from "./HighlightCard.tsx";
import { type Highlight } from "../../types/types.tsx";

export type HighlightsProps = {
  highlights: Highlight[];
};

export const Highlights = ({ highlights }: HighlightsProps) => {
  if (highlights.length === 0) {
    return (
      <span className={styles["no-highlights"]}>
        Здесь
        <br />
        появятся хайлайты
      </span>
    );
  }

  return (
    <div className={styles.highlights}>
      {highlights.map((highlight) => (
        <HighlightCard key={highlight.label} {...highlight} />
      ))}
    </div>
  );
};
