export type HistoryItem = {
  id: string;
};

export type UploadStatus = "idle" | "uploaded" | "parsing" | "done" | "error";

export type UploadedFile = {
  name: string;
  status: UploadStatus;
};
