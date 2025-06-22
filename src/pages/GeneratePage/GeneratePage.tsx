import styles from "./GeneratePage.module.css";
import { FileGenerate } from "../../components/FileGenerate/FileGenerate.tsx";
import { useGenerateStore } from "../../stores/useGenerateStore.ts";

export const GeneratePage = () => {
  const { status, generate, reset } = useGenerateStore();

  return (
    <div className={styles.container}>
      <span className={styles.text}>
        Сгенерируйте готовый csv-файл нажатием одной кнопки
      </span>
      <FileGenerate status={status} onGenerate={generate} onReset={reset} />
    </div>
  );
};
