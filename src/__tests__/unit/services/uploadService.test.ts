import { describe, it, expect, vi } from "vitest";
import { uploadService } from "../../../services/uploadService.ts";

describe("uploadService", () => {
  it("handles JSON-stream", async () => {
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

  it("handles invalid JSON-stream", async () => {
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
});
