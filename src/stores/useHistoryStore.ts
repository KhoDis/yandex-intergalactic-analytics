import { create } from "zustand";
import type { RawHighlight } from "../types/types";

export type HistoryEntry = {
  id: string;
  date: string;
  fileName: string;
  highlight: RawHighlight;
  isSuccess: boolean;
};

type HistoryStore = {
  history: HistoryEntry[];
  selectedHighlight: RawHighlight | null;
  isModalOpen: boolean;

  loadHistory: () => void;
  removeHistoryItem: (id: string) => void;
  clearHistory: () => void;
  openModal: (highlight: RawHighlight) => void;
  closeModal: () => void;
};

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  history: [],
  selectedHighlight: null,
  isModalOpen: false,

  loadHistory: () => {
    try {
      const stored = localStorage.getItem("uploadHistory");
      if (stored) {
        const parsed = JSON.parse(stored);
        const historyWithIds = parsed.map((item: any, index: number) => ({
          id: `${item.date}-${index}`,
          date: item.date,
          fileName: item.fileName,
          highlight: item.highlight,
          isSuccess: true,
        }));
        set({ history: historyWithIds });
      }
    } catch (error) {
      console.error("Error loading history:", error);
      set({ history: [] });
    }
  },

  removeHistoryItem: (id: string) => {
    const { history } = get();
    const updatedHistory = history.filter((item) => item.id !== id);

    // Обновляем localStorage
    const storageData = updatedHistory.map((item) => ({
      date: item.date,
      fileName: item.fileName,
      highlight: item.highlight,
    }));
    localStorage.setItem("uploadHistory", JSON.stringify(storageData));

    set({ history: updatedHistory });
  },

  clearHistory: () => {
    localStorage.removeItem("uploadHistory");
    set({ history: [] });
  },

  openModal: (highlight: RawHighlight) => {
    set({ selectedHighlight: highlight, isModalOpen: true });
  },

  closeModal: () => {
    set({ selectedHighlight: null, isModalOpen: false });
  },
}));
