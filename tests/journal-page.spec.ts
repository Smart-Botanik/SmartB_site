import { test, expect } from "@playwright/test";

test.describe("Journal Page (/journal)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/journal");
    await page.waitForSelector("h1");
  });

  test("Default state and structure validation", async ({ page }) => {
    // 1. Main Heading
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    const headingText = await heading.innerText();
    expect(headingText.length).toBeGreaterThan(0);

    // 2. News Section Header & Navigation Buttons
    const newsHeader = page.locator("h2", { hasText: "Новости и обновления" });
    await expect(newsHeader).toBeVisible();

    const prevBtn = page.locator('button[aria-label="Предыдущая новость"]');
    const nextBtn = page.locator('button[aria-label="Следующая новость"]');
    // Navigation buttons are visible on sm screens and up
    if (await prevBtn.isVisible()) {
      await expect(prevBtn).toBeEnabled();
      await expect(nextBtn).toBeEnabled();
    }

    // 3. Featured Article Card
    const newsSection = page.locator("section", { hasText: "Новости и обновления" });
    const featuredLink = newsSection.locator("a").first();
    await expect(featuredLink).toBeVisible();
    await expect(featuredLink).toHaveAttribute("href");

    // 4. Articles Grid
    const articleCards = newsSection.locator("a");
    const count = await articleCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Sidebar live feed and community stats validation", async ({ page }) => {
    const sidebar = page.locator("aside", { hasText: "Лента циклов" });
    await expect(sidebar).toBeVisible();

    // Live Badge
    const liveBadge = sidebar.getByText("Live", { exact: true });
    await expect(liveBadge).toBeVisible();

    // Feed Articles
    const feedEntries = sidebar.locator("article");
    const feedCount = await feedEntries.count();
    expect(feedCount).toBeGreaterThan(0);

    // Community Stats Block
    const statsHeader = sidebar.locator("h6", { hasText: "Пульс сообщества" });
    await expect(statsHeader).toBeVisible();
  });
});
