import styles from "./FileStatus.module.css";
import clsx from "clsx";
import { Spinner } from "../../assets/Spinner.tsx";

export type FileStatus = "uploaded" | "processing" | "done" | "error";

export type FileStatusProps = {
  status: FileStatus;
  buttonText: string;
  onReset: () => void;
  uploadText?: string;
  processingText: string;
  doneText: string;
  errorText: string;
};

export const FileStatus = ({
  status,
  buttonText,
  onReset,
  uploadText,
  processingText,
  doneText,
  errorText,
}: FileStatusProps) => {
  const getStatusText = () => {
    switch (status) {
      case "uploaded":
        return uploadText;
      case "processing":
        return processingText;
      case "done":
        return doneText;
      case "error":
        return errorText;
      default:
        return "?";
    }
  };

  return (
    // Vertical
    <div className={styles["file-status"]}>
      <div className={styles["file-status__button-row"]}>
        <span
          className={clsx(
            styles["file-status__text"],
            styles[`file-status__text--${status}`],
          )}
        >
          {status === "processing" ? (
            <Spinner className={styles["file-status__spinner"]} />
          ) : (
            buttonText
          )}
        </span>
        {status !== "processing" && (
          <button className={styles["file-status__close"]} onClick={onReset}>
            <img src="/cancel-icon.svg" alt="close" />
          </button>
        )}
      </div>
      <div className={styles["file-status__subtext"]}>{getStatusText()}</div>
    </div>
  );
};
