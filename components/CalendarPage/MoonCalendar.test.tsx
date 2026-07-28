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

  it("should show 'Все культуры' by default when no data is loaded yet, and keep it selected when data is loaded", async () => {
    // 1. Render the MoonCalendar component (e.g. as used on the home page)
    render(
      <MoonCalendar
        entries={[]}
        variant="compact"
        initialCultureTagKey=""
      />
    );

    // 2. Locate the custom culture picker trigger button and verify it shows "Все культуры"
    const pickerButton = screen.getByRole("button", {
      name: /Культура: Все культуры/i,
    });
    expect(pickerButton).toBeInTheDocument();

    // 3. Resolve the API call to simulate data loading completion
    await act(async () => {
      resolveCalendarDays([]);
      await calendarDaysPromise;
    });

    // 4. Assert that the picker still shows "Все культуры" after data loads
    expect(
      screen.getByRole("button", { name: /Культура: Все культуры/i })
    ).toBeInTheDocument();
  });
});
