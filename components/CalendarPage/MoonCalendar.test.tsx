import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { MoonCalendar } from "./MoonCalendar";
import { LunarGuide } from "./LunarGuide";
import { DEFAULT_LUNAR_GUIDE } from "@/lib/calendar-sections";
import { monthTitleRu } from "@/lib/moon-phase";

// Mock the calendar API
vi.mock("@/lib/calendar-api", () => {
  return {
    fetchPublishedCalendarDays: vi.fn(() => Promise.resolve([])),
    fetchPublishedCalendarDay: vi.fn(() => Promise.resolve(null)),
  };
});

async function renderMoonCalendar(props: React.ComponentProps<typeof MoonCalendar>) {
  let result: ReturnType<typeof render>;
  await act(async () => {
    result = render(<MoonCalendar {...props} />);
  });
  return result!;
}

describe("MoonCalendar - Состояние по дефолту", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("1.1 Отображает 'Все культуры' по дефолту", async () => {
    await renderMoonCalendar({
      entries: [],
      variant: "full",
      initialCultureTagKey: "",
    });

    const pickerButton = screen.getByRole("button", {
      name: /Культура: Все культуры/i,
    });
    expect(pickerButton).toBeInTheDocument();
  });

  it("1.2 Включает режим 'Сетка' по дефолту", async () => {
    await renderMoonCalendar({ entries: [], variant: "full" });

    const gridBtn = screen.getByRole("button", { name: "Сетка" });
    expect(gridBtn).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector(".moon-cal-grid")).toBeInTheDocument();
    expect(
      document.querySelector(".moon-cal-table-wrap")
    ).not.toBeInTheDocument();
  });

  it("1.3 Отображает дефолтный (текущий) месяц и год", async () => {
    const now = new Date();
    const expectedMonthText = monthTitleRu(now.getFullYear(), now.getMonth());

    await renderMoonCalendar({ entries: [], variant: "full" });

    const monthLabel = document.querySelector(".moon-cal-month-label");
    expect(monthLabel).toHaveTextContent(expectedMonthText);
  });

  it("1.4 Подсвечивает дефолтный (текущий) день на календаре", async () => {
    await renderMoonCalendar({ entries: [], variant: "full" });

    const todayCell = document.querySelector(".moon-cal-cell.is-today");
    expect(todayCell).toBeInTheDocument();
  });

  it("1.5 Проверяет текстовый контентный блок (LunarGuide)", async () => {
    await act(async () => {
      render(<LunarGuide guide={DEFAULT_LUNAR_GUIDE} />);
    });

    expect(
      screen.getByRole("heading", { name: DEFAULT_LUNAR_GUIDE.title })
    ).toBeInTheDocument();
    expect(screen.getByText("Новолуние")).toBeInTheDocument();
    expect(screen.getByText("Ещё правила")).toBeInTheDocument();
    expect(screen.getByText("Знаки зодиака для посева")).toBeInTheDocument();
  });
});

describe("MoonCalendar - Интерактивность", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("2.1 Выбрать cell: позволяет выбрать день и открыть/закрыть панель с подробностями", async () => {
    await renderMoonCalendar({ entries: [], variant: "full" });

    const activeCells = document.querySelectorAll(
      ".moon-cal-cell:not(.is-outside)"
    );
    expect(activeCells.length).toBeGreaterThan(0);

    const firstCell = activeCells[0] as HTMLElement;
    await act(async () => {
      fireEvent.click(firstCell);
    });

    expect(firstCell).toHaveAttribute("aria-selected", "true");

    const dayPanel = screen.getByLabelText("Информация о дне");
    expect(dayPanel).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Закрыть" });
    await act(async () => {
      fireEvent.click(closeBtn);
    });

    expect(
      screen.queryByLabelText("Информация о дне")
    ).not.toBeInTheDocument();
  });

  it("2.2 Сменить месяц: переключение на предыдущий и следующий месяц", async () => {
    const now = new Date();
    const currentMonthText = monthTitleRu(now.getFullYear(), now.getMonth());

    await renderMoonCalendar({ entries: [], variant: "full" });

    const monthLabel = document.querySelector(".moon-cal-month-label");
    expect(monthLabel).toHaveTextContent(currentMonthText);

    const prevBtn = screen.getByRole("button", { name: "Предыдущий месяц" });
    await act(async () => {
      fireEvent.click(prevBtn);
    });

    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthText = monthTitleRu(
      prevMonthDate.getFullYear(),
      prevMonthDate.getMonth()
    );
    expect(monthLabel).toHaveTextContent(prevMonthText);

    const nextBtn = screen.getByRole("button", { name: "Следующий месяц" });
    await act(async () => {
      fireEvent.click(nextBtn);
    });

    expect(monthLabel).toHaveTextContent(currentMonthText);
  });

  it("2.3 Сменить культуру: выбор культуры изменяет метку выбора", async () => {
    await renderMoonCalendar({
      entries: [],
      variant: "full",
      initialCultureTagKey: "",
    });

    const pickerTrigger = screen.getByRole("button", {
      name: /Культура: Все культуры/i,
    });
    await act(async () => {
      fireEvent.click(pickerTrigger);
    });

    const optionsPanel = screen.getByRole("listbox", {
      name: "Выберите культуру",
    });
    expect(optionsPanel).toBeInTheDocument();

    const tomatoChip = screen.getByRole("option", { name: /Томат/i });
    await act(async () => {
      fireEvent.click(tomatoChip);
    });

    expect(
      screen.getByRole("button", { name: /Культура: Томат/i })
    ).toBeInTheDocument();
  });

  it("2.4 Выбор Сетка | Таблица: переключение между сеткой и таблицей", async () => {
    await renderMoonCalendar({ entries: [], variant: "full" });

    const tableBtn = screen.getByRole("button", { name: "Таблица" });
    const gridBtn = screen.getByRole("button", { name: "Сетка" });

    expect(gridBtn).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector(".moon-cal-grid")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(tableBtn);
    });

    expect(tableBtn).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector(".moon-cal-table-wrap")).toBeInTheDocument();
    expect(
      document.querySelector(".moon-cal-grid")
    ).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(gridBtn);
    });

    expect(gridBtn).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector(".moon-cal-grid")).toBeInTheDocument();
    expect(
      document.querySelector(".moon-cal-table-wrap")
    ).not.toBeInTheDocument();
  });
});
