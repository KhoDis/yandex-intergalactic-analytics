import { Uploader } from "../../components/upload/Uploader/Uploader.tsx";
import { Highlights } from "../../components/history/Highlights/Highlights.tsx";
import styles from "./UploadPage.module.css";
import { useUploadStore } from "../../stores/useUploadStore.ts";

export const UploadPage = () => {
  const { highlight } = useUploadStore();

  return (
    <div className={styles.container}>
      <Uploader />
      <Highlights highlight={highlight} />
    </div>
  );
};
