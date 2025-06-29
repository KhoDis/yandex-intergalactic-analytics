import { renderHook, act } from "@testing-library/react";
import { useUploadStore } from "./useUploadStore.ts";
import { describe, beforeEach, expect, it } from "vitest";

describe("useUploadStore", () => {
  beforeEach(() => {
    useUploadStore.setState({
      file: null,
      status: "idle",
      highlight: null,
      rows: 10000,
      isLoading: false,
    });
  });

  it("should have correct initial state", () => {
    const { result } = renderHook(() => useUploadStore());

    expect(result.current.file).toBe(null);
    expect(result.current.status).toBe("idle");
    expect(result.current.highlight).toBe(null);
    expect(result.current.rows).toBe(10000);
    expect(result.current.isLoading).toBe(false);
  });

  it("should update file", () => {
    const { result } = renderHook(() => useUploadStore());
    const mockFile = new File(["content"], "test.csv", { type: "text/csv" });

    act(() => {
      result.current.setFile(mockFile);
    });

    expect(result.current.file).toBe(mockFile);
  });

  it("should update status", () => {
    const { result } = renderHook(() => useUploadStore());

    act(() => {
      result.current.setStatus("processing");
    });

    expect(result.current.status).toBe("processing");
  });

  it("should clear highlights", () => {
    const { result } = renderHook(() => useUploadStore());
    const mockHighlight = {
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

    act(() => {
      result.current.setHighlight(mockHighlight);
    });

    expect(result.current.highlight).toBe(mockHighlight);

    act(() => {
      result.current.clearHighlights();
    });

    expect(result.current.highlight).toBe(null);
  });

  it("should update loading state", () => {
    const { result } = renderHook(() => useUploadStore());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);
  });
});
