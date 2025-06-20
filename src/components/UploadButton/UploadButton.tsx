import styles from "./UploadButton.module.css";
import React, { useState } from "react";
import clsx from "clsx";

export type FileStatus = "idle" | "uploaded" | "parsing" | "done" | "error";

interface UploadedFile {
  name: string;
  status: FileStatus;
}

export const UploadButton = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    setFile({ name: uploaded.name, status: "uploaded" });

    // TODO
    setTimeout(() => {
      const isError = uploaded.name.includes("bad");
      setFile({ name: uploaded.name, status: isError ? "error" : "done" });
    }, 2000);
  };

  const reset = () => setFile(null);

  const getStatusText = () => {
    switch (file?.status) {
      case "idle":
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
          <label className={styles["upload-button__content"]}>
            Загрузить файл
            <input type="file" onChange={handleFileChange} hidden />
          </label>
          <div className="upload-button__text">или перетащите сюда</div>
        </>
      )}

      {file && (
        <div
          className={clsx(
            `upload-button__content`,
            `upload-button__content--${file.status}`,
          )}
        >
          {file.name}
          <button className="upload-button__close" onClick={reset}>
            <img src="/cancel-icon.svg" alt="close" />
          </button>
          <div className="upload-button__text">
            {file.status === "parsing" ? (
              <div className="upload-button__spinner" />
            ) : (
              getStatusText()
            )}
          </div>
        </div>
      )}
    </div>
  );
};
