const API_URL = "http://localhost:3000";

export const report = async (
  size: number,
  withErrors: string = "off",
  maxSpend: string = "1000",
): Promise<Blob> => {
  const params = new URLSearchParams({
    size: String(size),
    withErrors,
    maxSpend,
  });
  const response = await fetch(`${API_URL}/report?${params}`);

  if (!response.ok) throw new Error("Report generation failed");
  return response.blob(); // Для CSV файла
};

export const aggregate = async (
  file: File,
  rows: number,
): Promise<ReadableStream<Uint8Array> | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("rows", String(rows));

  const response = await fetch(`${API_URL}/aggregate`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Upload failed");
  return response.body;
};
