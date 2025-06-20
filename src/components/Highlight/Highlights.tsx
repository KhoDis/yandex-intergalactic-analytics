import styles from "./Highlights.module.css";
import { HighlightCard } from "./HighlightCard.tsx";

export type Highlight = {
  value: string;
  label: string;
};

export type HighlightsProps = {
  highlights: Highlight[];
};

export const Highlights = ({ highlights }: HighlightsProps) => {
  return (
    <div className={styles.highlights}>
      {highlights.map((highlight) => (
        <HighlightCard key={highlight.label} {...highlight} />
      ))}
    </div>
  );
};
