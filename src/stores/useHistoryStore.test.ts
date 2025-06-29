import { renderHook, act } from "@testing-library/react";
import { useHistoryStore } from "./useHistoryStore";
import { historyService } from "../services/historyService";
import { describe, beforeEach, expect, it, vi } from "vitest";

vi.mock("../services/historyService");

describe("useHistoryStore", () => {
  const mockHistoryEntry = {
    date: "2023-01-01",
    fileName: "test.csv",
    highlight: {
      total_spend_galactic: 1000,
      rows_affected: 100,
      less_spent_at: 10,
      big_spent_at: 20,
      less_spent_value: 100,
      big_spent_value: 200,
      average_spend_galactic: 50,
      big_spent_civ: "humans",
      less_spent_civ: "blobs",
    },
    id: "2023-01-01-0",
    status: "success" as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useHistoryStore.setState({
      history: [],
      selectedHistoryEntry: null,
      isModalOpen: false,
    });
  });

  it("should have correct initial state", () => {
    const { result } = renderHook(() => useHistoryStore());

    expect(result.current.history).toEqual([]);
    expect(result.current.selectedHistoryEntry).toBeNull();
    expect(result.current.isModalOpen).toBe(false);
  });

  it("should load history", () => {
    const mockHistory = [mockHistoryEntry];
    vi.mocked(historyService.getAll).mockReturnValue(mockHistory);

    const { result } = renderHook(() => useHistoryStore());

    act(() => {
      result.current.loadHistory();
    });

    expect(historyService.getAll).toHaveBeenCalled();
    expect(result.current.history).toEqual([
      {
        ...mockHistoryEntry,
        id: expect.any(String),
      },
    ]);
  });

  it("should remove history item", () => {
    const initialHistory = [mockHistoryEntry];
    useHistoryStore.setState({ history: initialHistory });

    const { result } = renderHook(() => useHistoryStore());

    act(() => {
      result.current.removeHistoryItem(mockHistoryEntry.id);
    });

    expect(historyService.remove).toHaveBeenCalledWith(0);
    expect(result.current.history).toEqual([]);
  });

  it("should clear history", () => {
    const initialHistory = [mockHistoryEntry];
    useHistoryStore.setState({ history: initialHistory });

    const { result } = renderHook(() => useHistoryStore());

    act(() => {
      result.current.clearHistory();
    });

    expect(historyService.clear).toHaveBeenCalled();
    expect(result.current.history).toEqual([]);
  });

  it("should open and close modal", () => {
    const { result } = renderHook(() => useHistoryStore());

    act(() => {
      result.current.openModal(mockHistoryEntry);
    });

    expect(result.current.selectedHistoryEntry).toEqual(mockHistoryEntry);
    expect(result.current.isModalOpen).toBe(true);

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.selectedHistoryEntry).toBeNull();
    expect(result.current.isModalOpen).toBe(false);
  });
});
