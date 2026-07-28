import { test, expect } from "@playwright/test";

test("lunar calendar has 'Все культуры' selected by default on the home page", async ({ page }) => {
  // Navigate to the main page
  await page.goto("/");

  // Find the culture picker trigger button
  const trigger = page.locator(".moon-cal-culture-picker-trigger");
  await expect(trigger).toBeVisible();

  // Assert the selected label text contains "Все культуры"
  const label = trigger.locator(".moon-cal-culture-picker-label");
  await expect(label).toHaveText("Все культуры");

  // Verify that the calendar tone legend displays "Благоприятный" (which indicates all cultures, not a specific one)
  const legendItem = page.locator(".moon-cal-tone-legend li").first();
  await expect(legendItem).toHaveText("Благоприятный");
});
