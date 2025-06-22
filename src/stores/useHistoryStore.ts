import { create } from "zustand";
import { type HistoryRecord, historyService } from "../services/historyService";

export type HistoryEntry = HistoryRecord & {
  id: string;
};

type HistoryStore = {
  history: HistoryEntry[];
  selectedHistoryEntry: HistoryEntry | null;
  isModalOpen: boolean;

  loadHistory: () => void;
  removeHistoryItem: (id: string) => void;
  clearHistory: () => void;
  openModal: (historyEntry: HistoryEntry) => void;
  closeModal: () => void;
};

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  history: [],
  selectedHistoryEntry: null,
  isModalOpen: false,

  loadHistory: () => {
    const raw = historyService.getAll();
    const withIds = raw.map((item, index) => ({
      ...item,
      id: `${item.date}-${index}`,
    }));
    set({ history: withIds });
  },

  removeHistoryItem: (id) => {
    const index = get().history.findIndex((item) => item.id === id);
    if (index >= 0) {
      historyService.remove(index);
      const updated = [...get().history];
      updated.splice(index, 1);
      set({ history: updated });
    }
  },

  clearHistory: () => {
    historyService.clear();
    set({ history: [] });
  },

  openModal: (historyEntry) => {
    set({ selectedHistoryEntry: historyEntry, isModalOpen: true });
  },

  closeModal: () => {
    set({ selectedHistoryEntry: null, isModalOpen: false });
  },
}));
