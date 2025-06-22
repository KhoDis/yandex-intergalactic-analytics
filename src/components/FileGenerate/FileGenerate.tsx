import { FileStatus } from "../FileStatus/FileStatus";
import { Button } from "../Button/Button";
import styles from "./FileGenerate.module.css";

export type GenerateStatus = "idle" | "processing" | "done" | "error";

export type FileGenerateProps = {
  status: GenerateStatus;
  onGenerate: () => void;
  onReset: () => void;
};

export const FileGenerate = ({
  status,
  onGenerate,
  onReset,
}: FileGenerateProps) => {
  if (status === "idle") {
    return (
      <div className={styles["generate-container"]}>
        <Button type={"submit"} onClick={onGenerate}>
          Начать генерацию
        </Button>
      </div>
    );
  }

  return (
    <div className={styles["generate-container"]}>
      <FileStatus
        status={status as "processing" | "done" | "error"}
        onReset={onReset}
        buttonText={status === "error" ? "Ошибка" : "Done!"}
        processingText="идёт процесс генерации"
        doneText="файл сгенерирован!"
        errorText="ошибка генерации"
      />
    </div>
  );
};
