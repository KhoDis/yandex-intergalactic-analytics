import type { RawHighlight } from "../types";

export type HistoryStatus = "success" | "error";

export type HistoryRecord = {
  date: string;
  fileName: string;
  highlight: RawHighlight | null;
  status: HistoryStatus;
  error?: string;
};

const STORAGE_KEY = "uploadHistory";

export const historyService = {
  getAll(): HistoryRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Failed to parse history from storage", e);
      return [];
    }
  },

  add(record: HistoryRecord): void {
    const history = this.getAll();
    const newHistory = [record, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  },

  remove(index: number): void {
    const history = this.getAll();
    history.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
