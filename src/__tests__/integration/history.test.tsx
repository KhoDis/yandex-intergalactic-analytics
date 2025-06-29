import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useHistoryStore } from "../../stores/useHistoryStore.ts";
import { historyService } from "../../services/historyService.ts";
import { HistoryPage } from "../../pages/HistoryPage/HistoryPage.tsx";
import React from "react";

vi.mock("../../services/historyService", () => ({
  historyService: {
    getAll: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  ...vi.importActual("react-router"),
  useNavigate: () => mockNavigate,
}));

// Тестовые данные
const mockHistoryData = [
  {
    fileName: "report.csv",
    date: "2024-01-15T10:30:00Z",
    highlight: {
      total_spend_galactic: 50000,
      rows_affected: 100,
      less_spent_at: 10,
      big_spent_at: 90,
      less_spent_value: 100,
      big_spent_value: 9000,
      average_spend_galactic: 500,
      big_spent_civ: "humans",
      less_spent_civ: "blobs",
    },
    error: undefined,
    status: "success" as const,
  },
  {
    fileName: "report-error.csv",
    date: "2024-01-14T08:20:00Z",
    highlight: null,
    error: "File processing failed",
    status: "error" as const,
  },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("HistoryPage Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useHistoryStore.getState().clearHistory();

    // localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  describe("History Loading and Display", () => {
    it("should load and display history on mount", async () => {
      vi.mocked(historyService.getAll).mockReturnValue(mockHistoryData);

      renderWithRouter(<HistoryPage />);

      await waitFor(() => {
        expect(historyService.getAll).toHaveBeenCalledOnce();
      });

      expect(screen.getByTestId("history-page")).toBeInTheDocument();
      expect(screen.getByText("report.csv")).toBeInTheDocument();
      expect(screen.getByText("report-error.csv")).toBeInTheDocument();
    });

    it("should display empty state when history is empty", async () => {
      vi.mocked(historyService.getAll).mockReturnValue([]);

      renderWithRouter(<HistoryPage />);

      await waitFor(() => {
        expect(screen.getByText("История загрузок пуста")).toBeInTheDocument();
      });
    });

    it("should display the correct file statuses", async () => {
      vi.mocked(historyService.getAll).mockReturnValue(mockHistoryData);

      renderWithRouter(<HistoryPage />);

      await waitFor(() => {
        // First file is successful
        expect(screen.getAllByText("Обработано успешно")).toHaveLength(2);
        // Second file is failed
        expect(screen.getAllByText("Не удалось обработать")).toHaveLength(2);
      });
    });
  });

  describe("Item Interactions", () => {
    it("should open modal on history item click and display highlight", async () => {
      vi.mocked(historyService.getAll).mockReturnValue(mockHistoryData);
      renderWithRouter(<HistoryPage />);

      await waitFor(() => {
        expect(screen.getByText("report.csv")).toBeInTheDocument();
      });

      const historyItem = screen.getByText("report.csv").closest("div");
      fireEvent.click(historyItem!);

      await waitFor(() => {
        // модальное окно открылось
        expect(document.body.style.overflow).toBe("hidden");
        // Проверяем наличие highlight карточек
        expect(screen.getAllByTestId("highlight-card")).toHaveLength(8);
      });
    });

    it("should display error in modal for file with error", async () => {
      vi.mocked(historyService.getAll).mockReturnValue(mockHistoryData);
      renderWithRouter(<HistoryPage />);

      await waitFor(() => {
        expect(screen.getByText("report-error.csv")).toBeInTheDocument();
      });

      const errorItem = screen.getByText("report-error.csv").closest("div");
      fireEvent.click(errorItem!);

      await waitFor(() => {
        expect(
          screen.getByText("Ошибка: File processing failed"),
        ).toBeInTheDocument();
      });
    });

    it("should close modal on escape", async () => {
      vi.mocked(historyService.getAll).mockReturnValue(mockHistoryData);
      renderWithRouter(<HistoryPage />);

      await waitFor(() => {
        expect(screen.getByText("report.csv")).toBeInTheDocument();
      });

      const historyItem = screen.getByText("report.csv").closest("div");
      fireEvent.click(historyItem!);

      await waitFor(() => {
        expect(document.body.style.overflow).toBe("hidden");
      });

      fireEvent.keyDown(document, { key: "Escape" });

      await waitFor(() => {
        expect(document.body.style.overflow).toBe("unset");
      });
    });

    it("should remove history item on click", async () => {
      vi.mocked(historyService.getAll).mockReturnValue(mockHistoryData);
      renderWithRouter(<HistoryPage />);

      await waitFor(() => {
        expect(screen.getByText("report.csv")).toBeInTheDocument();
      });

      const removeButtons = screen.getAllByAltText("remove");
      fireEvent.click(removeButtons[0]);

      expect(historyService.remove).toHaveBeenCalledWith(0);
      await waitFor(() => {
        expect(screen.queryByText("report.csv")).not.toBeInTheDocument();
      });
    });
  });

  describe("Action Buttons", () => {
    it('should clear all history on click "Clear All"', async () => {
      vi.mocked(historyService.getAll).mockReturnValue(mockHistoryData);
      renderWithRouter(<HistoryPage />);

      await waitFor(() => {
        expect(screen.getByText("report.csv")).toBeInTheDocument();
      });

      const clearButton = screen.getByText("Очистить всё");
      fireEvent.click(clearButton);

      expect(historyService.clear).toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.getByText("История загрузок пуста")).toBeInTheDocument();
      });
    });

    it('should navigate to generate page on click "Generate More"', async () => {
      vi.mocked(historyService.getAll).mockReturnValue([]);
      renderWithRouter(<HistoryPage />);

      const generateButton = screen.getByText("Сгенерировать больше");
      fireEvent.click(generateButton);

      expect(mockNavigate).toHaveBeenCalledWith("/generate");
    });
  });

  describe("Data Formatting", () => {
    it("should format dates correctly", async () => {
      const testData = [
        {
          ...mockHistoryData[0],
          date: "2024-12-25T15:30:45Z",
        },
      ];
      vi.mocked(historyService.getAll).mockReturnValue(testData);

      renderWithRouter(<HistoryPage />);

      await waitFor(() => {
        // Should display formatted date
        expect(screen.getByText("25.12.2024")).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should correctly handle history loading errors", async () => {
      vi.mocked(historyService.getAll).mockImplementation(() => {
        throw new Error("Service error");
      });

      expect(() => renderWithRouter(<HistoryPage />)).not.toThrow();
    });

    it("should correctly handle missing selectedHistoryEntry in modal", async () => {
      vi.mocked(historyService.getAll).mockReturnValue([]);
      renderWithRouter(<HistoryPage />);

      // Принудительно открываем модальное окно без selectedHistoryEntry
      const { openModal } = useHistoryStore.getState();
      openModal(null!);

      await waitFor(() => {
        expect(
          screen.getByText(/Здесь.*появятся хайлайты/),
        ).toBeInTheDocument();
      });
    });
  });
});
