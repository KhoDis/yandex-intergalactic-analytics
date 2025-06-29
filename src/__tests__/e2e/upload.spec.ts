import { test, expect } from "@playwright/test";

test("should upload CSV and display highlights", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // Upload file
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByText("Загрузить файл").click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles("fixtures/report.csv");

  await expect(page.getByText("файл загружен")).toBeVisible();

  await page.route("**/aggregate?*", async (route) => {
    const mockStream = [
      JSON.stringify({
        total_spend_galactic: 12345,
        rows_affected: 16,
        less_spent_at: 28,
        big_spent_at: 165,
        less_spent_value: 1277,
        big_spent_value: 9067,
        average_spend_galactic: 2455,
        big_spent_civ: "blobs",
        less_spent_civ: "humans",
      }) + "\n",
    ];
    const stream = new ReadableStream({
      start(controller) {
        mockStream.forEach((chunk) =>
          controller.enqueue(new TextEncoder().encode(chunk)),
        );
        controller.close();
      },
    });
    await route.fulfill({
      status: 200,
      body: await new Response(stream).text(),
    });
  });

  // Click
  await page.getByRole("button", { name: "Отправить" }).click();

  // Wait
  await expect(page.getByText("готово")).toBeVisible({
    timeout: 10000,
  });

  // Check the total spend
  await expect(page.getByText("12345")).toBeVisible();
});
