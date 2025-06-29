import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GeneratePage } from "../../pages/GeneratePage/GeneratePage";
import * as client from "../../api/client";
import { MemoryRouter } from "react-router-dom";
import { useGenerateStore } from "../../stores/useGenerateStore";

describe("GeneratePage integration", () => {
  beforeEach(() => {
    useGenerateStore.getState().reset();
  });

  it("renders generate button initially", () => {
    render(
      <MemoryRouter>
        <GeneratePage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/начать генерацию/i)).toBeInTheDocument();
  });

  it("shows error on generation failure", async () => {
    vi.spyOn(client, "report").mockRejectedValueOnce(new Error("Сервер упал"));

    render(
      <MemoryRouter>
        <GeneratePage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/начать генерацию/i));

    expect(
      await screen.findByText(/идёт процесс генерации/i),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/ошибка генерации/i)).toBeInTheDocument();
    });
  });

  it("resets state on cancel", async () => {
    useGenerateStore.setState({ status: "done", error: null });

    render(
      <MemoryRouter>
        <GeneratePage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("cancel-button"));

    await waitFor(() => {
      expect(screen.getByText(/начать генерацию/i)).toBeInTheDocument();
    });
  });
});
