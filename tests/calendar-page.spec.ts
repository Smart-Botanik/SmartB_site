import { test, expect } from "@playwright/test";

test.describe("Calendar Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the calendar page
    await page.goto("/calendar");
    // Wait for the calendar root element to be attached to ensure page is rendering
    await page.waitForSelector(".moon-cal-root");
    // A brief wait for React hydration to complete
    await page.waitForTimeout(1000);
  });

  test("Default state validation", async ({ page }) => {
    // 1. Все культуры (Default culture picker label)
    const pickerTrigger = page.locator(".moon-cal-culture-picker-trigger");
    await expect(pickerTrigger).toBeVisible();
    await expect(pickerTrigger.locator(".moon-cal-culture-picker-label")).toHaveText("Все культуры");

    // 2. Сетка (Default view mode: grid)
    // Check that the view toggle has "Сетка" button as active/pressed
    const gridBtn = page.locator(".moon-cal-view-toggle button", { hasText: "Сетка" });
    await expect(gridBtn).toHaveAttribute("aria-pressed", "true");

    // 3. Месяц по дефолту (Default month)
    // We can check that the month label matches the current month in Russian (e.g. "Июль 2026")
    const now = new Date();
    // Helper to get Russian month title
    const monthsRu = [
      "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];
    const expectedMonthLabel = `${monthsRu[now.getMonth()]} ${now.getFullYear()}`;
    const monthLabel = page.locator(".moon-cal-month-label");
    await expect(monthLabel).toHaveText(expectedMonthLabel);

    // 4. Дефолтный день на календаре (Default day style/existence)
    // Verify there is a cell marked as today
    const todayCell = page.locator('.moon-cal-cell.is-today, tr[data-today="true"]');
    await expect(todayCell.first()).toBeVisible();

    // 5. Проверить текстовый контентный блок (Text content block validation)
    const guideSection = page.locator(".moon-cal-guide");
    await expect(guideSection).toBeVisible();
    await expect(guideSection.locator("#lunar-guide-title")).toBeVisible();
  });

  test("Interactions: select cell, change month, change culture, toggle view mode", async ({ page }) => {
    // Wait for hydration by opening and closing the culture picker
    const pickerTrigger = page.locator(".moon-cal-culture-picker-trigger");
    await expect(pickerTrigger).toBeVisible();
    await pickerTrigger.click();
    const optionsPanel = page.locator(".moon-cal-culture-picker-panel");
    await expect(optionsPanel).toBeVisible();
    await pickerTrigger.click();
    await expect(optionsPanel).not.toBeVisible();

    // 1. Select a cell (Выбрать cell)
    // Find a day cell inside the current month (not class "is-outside")
    const activeCells = page.locator('.moon-cal-cell:not(.is-outside)');
    const firstCell = activeCells.first();
    await expect(firstCell).toBeVisible();
    
    // Click on the first active cell
    await firstCell.click();
    
    // Verify it is selected
    await expect(firstCell).toHaveAttribute("aria-selected", "true");
    
    // Verify that the day info panel is displayed
    const dayPanel = page.locator('[aria-label="Информация о дне"]');
    await expect(dayPanel).toBeVisible();

    // Close the panel
    const closeBtn = dayPanel.locator('[aria-label="Закрыть"]');
    await closeBtn.click();
    await expect(dayPanel).not.toBeVisible();

    // 2. Сменить месяц (Change month)
    const prevMonthBtn = page.locator('button[aria-label="Предыдущий месяц"]');
    const nextMonthBtn = page.locator('button[aria-label="Следующий месяц"]');
    const monthLabel = page.locator(".moon-cal-month-label");
    
    const initialMonthText = await monthLabel.innerText();
    
    // Go to previous month
    await prevMonthBtn.click();
    const prevMonthText = await monthLabel.innerText();
    expect(prevMonthText).not.toBe(initialMonthText);
    
    // Go back using next month
    await nextMonthBtn.click();
    await expect(monthLabel).toHaveText(initialMonthText);

    // 3. Сменить культуру (Change culture)
    await pickerTrigger.click();
    await expect(optionsPanel).toBeVisible();
    
    // Select one culture option, e.g. "Томат"
    const tomatoOption = optionsPanel.locator('button', { hasText: "Томат" });
    await expect(tomatoOption).toBeVisible();
    await tomatoOption.click();
    
    // Verify the label has updated
    await expect(pickerTrigger.locator(".moon-cal-culture-picker-label")).toHaveText("Томаты");

    // 4. Выбор Сетка | Таблица (Toggle view: Grid / Table)
    const listBtn = page.locator(".moon-cal-view-toggle button", { hasText: "Таблица" });
    const gridBtn = page.locator(".moon-cal-view-toggle button", { hasText: "Сетка" });
    
    // Switch to table
    await listBtn.click();
    await expect(listBtn).toHaveAttribute("aria-pressed", "true");
    
    // Verify table is visible and grid is not
    await expect(page.locator(".moon-cal-table-wrap")).toBeVisible();
    await expect(page.locator(".moon-cal-grid")).not.toBeVisible();
    
    // Switch back to grid
    await gridBtn.click();
    await expect(gridBtn).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".moon-cal-grid")).toBeVisible();
    await expect(page.locator(".moon-cal-table-wrap")).not.toBeVisible();
  });
});
