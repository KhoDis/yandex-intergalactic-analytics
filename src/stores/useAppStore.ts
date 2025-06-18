import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HistoryItem } from "../types/types.tsx";

interface AppState {
  history: HistoryItem[];
  addHistoryItem: (item: HistoryItem) => void;
  clearHistory: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      history: [],
      addHistoryItem: (item) =>
        set((state) => ({ history: [...state.history, item] })),
      clearHistory: () => set({ history: [] }),
    }),
    { name: "intergalactic-analytics" },
  ),
);
