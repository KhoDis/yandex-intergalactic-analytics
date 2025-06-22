import type { RawHighlight } from "../types";

export const uploadService = {
  async streamToHighlights(
    stream: ReadableStream<Uint8Array>,
    onHighlight: (highlight: RawHighlight) => void,
  ) {
    const reader = stream.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let boundary;
      while ((boundary = buffer.indexOf("\n")) >= 0) {
        const chunk = buffer.slice(0, boundary).trim();
        buffer = buffer.slice(boundary + 1);
        if (!chunk) continue;

        try {
          const json = JSON.parse(chunk);
          if (this.isValidHighlight(json)) {
            onHighlight(json);
          } else {
            console.warn("Invalid highlight object:", json);
            throw new Error("Invalid highlight object");
          }
        } catch (err) {
          console.error("Bad JSON chunk:", chunk, err);
          throw err;
        }
      }
    }
  },
  isValidHighlight(data: unknown): data is RawHighlight {
    // {"total_spend_galactic":0,"rows_affected":0,"average_spend_galactic":0}
    // Special case scenario
    if (
      typeof data === "object" &&
      data !== null &&
      "total_spend_galactic" in data &&
      "rows_affected" in data &&
      "average_spend_galactic" in data &&
      typeof data.total_spend_galactic === "number" &&
      typeof data.rows_affected === "number" &&
      typeof data.average_spend_galactic === "number"
    ) {
      return true;
    }
    return (
      typeof data === "object" &&
      data !== null &&
      "total_spend_galactic" in data &&
      "rows_affected" in data &&
      "less_spent_at" in data &&
      "big_spent_at" in data &&
      "less_spent_value" in data &&
      "big_spent_value" in data &&
      "average_spend_galactic" in data &&
      "big_spent_civ" in data &&
      "less_spent_civ" in data &&
      typeof data.total_spend_galactic === "number" &&
      typeof data.rows_affected === "number" &&
      typeof data.less_spent_at === "number" &&
      typeof data.big_spent_at === "number" &&
      typeof data.less_spent_value === "number" &&
      typeof data.big_spent_value === "number" &&
      typeof data.average_spend_galactic === "number" &&
      typeof data.big_spent_civ === "string" &&
      typeof data.less_spent_civ === "string"
    );
  },
};
