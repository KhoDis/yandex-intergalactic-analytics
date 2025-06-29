import { historyService, type HistoryRecord } from "./historyService";

import { vi, expect, describe, it, beforeEach } from "vitest";

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("historyService", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return empty array when no history exists", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = historyService.getAll();

      expect(result).toEqual([]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("uploadHistory");
    });

    it("should return parsed history from localStorage", () => {
      const mockHistory: HistoryRecord[] = [
        {
          date: "2024-01-01T00:00:00.000Z",
          fileName: "test.csv",
          highlight: null,
          status: "success",
        },
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHistory));

      const result = historyService.getAll();

      expect(result).toEqual(mockHistory);
    });

    it("should return empty array when localStorage contains invalid JSON", () => {
      localStorageMock.getItem.mockReturnValue("invalid json");
      console.error = vi.fn(); // Mock console.error

      const result = historyService.getAll();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("add", () => {
    it("should add new record to the beginning of history", () => {
      const existingRecord: HistoryRecord = {
        date: "2024-01-01T00:00:00.000Z",
        fileName: "old.csv",
        highlight: null,
        status: "success",
      };

      const newRecord: HistoryRecord = {
        date: "2024-01-02T00:00:00.000Z",
        fileName: "new.csv",
        highlight: null,
        status: "error",
        error: "Test error",
      };

      localStorageMock.getItem.mockReturnValue(
        JSON.stringify([existingRecord]),
      );

      historyService.add(newRecord);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "uploadHistory",
        JSON.stringify([newRecord, existingRecord]),
      );
    });
  });

  describe("remove", () => {
    it("should remove record at specified index", () => {
      const records: HistoryRecord[] = [
        {
          date: "2024-01-01",
          fileName: "file1.csv",
          highlight: null,
          status: "success",
        },
        {
          date: "2024-01-02",
          fileName: "file2.csv",
          highlight: null,
          status: "success",
        },
        {
          date: "2024-01-03",
          fileName: "file3.csv",
          highlight: null,
          status: "success",
        },
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(records));

      historyService.remove(1);

      const expectedRecords = [records[0], records[2]];
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "uploadHistory",
        JSON.stringify(expectedRecords),
      );
    });
  });

  describe("clear", () => {
    it("should remove uploadHistory from localStorage", () => {
      historyService.clear();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("uploadHistory");
    });
  });
});
