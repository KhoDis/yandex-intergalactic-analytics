import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import { aggregate } from "../../api/client.ts";
import { historyService } from "../../services/historyService.ts";
import { UploadPage } from "../../pages/UploadPage/UploadPage.tsx";
import { useUploadStore } from "../../stores/useUploadStore.ts";

vi.mock("../../api/client");
vi.mock("../../services/historyService");

const createMockStream = (chunks: string[]) => {
  let index = 0;
  return new ReadableStream({
    start(controller) {
      const pump = () => {
        if (index < chunks.length) {
          controller.enqueue(new TextEncoder().encode(chunks[index] + "\n"));
          index++;
          setTimeout(pump, 10);
        } else {
          controller.close();
        }
      };
      pump();
    },
  });
};

const mockHighlightData = {
  total_spend_galactic: 50000,
  rows_affected: 16,
  less_spent_at: 13,
  big_spent_at: 342,
  less_spent_value: 1277,
  big_spent_value: 9067,
  average_spend_galactic: 3125,
  big_spent_civ: "blobs",
  less_spent_civ: "humans",
};

describe("Upload integration tests", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    useUploadStore.getState().setFile(null);
    useUploadStore.getState().setStatus("idle");
    useUploadStore.getState().setHighlight(null);
    useUploadStore.getState().clearHighlights();

    vi.clearAllMocks();

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => "[]"),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Full file upload flow", () => {
    it("should successfully upload file and show results", async () => {
      // Arrange
      const csvContent = "id,civ,developer_id,date,spend\n1,blobs,123,356,2365";
      const file = new File([csvContent], "test.csv", { type: "text/csv" });

      const mockStream = createMockStream([JSON.stringify(mockHighlightData)]);
      vi.mocked(aggregate).mockResolvedValue(mockStream);
      vi.mocked(historyService.add).mockImplementation(() => {});

      render(<UploadPage />);

      // Upload file
      const fileInput = screen.getByLabelText(/загрузить файл/i);
      await user.upload(fileInput, file);

      // Check that file was uploaded
      expect(screen.getByText("test.csv")).toBeInTheDocument();
      expect(screen.getByText(/файл загружен!/i)).toBeInTheDocument();

      // Send file by clicking a button
      const submitButton = screen.getByRole("button", { name: /отправить/i });
      await user.click(submitButton);

      // Make sure that result is shown
      await waitFor(() => {
        expect(screen.getByText(/готово!/i)).toBeInTheDocument();
      });

      // Make sure that result is correct
      expect(screen.getByText("50000")).toBeInTheDocument();
      expect(
        screen.getByText("общие расходы в галактических кредитах"),
      ).toBeInTheDocument();
      expect(screen.getByText("blobs")).toBeInTheDocument();
      expect(screen.getByText("16")).toBeInTheDocument();

      // Check that highlight was saved
      expect(historyService.add).toHaveBeenCalledWith({
        date: expect.any(String),
        fileName: "test.csv",
        highlight: mockHighlightData,
        status: "success",
      });
    });

    it("should handle upload error", async () => {
      // Arrange
      const csvContent = "invalid,csv,content";
      const file = new File([csvContent], "invalid.csv", { type: "text/csv" });

      vi.mocked(aggregate).mockRejectedValue(new Error("Upload failed"));
      vi.mocked(historyService.add).mockImplementation(() => {});

      render(<UploadPage />);

      // Act
      const fileInput = screen.getByLabelText(/загрузить файл/i);
      await user.upload(fileInput, file);

      const submitButton = screen.getByRole("button", { name: /отправить/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/упс, не то.../i)).toBeInTheDocument();
      });

      // Check that error was saved
      expect(historyService.add).toHaveBeenCalledWith({
        date: expect.any(String),
        fileName: "invalid.csv",
        highlight: null,
        status: "error",
        error: "Upload failed",
      });

      // Check that no highlight was saved
      expect(screen.getByText(/появятся хайлайты/i)).toBeInTheDocument();
    });
  });

  describe("Drag & Drop", () => {
    it("should handle drag and drop", async () => {
      // Prepare
      const csvContent = "id,civ,developer_id,date,spend\n1,blobs,123,356,2365";
      const file = new File([csvContent], "dropped.csv", { type: "text/csv" });

      render(<UploadPage />);

      const dropZone = screen.getByText(/или перетащите сюда/i).closest("div");

      // Simulate drag enter
      fireEvent.dragEnter(dropZone!, {
        dataTransfer: { files: [file] },
      });

      // Expect status to be "choosing"
      expect(useUploadStore.getState().status).toBe("choosing");

      // Simulate drag drop
      fireEvent.drop(dropZone!, {
        dataTransfer: { files: [file] },
      });

      // File should be uploaded
      await waitFor(() => {
        expect(useUploadStore.getState().file?.name).toBe("dropped.csv");
        expect(useUploadStore.getState().status).toBe("uploaded");
      });

      expect(screen.getByText("dropped.csv")).toBeInTheDocument();
    });

    it("should restore previous status on drag leave", async () => {
      // Preparation
      const store = useUploadStore.getState();
      store.setStatus("done");

      render(<UploadPage />);

      const dropZone = screen.getByText(/или перетащите сюда/i).closest("div");

      // Act
      fireEvent.dragEnter(dropZone!);
      expect(useUploadStore.getState().status).toBe("choosing");

      fireEvent.dragLeave(dropZone!);

      expect(useUploadStore.getState().status).toBe("done");
    });
  });

  describe("Reset state", () => {
    it("should reset state on cancel", async () => {
      const csvContent = "id,civ,developer_id,date,spend\n1,blobs,123,356,2365";
      const file = new File([csvContent], "test.csv", { type: "text/csv" });

      render(<UploadPage />);

      // Upload file
      const fileInput = screen.getByLabelText(/загрузить файл/i);
      await user.upload(fileInput, file);

      // Click cancel
      const cancelButton = screen.getByTestId("cancel-button");
      await user.click(cancelButton);

      expect(useUploadStore.getState().file).toBe(null);
      expect(useUploadStore.getState().status).toBe("idle");
      expect(useUploadStore.getState().highlight).toBe(null);
      expect(screen.getByText(/появятся хайлайты/i)).toBeInTheDocument();
      expect(screen.getByText(/загрузить файл/i)).toBeInTheDocument();
    });
  });

  describe("Stream upload", () => {
    it("should handle stream data and update highlights", async () => {
      const csvContent = "id,civ,developer_id,date,spend\n1,blobs,123,356,2365";
      const file = new File([csvContent], "stream.csv", { type: "text/csv" });

      // Create mock stream
      const partialData1 = {
        ...mockHighlightData,
        total_spend_galactic: 25000,
      };
      const partialData2 = {
        ...mockHighlightData,
        total_spend_galactic: 50000,
      };

      const mockStream = createMockStream([
        JSON.stringify(partialData1),
        JSON.stringify(partialData2),
      ]);

      vi.mocked(aggregate).mockResolvedValue(mockStream);
      vi.mocked(historyService.add).mockImplementation(() => {});

      render(<UploadPage />);

      // Start the process
      const fileInput = screen.getByLabelText(/загрузить файл/i);
      await user.upload(fileInput, file);

      const submitButton = screen.getByRole("button", { name: /отправить/i });
      await user.click(submitButton);

      // Check that data is shown
      await waitFor(() => {
        expect(screen.getByText(/готово!/i)).toBeInTheDocument();
      });

      // Final result should be 50000
      expect(screen.getByText("50000")).toBeInTheDocument();
    });

    it("should handle invalid JSON", async () => {
      const csvContent = "id,civ,developer_id,date,spend\n1,blobs,123,356,2365";
      const file = new File([csvContent], "invalid-stream.csv", {
        type: "text/csv",
      });

      const mockStream = createMockStream([
        "invalid json data",
        JSON.stringify(mockHighlightData),
      ]);

      vi.mocked(aggregate).mockResolvedValue(mockStream);
      vi.mocked(historyService.add).mockImplementation(() => {});

      render(<UploadPage />);

      // Act
      const fileInput = screen.getByLabelText(/загрузить файл/i);
      await user.upload(fileInput, file);

      const submitButton = screen.getByRole("button", { name: /отправить/i });
      await user.click(submitButton);

      // Show the error
      await waitFor(() => {
        expect(screen.getByText(/упс, не то.../i)).toBeInTheDocument();
      });

      expect(historyService.add).toHaveBeenCalledWith({
        date: expect.any(String),
        fileName: "invalid-stream.csv",
        highlight: null,
        status: "error",
        error: expect.stringContaining("Unexpected token"),
      });
    });
  });

  describe("Состояние загрузки", () => {
    it("должен показывать спиннер во время обработки", async () => {
      // Arrange
      const csvContent = "id,civ,developer_id,date,spend\n1,blobs,123,356,2365";
      const file = new File([csvContent], "processing.csv", {
        type: "text/csv",
      });

      // Создаем стрим, который будет долго обрабатываться
      let resolveStream: (value: Promise<ReadableStream<Uint8Array>>) => void;
      const streamPromise = new Promise((resolve) => {
        resolveStream = resolve;
      });

      vi.mocked(aggregate).mockReturnValue(
        streamPromise as Promise<ReadableStream<Uint8Array>>,
      );

      render(<UploadPage />);

      const fileInput = screen.getByLabelText(/загрузить файл/i);
      await user.upload(fileInput, file);

      // Act
      const submitButton = screen.getByRole("button", { name: /отправить/i });
      await user.click(submitButton);

      // Assert - проверяем состояние загрузки
      expect(screen.getByText(/идёт парсинг файла/i)).toBeInTheDocument();
      expect(useUploadStore.getState().isLoading).toBe(true);

      // Завершаем обработку
      const mockStream = createMockStream([JSON.stringify(mockHighlightData)]);
      resolveStream!(Promise.resolve(mockStream));

      await waitFor(() => {
        expect(useUploadStore.getState().isLoading).toBe(false);
      });
    });
  });
});
