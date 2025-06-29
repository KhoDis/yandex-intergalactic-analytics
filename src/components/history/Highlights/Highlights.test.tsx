import { render, screen } from "@testing-library/react";
import { Highlights } from "./Highlights";
import { vi, expect, describe, it } from "vitest";
import type { RawHighlight } from "../../../types";
import type { HighlightCardProps } from "./HighlightCard.tsx";

vi.mock("../utils/mapRawHighlightToDisplayList", () => ({
  mapRawHighlightToDisplayList: vi.fn((raw) => [
    { value: `${raw.total_spend_galactic}`, label: "общие расходы" },
    { value: `${raw.rows_affected}`, label: "количество записей" },
  ]),
}));

vi.mock("../components/history/Highlight/HighlightCard", () => ({
  HighlightCard: ({
    value,
    label,
    className,
  }: HighlightCardProps & { className?: string }) => (
    <div className={className} data-testid="highlight-card">
      <span>{value}</span>
      <span>{label}</span>
    </div>
  ),
}));

describe("Highlights", () => {
  it("should render no highlights message when highlight is null", () => {
    render(<Highlights highlight={null} />);

    expect(screen.getByText(/Здесь/)).toBeInTheDocument();
    expect(screen.getByText(/появятся хайлайты/)).toBeInTheDocument();
  });

  it("should render highlight cards when highlight data is provided", () => {
    const mockHighlight: RawHighlight = {
      total_spend_galactic: 1500,
      rows_affected: 200,
      less_spent_at: 50,
      big_spent_at: 200,
      less_spent_value: 10,
      big_spent_value: 500,
      average_spend_galactic: 100,
      big_spent_civ: "humans",
      less_spent_civ: "blobs",
    };

    render(<Highlights highlight={mockHighlight} />);

    const highlightCards = screen.getAllByTestId("highlight-card");
    expect(highlightCards).toHaveLength(8);

    expect(screen.getByText("1500")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });
});
