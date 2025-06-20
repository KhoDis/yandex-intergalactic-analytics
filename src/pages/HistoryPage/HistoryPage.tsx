import styles from "./HistoryPage.module.css";
import { History } from "./History.tsx";
import { Button } from "../../components/Button/Button.tsx";

const HistoryButtons = () => (
  <div className={styles.buttons}>
    <Button type={"submit"}>Сгенерировать больше</Button>
    <Button type={"clear"}>Очистить всё</Button>
  </div>
);

export const HistoryPage = () => (
  <div className={styles.container}>
    <History
      history={[
        {
          id: "1",
          name: "test1.csv",
          date: new Date(),
          isSuccess: true,
        },
        {
          id: "2",
          name: "test2.csv",
          date: new Date(),
          isSuccess: true,
        },
        {
          id: "3",
          name: "test.csv",
          date: new Date(),
          isSuccess: false,
        },
      ]}
    />
    <HistoryButtons />
  </div>
);
