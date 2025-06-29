import type { RawHighlight } from "../types";
import { numberToDate } from "./mapRawHighlightToDisplayList.ts";
import { mapRawHighlightToDisplayList } from "./mapRawHighlightToDisplayList.ts";
import { expect, describe, it } from "vitest";

describe("numberToDate", () => {
  it("should convert day 0 to 1 января", () => {
    expect(numberToDate(0)).toBe("1 январь");
  });

  it("should convert day 31 to 1 февраля", () => {
    expect(numberToDate(31)).toBe("1 февраль");
  });

  it("should convert day 364 to last day of year", () => {
    expect(numberToDate(364)).toBe("30 декабрь");
  });

  it("should throw error for negative numbers", () => {
    expect(() => numberToDate(-1)).toThrow("Number must be between 0 and 364");
  });

  it("should throw error for numbers > 364", () => {
    expect(() => numberToDate(365)).toThrow("Number must be between 0 and 364");
  });
});

describe("mapRawHighlightToDisplayList", () => {
  const mockRawHighlight: RawHighlight = {
    total_spend_galactic: 15000,
    rows_affected: 1000,
    less_spent_at: 50,
    big_spent_at: 200,
    less_spent_value: 100,
    big_spent_value: 9000,
    average_spend_galactic: 150,
    big_spent_civ: "humans",
    less_spent_civ: "blobs",
  };

  it("should map all fields correctly", () => {
    const result = mapRawHighlightToDisplayList(mockRawHighlight);

    expect(result).toHaveLength(8);
    expect(result[0]).toEqual({
      value: "15000",
      label: "общие расходы в галактических кредитах",
    });
    expect(result[1]).toEqual({
      value: "blobs",
      label: "цивилизация с минимальными расходами",
    });
  });

  it("should handle zero values", () => {
    const zeroHighlight: RawHighlight = {
      ...mockRawHighlight,
      total_spend_galactic: 0,
      rows_affected: 0,
    };

    const result = mapRawHighlightToDisplayList(zeroHighlight);
    expect(result[0].value).toBe("0");
    expect(result[2].value).toBe("0");
  });
});
