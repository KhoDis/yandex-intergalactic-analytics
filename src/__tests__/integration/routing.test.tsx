import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { App } from "../../App.tsx";
import { describe, it, expect } from "vitest";

describe("App routing", () => {
  it("renders UploadPage on '/'", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText(/CSV Аналитик/i)).toBeInTheDocument();
  });

  it("renders GeneratePage on '/generate'", () => {
    render(
      <MemoryRouter initialEntries={["/generate"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText(/CSV Генератор/i)).toBeInTheDocument();
  });

  it("renders HistoryPage on '/history'", () => {
    render(
      <MemoryRouter initialEntries={["/history"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText(/История загрузок пуста/i)).toBeInTheDocument();
  });
});
