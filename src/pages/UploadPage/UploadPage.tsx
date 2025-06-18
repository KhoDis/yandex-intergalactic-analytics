import { useRef, useState } from "react";

export const UploadPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState(1000);
  // const { upload } = useAnalyticsStore();
  // const [stream, setStream] = useState<ReadableStream<Uint8Array> | null>(null);
  // const { data, progress } = useStream(stream);

  // const handleUpload = async () => {
  //   const file = fileInputRef.current?.files?.[0];
  //   if (!file) return;
  //
  //   const stream = await upload(file, rows);
  //   setStream(stream);
  // };

  return (
    <div>
      <h1>Upload Page</h1>
      {/*<input type="file" ref={fileInputRef} accept=".csv,.json" />*/}
      {/*<input*/}
      {/*  type="number"*/}
      {/*  value={rows}*/}
      {/*  onChange={(e) => setRows(Number(e.target.value))}*/}
      {/*/>*/}
      {/*<button onClick={handleUpload}>Загрузить</button>*/}

      {/*{progress > 0 && (*/}
      {/*  <div>*/}
      {/*    <progress value={progress} max={10000} />*/}
      {/*    <pre>{data.slice(0, 500)}...</pre>*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};
