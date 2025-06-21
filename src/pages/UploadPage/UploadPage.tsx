import { Uploader } from "../../components/Uploader/Uploader.tsx";
import { Highlights } from "../../components/Highlight/Highlights.tsx";
import styles from "./UploadPage.module.css";
import { useUploadStore } from "../../stores/useUploadStore.ts";

export const UploadPage = () => {
  const { highlights } = useUploadStore();

  return (
    <div className={styles.container}>
      <Uploader />
      <Highlights highlights={highlights} />
    </div>
  );
};
