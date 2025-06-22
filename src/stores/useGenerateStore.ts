import { create } from "zustand";
import { report } from "../api/client";

export type GenerateStatus = "idle" | "processing" | "done" | "error";

interface GenerateState {
  status: GenerateStatus;
  error: string | null;
  generate: () => Promise<void>;
  reset: () => void;
}

export const useGenerateStore = create<GenerateState>((set) => ({
  status: "idle",
  error: null,

  generate: async () => {
    set({ status: "processing", error: null });

    try {
      const blob = await report(0.01, "on");

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      set({ status: "done" });
    } catch (error) {
      set({
        status: "error",
        error: error instanceof Error ? error.message : "Ошибка генерации",
      });
    }
  },

  reset: () => {
    set({ status: "idle", error: null });
  },
}));
