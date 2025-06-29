import { describe, it, expect, vi } from "vitest";
import { uploadService } from "./uploadService.ts";
import type { RawHighlight } from "../types";

describe("uploadService", () => {
  it("should handle valid JSON-stream", async () => {
    const validChunk = JSON.stringify({
      total_spend_galactic: 1000,
      rows_affected: 10,
      less_spent_at: 1,
      big_spent_at: 2,
      less_spent_value: 10,
      big_spent_value: 100,
      average_spend_galactic: 50,
      big_spent_civ: "humans",
      less_spent_civ: "blobs",
    });

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(validChunk + "\n"));
        controller.close();
      },
    });

    const callback = vi.fn();
    await uploadService.streamToHighlights(stream, callback);

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ total_spend_galactic: 1000 }),
    );
  });

  it("should handle invalid JSON-stream", async () => {
    const invalidChunk = JSON.stringify({
      total_spend_galactic: "1000",
      rows_affected: "10",
      less_spent_at: "1",
      big_spent_at: "2",
      less_spent_value: "10",
      big_spent_value: "100",
      average_spend_galactic: "50",
      big_spent_civ: "humans",
      less_spent_civ: "blobs",
    });

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(invalidChunk + "\n"));
        controller.close();
      },
    });

    const callback = vi.fn();
    await expect(
      uploadService.streamToHighlights(stream, callback),
    ).rejects.toThrow();
  });

  it("should validate special case scenario", () => {
    const specialCase = {
      total_spend_galactic: 0,
      rows_affected: 0,
      average_spend_galactic: 0,
    };

    expect(uploadService.isValidHighlight(specialCase)).toBe(true);
  });

  it("should reject invalid objects", () => {
    const invalidCases = [
      null,
      undefined,
      {},
      { total_spend_galactic: "string" }, // wrong type
      { total_spend_galactic: 100 }, // missing fields
      {
        total_spend_galactic: 100,
        rows_affected: 50,
        big_spent_civ: 123, // wrong type
      },
    ];

    invalidCases.forEach((testCase) => {
      expect(uploadService.isValidHighlight(testCase)).toBe(false);
    });
  });

  describe("streamToHighlights", () => {
    it("should parse valid JSON chunks from stream", async () => {
      const mockHighlight: RawHighlight = {
        total_spend_galactic: 1000,
        rows_affected: 100,
        less_spent_at: 50,
        big_spent_at: 200,
        less_spent_value: 10,
        big_spent_value: 500,
        average_spend_galactic: 100,
        big_spent_civ: "humans",
        less_spent_civ: "blobs",
      };

      const jsonString = JSON.stringify(mockHighlight);
      const encoder = new TextEncoder();
      const chunk = encoder.encode(jsonString + "\n");

      // Mock ReadableStream
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(chunk);
          controller.close();
        },
      });

      const onHighlight = vi.fn();
      await uploadService.streamToHighlights(mockStream, onHighlight);

      expect(onHighlight).toHaveBeenCalledWith(mockHighlight);
      expect(onHighlight).toHaveBeenCalledTimes(1);
    });

    it("should handle malformed JSON gracefully", async () => {
      const encoder = new TextEncoder();
      const badChunk = encoder.encode('{"invalid": json}\n');

      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(badChunk);
          controller.close();
        },
      });

      const onHighlight = vi.fn();

      await expect(
        uploadService.streamToHighlights(mockStream, onHighlight),
      ).rejects.toThrow();

      expect(onHighlight).not.toHaveBeenCalled();
    });

    it("should skip empty chunks", async () => {
      const mockHighlight = {
        total_spend_galactic: 0,
        rows_affected: 0,
        average_spend_galactic: 0,
      };
      const encoder = new TextEncoder();
      const chunks = encoder.encode(
        "\n" + JSON.stringify(mockHighlight) + "\n\n",
      );

      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(chunks);
          controller.close();
        },
      });

      const onHighlight = vi.fn();
      await uploadService.streamToHighlights(mockStream, onHighlight);

      expect(onHighlight).toHaveBeenCalledTimes(1);
      expect(onHighlight).toHaveBeenCalledWith(mockHighlight);
    });
  });
});
