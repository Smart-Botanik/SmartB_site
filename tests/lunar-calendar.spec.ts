import { test, expect } from "@playwright/test";

test("lunar calendar has 'Все культуры' selected by default on the home page", async ({ page }) => {
  // Navigate to the main page
  await page.goto("/");

  // Find the lunar calendar select element by its aria-label
  const selectDropdown = page.getByLabel("Культура для благоприятности");
  await expect(selectDropdown).toBeVisible();

  // Assert that its default selected value is empty string (CULTURE_ALL)
  await expect(selectDropdown).toHaveValue("");

  // Assert the selected option's text is "Все культуры"
  const selectedText = await selectDropdown.locator("option:checked").textContent();
  expect(selectedText?.trim()).toBe("Все культуры");

  // Verify that the calendar tone legend displays "Благоприятный" (which indicates all cultures, not a specific one)
  const legendItem = page.locator(".moon-cal-tone-legend li").first();
  await expect(legendItem).toHaveText("Благоприятный");
});
