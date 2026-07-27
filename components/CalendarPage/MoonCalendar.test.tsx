import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MoonCalendar } from "./MoonCalendar";

// Define placeholders to resolve the promise manually
let resolveCalendarDays: (value: any[]) => void;
let calendarDaysPromise: Promise<any[]>;

// Mock the calendar API
vi.mock("@/lib/calendar-api", () => {
  return {
    fetchPublishedCalendarDays: vi.fn(() => {
      calendarDaysPromise = new Promise((resolve) => {
        resolveCalendarDays = resolve;
      });
      return calendarDaysPromise;
    }),
    fetchPublishedCalendarDay: vi.fn(() => Promise.resolve(null)),
  };
});

describe("MoonCalendar Default Selection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should select 'Все культуры' by default when no data is loaded yet, and keep it selected when data is loaded", async () => {
    // 1. Render the MoonCalendar component (e.g. as used on the home page)
    render(
      <MoonCalendar
        entries={[]}
        variant="compact"
        initialCultureTagKey=""
      />
    );

    // 2. Locate select dropdown and assert that "Все культуры" (value = "") is selected before data resolves
    const selectDropdown = screen.getByLabelText(
      "Культура для благоприятности",
    ) as HTMLSelectElement;
    expect(selectDropdown).toBeInTheDocument();
    expect(selectDropdown.value).toBe("");

    const checkedOption = selectDropdown.options[selectDropdown.selectedIndex];
    expect(checkedOption.textContent).toBe("Все культуры");

    // 3. Resolve the API call to simulate data loading completion
    await act(async () => {
      resolveCalendarDays([]);
      await calendarDaysPromise;
    });

    // 4. Assert that "Все культуры" remains selected after data loads
    expect(selectDropdown.value).toBe("");
    expect(
      selectDropdown.options[selectDropdown.selectedIndex].textContent,
    ).toBe("Все культуры");
  });
});
