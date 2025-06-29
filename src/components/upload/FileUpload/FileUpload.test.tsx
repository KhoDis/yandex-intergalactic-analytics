import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import { FileUpload } from "./FileUpload.tsx";

describe("FileUpload", () => {
  it("displays the filename when status is 'uploaded'", () => {
    const testFile = new File(["data"], "report.csv");

    render(
      <FileUpload
        file={testFile}
        status="uploaded"
        onUpload={() => {}}
        onReset={() => {}}
        setStatus={() => {}}
      />,
    );

    expect(screen.getByText("report.csv")).toBeInTheDocument();
  });
});
