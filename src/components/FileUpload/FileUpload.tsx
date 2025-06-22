import { FileStatus } from "../FileStatus/FileStatus";
import styles from "./FileUpload.module.css";
import React from "react";

export type UploadStatus =
  | "idle"
  | "choosing"
  | "uploaded"
  | "processing"
  | "done"
  | "error";

export type FileUploadProps = {
  file: File | null;
  status: UploadStatus;
  onUpload: (file: File) => void;
  onReset: () => void;
  onChoose: () => void;
};

export const FileUpload = ({
  file,
  status,
  onUpload,
  onReset,
  onChoose,
}: FileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  console.log("FileUpload", file, status);

  // No file yet
  if (
    file &&
    (status === "uploaded" ||
      status === "processing" ||
      status === "done" ||
      status === "error")
  ) {
    console.log("File is uploaded");
    return (
      <FileStatus
        status={status}
        buttonText={file.name}
        onReset={onReset}
        uploadText="файл загружен!"
        processingText="идёт парсинг файла"
        doneText="готово!"
        errorText="упс, не то..."
      />
    );
  }

  return (
    <div className={styles["upload-container"]}>
      <label className={styles["upload-button"]} onClick={onChoose}>
        Загрузить файл
        <input type="file" onChange={handleFileChange} hidden />
      </label>
      <div className={styles["upload-text"]}>или перетащите сюда</div>
    </div>
  );
};
