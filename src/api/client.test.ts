import { aggregate, report } from "./client.ts";
import { vi, describe, expect, it, beforeEach } from "vitest";

global.fetch = vi.fn();

describe("API client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("report function", () => {
    it("should fetch report with correct parameters", async () => {
      const mockBlob = new Blob(["test"]);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const size = 100;
      const result = await report(size);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/report?size=100&withErrors=off&maxSpend=1000",
      );
      expect(result).toBeInstanceOf(Blob);
    });

    it("should handle errors when fetch fails", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      });

      await expect(report(100)).rejects.toThrow("Report generation failed");
    });

    it("should use custom parameters when provided", async () => {
      const mockBlob = new Blob(["test"]);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      await report(50, "on", "500");

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/report?size=50&withErrors=on&maxSpend=500",
      );
    });
  });

  describe("aggregate function", () => {
    it("should upload file with correct parameters", async () => {
      const mockStream = new ReadableStream();
      const mockFile = new File(["content"], "test.csv");
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        body: mockStream,
      });

      const rows = 1000;
      const result = await aggregate(mockFile, rows);

      // Проверяем что FormData был создан правильно
      expect(fetch).toHaveBeenCalled();
      const [url, options] = vi.mocked(fetch).mock.calls[0];
      expect(url).toContain("http://localhost:3000/aggregate?rows=1000");
      expect(options!.method).toBe("POST");
      expect(options!.body).toBeInstanceOf(FormData);

      expect(result).toBe(mockStream);
    });

    it("should throw error when upload fails", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      });

      const mockFile = new File(["content"], "test.csv");
      await expect(aggregate(mockFile, 100)).rejects.toThrow("Upload failed");
    });

    it("should handle null response body", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        body: null,
      });

      const mockFile = new File(["content"], "test.csv");
      const result = await aggregate(mockFile, 100);
      expect(result).toBeNull();
    });
  });
});
