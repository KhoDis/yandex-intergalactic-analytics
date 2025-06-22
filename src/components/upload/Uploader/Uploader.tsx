import styles from "./Uploader.module.css";
import { Button } from "../../common/Button/Button.tsx";
import { aggregate } from "../../../api/client.ts";
import { useUploadStore } from "../../../stores/useUploadStore.ts";
import clsx from "clsx";
import { FileUpload, type UploadStatus } from "../FileUpload/FileUpload.tsx";
import React, { useRef } from "react";
import { historyService } from "../../../services/historyService.ts";
import { uploadService } from "../../../services/uploadService.ts";

export const Uploader = () => {
  const {
    file,
    status,
    rows,
    setFile,
    setStatus,
    setLoading,
    setHighlight,
    clearHighlights,
  } = useUploadStore();

  const previousStatus = useRef<UploadStatus>(status);

  const handleFileUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setStatus("processing");

      const stream = await aggregate(file, rows);
      if (!stream) throw new Error("No stream");

      setStatus("processing");

      // Long process here
      await uploadService.streamToHighlights(stream, setHighlight);

      setStatus("done");

      historyService.add({
        date: new Date().toISOString(),
        fileName: file.name,
        highlight: useUploadStore.getState().highlight,
        status: "success",
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setHighlight(null);

      historyService.add({
        date: new Date().toISOString(),
        fileName: file.name,
        highlight: null,
        status: "error",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === "choosing") return;
    previousStatus.current = status;
    setStatus("choosing");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "choosing") return;
    setStatus(previousStatus.current);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFile(file);
      setStatus("uploaded");
    }
  };

  const resetAll = () => {
    setFile(null);
    setStatus("idle");
    clearHighlights();
  };

  const handleSetFile = (file: File) => {
    setFile(file);
    setStatus("uploaded");
  };

  return (
    <div className={styles.uploader}>
      <span className={styles["uploader__text"]}>
        Загрузите <b>csv</b> файл и получите <b>полную информацию</b> о нём за
        сверхнизкое время
      </span>
      <div
        className={clsx(
          styles["uploader__window"],
          status === "choosing" && styles["uploader__window--choosing"],
          status === "error" && styles["uploader__window--error"],
          (status === "uploaded" ||
            status === "done" ||
            status === "processing") &&
            styles["uploader__window--uploaded"],
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <FileUpload
          file={file}
          status={status}
          onUpload={handleSetFile}
          onReset={resetAll}
          setStatus={setStatus}
        />
      </div>
      <Button type={"submit"} onClick={handleFileUpload}>
        <span>Отправить</span>
      </Button>
    </div>
  );
};
