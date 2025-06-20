import styles from "./History.module.css";
import { HistoryItemRow } from "../../components/HistoryItemRow/HistoryItemRow.tsx";

export type HistoryItem = {
  id: string;
  name: string;
  date: Date;
  isSuccess: boolean;
};

export type HistoryProps = {
  history: HistoryItem[];
};

export const History = ({ history }: HistoryProps) => {
  return (
    <div className={styles.history}>
      {history.map((item) => (
        <HistoryItemRow key={item.id} />
      ))}
    </div>
  );
};
