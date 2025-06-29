import { renderHook, act } from "@testing-library/react";
import { useGenerateStore } from "./useGenerateStore";
import { report } from "../api/client";
import { describe, beforeEach, expect, it, vi } from "vitest";

vi.mock("../api/client");

describe("useGenerateStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGenerateStore.setState({
      status: "idle",
      error: null,
    });
  });

  it("should have correct initial state", () => {
    const { result } = renderHook(() => useGenerateStore());

    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeNull();
  });

  it("should generate report successfully", async () => {
    const mockBlob = new Blob(["test"]);
    vi.mocked(report).mockResolvedValue(mockBlob);

    global.URL.createObjectURL = vi.fn(() => "mock-url");
    global.URL.revokeObjectURL = vi.fn();

    const { result } = renderHook(() => useGenerateStore());

    await act(async () => {
      await result.current.generate();
    });

    expect(report).toHaveBeenCalledWith(0.01, "on");
    expect(URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("mock-url");
    expect(result.current.status).toBe("done");
    expect(result.current.error).toBeNull();
  });

  it("should handle generation error", async () => {
    const error = new Error("Test error");
    vi.mocked(report).mockRejectedValue(error);

    const { result } = renderHook(() => useGenerateStore());

    await act(async () => {
      await result.current.generate();
    });

    expect(report).toHaveBeenCalled();
    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe("Test error");
  });

  it("should reset state", () => {
    useGenerateStore.setState({
      status: "error",
      error: "Test error",
    });

    const { result } = renderHook(() => useGenerateStore());

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeNull();
  });
});
