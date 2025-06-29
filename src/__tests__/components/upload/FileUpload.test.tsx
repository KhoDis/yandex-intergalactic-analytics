import { render, screen, fireEvent } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import { FileUpload } from "../../../components/upload/FileUpload/FileUpload.tsx";

describe("FileUpload", () => {
  it("displays the filename when status is 'uploaded'", () => {
    const testFile = new File(["data"], "test.csv");

    render(
      <FileUpload
        file={testFile}
        status="uploaded"
        onUpload={() => {}}
        onReset={() => {}}
        setStatus={() => {}}
      />,
    );

    expect(screen.getByText("test.csv")).toBeInTheDocument();
  });
});
