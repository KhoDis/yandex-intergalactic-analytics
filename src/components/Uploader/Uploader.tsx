import styles from "./Uploader.module.css";
import { Button } from "../Button/Button.tsx";
import { aggregate } from "../../api/client.ts";
import type { RawHighlight } from "../../types/types.tsx";
import { useUploadStore } from "../../stores/useUploadStore.ts";
import clsx from "clsx";
import { FileUpload, type UploadStatus } from "../FileUpload/FileUpload.tsx";
import React from "react";

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

      saveToHistory(file.name); // localStorage
    } catch (err) {
      console.error(err);
      setStatus("error");
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

  const saveToHistory = (fileName: string) => {
    const current = JSON.parse(localStorage.getItem("uploadHistory") || "[]");
    const newEntry = {
      date: new Date().toISOString(),
      fileName,
      highlight: useUploadStore.getState().highlight,
    };
    localStorage.setItem(
      "uploadHistory",
      JSON.stringify([newEntry, ...current]),
    );
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
          onHighlight(json);
        } catch (err) {
          console.error("Bad JSON chunk:", chunk, err);
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
        Current status: {status}
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
