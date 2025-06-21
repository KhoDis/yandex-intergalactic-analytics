import styles from "./Uploader.module.css";
import { Button } from "../Button/Button.tsx";
import { UploadFile } from "../UploadFile/UploadFile.tsx";
import { aggregate } from "../../api/client.ts";
import type { Highlight } from "../../types/types.tsx";
import { useUploadStore } from "../../stores/useUploadStore.ts";
import clsx from "clsx";

// export type UploaderProps = {};

export const Uploader = () => {
  const {
    file,
    status,
    rows,
    setFile,
    setStatus,
    setLoading,
    addHighlight,
    clearHighlights,
  } = useUploadStore();

  const handleFileUpload = async () => {
    console.log("File uploading", file?.name);
    if (!file) return;

    try {
      setLoading(true);
      setStatus("parsing");
      console.log("File uploaded", rows);

      const stream = await aggregate(file, rows);
      if (!stream) throw new Error("No stream");

      setStatus("parsing");
      console.log("File aggregated");

      // Long process here
      await streamToHighlights(stream, addHighlight);

      setStatus("done");
      console.log("Highlights parsed");

      saveToHistory(file.name); // localStorage
    } catch (err) {
      console.error(err);
      setStatus("error");
      console.log("File failed to upload");
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = (fileName: string) => {
    const current = JSON.parse(localStorage.getItem("uploadHistory") || "[]");
    const newEntry = {
      date: new Date().toISOString(),
      fileName,
      highlights: useUploadStore.getState().highlights,
    };
    localStorage.setItem(
      "uploadHistory",
      JSON.stringify([newEntry, ...current]),
    );
  };

  const streamToHighlights = async (
    stream: ReadableStream<Uint8Array>,
    onHighlight: (highlight: Highlight) => void,
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
            status === "parsing") &&
            styles["uploader__window--uploaded"],
        )}
      >
        Current status: {status}
        <UploadFile
          file={file}
          status={status}
          onUpload={handleSetFile}
          onReset={resetAll}
          onChoose={() => setStatus("choosing")}
        />
      </div>
      <Button type={"submit"} onClick={handleFileUpload}>
        <span>Отправить</span>
      </Button>
    </div>
  );
};
