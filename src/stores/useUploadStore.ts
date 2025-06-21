import { create } from "zustand";
import type { Highlight } from "../types/types";

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
  highlights: Highlight[];
  rows: number;
  isLoading: boolean;

  setFile: (file: File | null) => void;
  setStatus: (status: UploadStatus) => void;
  addHighlight: (highlight: Highlight) => void;
  clearHighlights: () => void;
  setRows: (rows: number) => void;
  setLoading: (state: boolean) => void;
};

export const useUploadStore = create<UploadStore>((set) => ({
  file: null,
  status: "idle",
  highlights: [],
  rows: 10000,
  isLoading: false,

  setFile: (file) => set({ file }),
  setStatus: (status) => {
    console.log("Status changed", status);
    set({ status });
  },
  addHighlight: (highlight) =>
    set((state) => ({ highlights: [...state.highlights, highlight] })),
  clearHighlights: () => set({ highlights: [] }),
  setRows: (rows) => set({ rows }),
  setLoading: (isLoading) => set({ isLoading }),
}));
