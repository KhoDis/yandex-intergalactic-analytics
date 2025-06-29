import { test, expect } from "@playwright/test";

test("user uploads CSV and sees highlights", async ({ page }) => {
  await page.goto("http://localhost:5173");
  const input = await page.locator('input[type="file"]');
  await input.setInputFiles("fixtures/report.csv");

  await page.getByText("Отправить").click();

  await expect(page.getByText(/общие расходы/i)).toBeVisible();
});
