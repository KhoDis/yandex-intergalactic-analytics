import { render, screen, fireEvent } from "@testing-library/react";
import { FileStatus } from "./FileStatus";
import { vi, describe, expect, it, beforeEach } from "vitest";

vi.mock("../../../assets/Spinner", () => ({
  Spinner: ({ className }: { className: string }) => (
    <div className={className} data-testid="spinner">
      Loading...
    </div>
  ),
}));

vi.mock("../CancelButton/CancelButton", () => ({
  CancelButton: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} data-testid="cancel-button">
      Cancel
    </button>
  ),
}));

describe("FileStatus", () => {
  const defaultProps = {
    status: "uploaded" as const,
    buttonText: "test.csv",
    onReset: vi.fn(),
    uploadText: "файл загружен!",
    processingText: "идёт парсинг файла",
    doneText: "готово!",
    errorText: "упс, не то...",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render uploaded status correctly", () => {
    render(<FileStatus {...defaultProps} />);

    expect(screen.getByText("test.csv")).toBeInTheDocument();
    expect(screen.getByText("файл загружен!")).toBeInTheDocument();
    expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
  });

  it("should render processing status with spinner", () => {
    render(<FileStatus {...defaultProps} status="processing" />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.getByText("идёт парсинг файла")).toBeInTheDocument();
    expect(screen.queryByTestId("cancel-button")).not.toBeInTheDocument();
  });

  it("should render done status", () => {
    render(<FileStatus {...defaultProps} status="done" />);

    expect(screen.getByText("test.csv")).toBeInTheDocument();
    expect(screen.getByText("готово!")).toBeInTheDocument();
  });

  it("should render error status", () => {
    render(<FileStatus {...defaultProps} status="error" />);

    expect(screen.getByText("test.csv")).toBeInTheDocument();
    expect(screen.getByText("упс, не то...")).toBeInTheDocument();
  });

  it("should call onReset when cancel button is clicked", () => {
    render(<FileStatus {...defaultProps} />);

    fireEvent.click(screen.getByTestId("cancel-button"));

    expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
  });
});
