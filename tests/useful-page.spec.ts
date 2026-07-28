import { test, expect } from "@playwright/test";

test.describe("Useful Page (/useful)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/useful");
    await page.waitForSelector(".useful-feed-layout");
  });

  test("Default state validation", async ({ page }) => {
    // 1. Main Header Title
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("Интересное");

    // 2. Sidebar Filters exist
    const sidebar = page.locator(".useful-feed-sidebar");
    await expect(sidebar).toBeVisible();

    const allFilter = sidebar.locator("button", { hasText: "Все посты" });
    await expect(allFilter).toBeVisible();
    await expect(allFilter).toHaveAttribute("aria-pressed", "true");

    const guidesFilter = sidebar.locator("button", { hasText: "Гайды" });
    await expect(guidesFilter).toBeVisible();

    const photosFilter = sidebar.locator("button", { hasText: "Фото" });
    await expect(photosFilter).toBeVisible();

    const videosFilter = sidebar.locator("button", { hasText: "Видео" });
    await expect(videosFilter).toBeVisible();

    // 3. Feed List renders posts or empty state
    const feedMain = page.locator(".useful-feed-main");
    await expect(feedMain).toBeVisible();

    const feedList = page.locator(".useful-feed-list");
    const emptyState = page.locator(".useful-feed-empty");
    const hasList = await feedList.isVisible();
    const hasEmpty = await emptyState.isVisible();
    expect(hasList || hasEmpty).toBeTruthy();
  });

  test("Filter interactions on sidebar", async ({ page }) => {
    const sidebar = page.locator(".useful-feed-sidebar");
    const allFilter = sidebar.locator("button", { hasText: "Все посты" });
    const guidesFilter = sidebar.locator("button", { hasText: "Гайды" });

    // Click 'Гайды' filter
    await guidesFilter.click();
    await expect(guidesFilter).toHaveAttribute("aria-pressed", "true");
    await expect(allFilter).toHaveAttribute("aria-pressed", "false");

    // Click back to 'Все посты'
    await allFilter.click();
    await expect(allFilter).toHaveAttribute("aria-pressed", "true");
    await expect(guidesFilter).toHaveAttribute("aria-pressed", "false");
  });

  test("Mobile filter chips interaction", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileFilters = page.locator(".useful-feed-mobile-filters");
    await expect(mobileFilters).toBeVisible();

    const firstChip = mobileFilters.locator("button").first();
    await expect(firstChip).toBeVisible();
    await firstChip.click();
    await expect(firstChip).toHaveAttribute("aria-pressed", "true");
  });
});
