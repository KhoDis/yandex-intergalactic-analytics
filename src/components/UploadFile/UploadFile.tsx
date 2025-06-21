import styles from "./UploadFile.module.css";
import React from "react";
import clsx from "clsx";
import type { UploadStatus } from "../../stores/useUploadStore.ts";

export type UploadFileProps = {
  file: File | null;
  status: UploadStatus;
  onUpload: (file: File) => void;
  onReset: () => void;
  onChoose: () => void;
};

export const UploadFile = ({
  file,
  status,
  onUpload,
  onReset,
  onChoose,
}: UploadFileProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) return onUpload(file);
  };

  const getStatusText = (status: UploadStatus) => {
    switch (status) {
      case "idle":
      case "choosing":
        return "или перетащите сюда";
      case "uploaded":
        return "файл загружен!";
      case "parsing":
        return "идёт парсинг файла";
      case "done":
        return "готово!";
      case "error":
        return "упс, не то...";
      default:
        return "";
    }
  };

  return (
    <div className={styles["upload-button"]}>
      {!file && (
        <>
          <label
            className={styles["upload-button__file"]}
            onClick={() => onChoose()}
          >
            Загрузить файл
            <input type="file" onChange={handleFileChange} hidden />
          </label>
          <div className={styles["upload-button__text"]}>
            или перетащите сюда
          </div>
        </>
      )}

      {file && (
        <div
          className={clsx(
            styles["upload-button__file"],
            styles[`upload-button__file--${status}`],
          )}
        >
          {file.name}
          <button className={styles["upload-button__close"]} onClick={onReset}>
            <img src="/cancel-icon.svg" alt="close" />
          </button>
          <div className={styles["upload-button__text"]}>
            {status === "parsing" ? (
              <div className="upload-button__spinner" />
            ) : (
              getStatusText(status)
            )}
          </div>
        </div>
      )}
    </div>
  );
};
