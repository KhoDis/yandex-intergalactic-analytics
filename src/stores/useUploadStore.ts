import { create } from "zustand";
import type { RawHighlight } from "../types/types";

export type UploadStatus =
  | "idle"
  | "choosing"
  | "uploaded"
  | "parsing"
  | "done"
  | "error";

type UploadStore = {
  file: File | null;
  status: UploadStatus;
  highlight: RawHighlight | null;
  rows: number;
  isLoading: boolean;

  setFile: (file: File | null) => void;
  setStatus: (status: UploadStatus) => void;
  setHighlight: (highlight: RawHighlight) => void;
  clearHighlights: () => void;
  setRows: (rows: number) => void;
  setLoading: (state: boolean) => void;
};

export const useUploadStore = create<UploadStore>((set) => ({
  file: null,
  status: "idle",
  highlight: null,
  rows: 10000,
  isLoading: false,

  setFile: (file) => set({ file }),
  setStatus: (status) => {
    console.log("Status changed", status);
    set({ status });
  },
  setHighlight: (highlight) => {
    console.log("Highlight changed", highlight);
    set({ highlight });
  },
  clearHighlights: () => set({ highlight: null }),
  setRows: (rows) => set({ rows }),
  setLoading: (isLoading) => set({ isLoading }),
}));
