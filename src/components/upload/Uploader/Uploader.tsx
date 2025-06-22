import styles from "./Uploader.module.css";
import { Button } from "../../common/Button/Button.tsx";
import { aggregate } from "../../../api/client.ts";
import type { RawHighlight } from "../../../types";
import { useUploadStore } from "../../../stores/useUploadStore.ts";
import clsx from "clsx";
import { FileUpload, type UploadStatus } from "../FileUpload/FileUpload.tsx";
import React from "react";
import { historyService } from "../../../services/historyService.ts";

const isValidHighlight = (data: unknown): data is RawHighlight => {
  // {"total_spend_galactic":0,"rows_affected":0,"average_spend_galactic":0}
  // Special case scenario
  if (
    typeof data === "object" &&
    data !== null &&
    "total_spend_galactic" in data &&
    "rows_affected" in data &&
    "average_spend_galactic" in data &&
    typeof data.total_spend_galactic === "number" &&
    typeof data.rows_affected === "number" &&
    typeof data.average_spend_galactic === "number"
  ) {
    return true;
  }
  return (
    typeof data === "object" &&
    data !== null &&
    "total_spend_galactic" in data &&
    "rows_affected" in data &&
    "less_spent_at" in data &&
    "big_spent_at" in data &&
    "less_spent_value" in data &&
    "big_spent_value" in data &&
    "average_spend_galactic" in data &&
    "big_spent_civ" in data &&
    "less_spent_civ" in data &&
    typeof data.total_spend_galactic === "number" &&
    typeof data.rows_affected === "number" &&
    typeof data.less_spent_at === "number" &&
    typeof data.big_spent_at === "number" &&
    typeof data.less_spent_value === "number" &&
    typeof data.big_spent_value === "number" &&
    typeof data.average_spend_galactic === "number" &&
    typeof data.big_spent_civ === "string" &&
    typeof data.less_spent_civ === "string"
  );
};

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

  const [previousStatus, setPreviousStatus] =
    React.useState<UploadStatus>(status);

  const handleFileUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setStatus("processing");

      const stream = await aggregate(file, rows);
      if (!stream) throw new Error("No stream");

      setStatus("processing");

      // Long process here
      await streamToHighlights(stream, setHighlight);

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
    setPreviousStatus(status);
    setStatus("choosing");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setStatus(previousStatus);
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

  const streamToHighlights = async (
    stream: ReadableStream<Uint8Array>,
    onHighlight: (highlight: RawHighlight) => void,
  ) => {
    const reader = stream.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let boundary;
      while ((boundary = buffer.indexOf("\n")) >= 0) {
        const chunk = buffer.slice(0, boundary).trim();
        buffer = buffer.slice(boundary + 1);
        if (!chunk) continue;

        try {
          const json = JSON.parse(chunk);
          if (isValidHighlight(json)) {
            onHighlight(json);
          } else {
            console.warn("Invalid highlight object:", json);
            throw new Error("Invalid highlight object");
          }
        } catch (err) {
          console.error("Bad JSON chunk:", chunk, err);
          throw err;
        }
      }
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
