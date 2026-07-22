"use client";

import { Fragment, useMemo, useState } from "react";

import { MaterialIcon } from "@/components/MaterialIcon";
import type { MoonCalendarEntry } from "@/lib/calendar-sections";
import {
  WEEKDAY_LABELS_RU,
  daysInMonth,
  formatDateKey,
  mondayWeekdayIndex,
  monthTitleRu,
  moonPhaseIcon,
  moonPhaseLabelRu,
  parseDateKey,
  resolveMoonPhase,
  startOfMonth,
  type MoonPhaseId,
} from "@/lib/moon-phase";

type MoonCalendarProps = {
  entries: MoonCalendarEntry[];
  initialYear?: number;
  initialMonthIndex?: number;
};

type ViewMode = "grid" | "list";

type DayCell = {
  key: string;
  day: number;
  inMonth: boolean;
  date: Date;
  entry?: MoonCalendarEntry;
  isToday: boolean;
};

type SelectedDay = {
  key: string;
  date: Date;
  entry?: MoonCalendarEntry;
  moon: {
    phase: MoonPhaseId;
    age: number;
    lunarDay: number;
    illumination: number;
  };
};

const WEEKDAY_FULL_RU = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
] as const;

function buildMonthCells(year: number, monthIndex: number): DayCell[] {
  const todayKey = formatDateKey(new Date());
  const first = startOfMonth(year, monthIndex);
  const offset = mondayWeekdayIndex(first);
  const count = daysInMonth(year, monthIndex);
  const cells: DayCell[] = [];

  if (offset > 0) {
    const prevMonth = monthIndex === 0 ? 11 : monthIndex - 1;
    const prevYear = monthIndex === 0 ? year - 1 : year;
    const prevDays = daysInMonth(prevYear, prevMonth);
    for (let i = offset - 1; i >= 0; i -= 1) {
      const day = prevDays - i;
      const date = new Date(prevYear, prevMonth, day);
      const key = formatDateKey(date);
      cells.push({
        key,
        day,
        inMonth: false,
        date,
        isToday: key === todayKey,
      });
    }
  }

  for (let day = 1; day <= count; day += 1) {
    const date = new Date(year, monthIndex, day);
    const key = formatDateKey(date);
    cells.push({
      key,
      day,
      inMonth: true,
      date,
      isToday: key === todayKey,
    });
  }

  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    const date = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
    const key = formatDateKey(date);
    cells.push({
      key,
      day: date.getDate(),
      inMonth: false,
      date,
      isToday: key === todayKey,
    });
  }

  return cells;
}

function formatDayShort(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function DayInfoContent({ selected }: { selected: SelectedDay }) {
  return (
    <>
      <div className="moon-cal-day-panel-body">
        <MaterialIcon
          name={moonPhaseIcon(selected.moon.phase)}
          className="text-5xl text-primary-container moon-glow"
        />
        <div>
          <h4 className="font-headline text-xl text-primary md:text-2xl">
            {moonPhaseLabelRu(selected.moon.phase)}
          </h4>
          <p className="mt-1 font-label text-label text-on-surface-variant">
            {selected.moon.lunarDay} лунный день · освещённость{" "}
            {selected.moon.illumination}%
          </p>
          <p className="mt-1 font-label text-label text-on-surface-variant">
            {WEEKDAY_FULL_RU[mondayWeekdayIndex(selected.date)]}
          </p>
        </div>
      </div>
      {selected.entry?.note ? (
        <p className="mt-4 font-body text-on-surface">{selected.entry.note}</p>
      ) : (
        <p className="mt-4 font-body text-on-surface-variant">
          Подсказки на этот день появятся, когда запись добавят в админке.
        </p>
      )}
    </>
  );
}

export function MoonCalendar({
  entries,
  initialYear,
  initialMonthIndex,
}: MoonCalendarProps) {
  const now = new Date();
  const [year, setYear] = useState(initialYear ?? now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(
    initialMonthIndex ?? now.getMonth(),
  );
  const [view, setView] = useState<ViewMode>("grid");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const entryByDate = useMemo(() => {
    const map = new Map<string, MoonCalendarEntry>();
    for (const entry of entries) {
      map.set(entry.date, entry);
    }
    return map;
  }, [entries]);

  const cells = useMemo(() => {
    return buildMonthCells(year, monthIndex).map(cell => ({
      ...cell,
      entry: entryByDate.get(cell.key),
    }));
  }, [year, monthIndex, entryByDate]);

  const monthDays = useMemo(
    () => cells.filter(cell => cell.inMonth),
    [cells],
  );

  const selected =
    selectedKey != null
      ? (() => {
          const date = parseDateKey(selectedKey);
          if (!date) return null;
          const entry = entryByDate.get(selectedKey);
          const moon = resolveMoonPhase(date, entry?.phase);
          return { date, entry, moon, key: selectedKey } satisfies SelectedDay;
        })()
      : null;

  function shiftMonth(delta: number) {
    const next = new Date(year, monthIndex + delta, 1);
    setYear(next.getFullYear());
    setMonthIndex(next.getMonth());
    setSelectedKey(null);
  }

  function toggleDay(key: string) {
    setSelectedKey(current => (current === key ? null : key));
  }

  function setViewMode(next: ViewMode) {
    setView(next);
    setSelectedKey(null);
  }

  return (
    <div className="moon-cal-root">
      <header className="moon-cal-toolbar moon-cal-substrate">
        <div className="moon-cal-toolbar-inner">
          <div className="moon-cal-month-picker">
            <button
              type="button"
              className="moon-cal-month-nav"
              aria-label="Предыдущий месяц"
              onClick={() => shiftMonth(-1)}
            >
              <MaterialIcon name="chevron_left" className="text-lg" />
            </button>
            <h3 className="moon-cal-month-label">
              {monthTitleRu(year, monthIndex)}
            </h3>
            <button
              type="button"
              className="moon-cal-month-nav"
              aria-label="Следующий месяц"
              onClick={() => shiftMonth(1)}
            >
              <MaterialIcon name="chevron_right" className="text-lg" />
            </button>
          </div>
          <div
            className="moon-cal-view-toggle"
            role="group"
            aria-label="Вид календаря"
          >
            <button
              type="button"
              aria-pressed={view === "grid"}
              onClick={() => setViewMode("grid")}
              className={view === "grid" ? "is-active" : undefined}
            >
              <MaterialIcon name="calendar_view_month" className="text-base" />
              Сетка
            </button>
            <button
              type="button"
              aria-pressed={view === "list"}
              onClick={() => setViewMode("list")}
              className={view === "list" ? "is-active" : undefined}
            >
              <MaterialIcon name="table_rows" className="text-base" />
              Таблица
            </button>
          </div>
        </div>
      </header>

      {view === "grid" ? (
        <div className="moon-cal-grid-stage">
          <div
            className="moon-cal-grid moon-cal-substrate"
            role="grid"
            aria-label={`Лунный календарь — ${monthTitleRu(year, monthIndex)}`}
          >
            {WEEKDAY_LABELS_RU.map(label => (
              <div key={label} role="columnheader" className="moon-cal-weekday">
                {label}
              </div>
            ))}

            {cells.map(cell => {
              const moon = resolveMoonPhase(cell.date, cell.entry?.phase);
              const icon = moonPhaseIcon(moon.phase);
              const isSelected = selectedKey === cell.key;

              return (
                <button
                  key={cell.key}
                  type="button"
                  role="gridcell"
                  aria-selected={isSelected}
                  aria-expanded={isSelected}
                  aria-current={cell.isToday ? "date" : undefined}
                  onClick={() => toggleDay(cell.key)}
                  className={`moon-cal-cell calendar-cell-hover ${
                    !cell.inMonth ? "is-outside" : ""
                  } ${cell.isToday ? "is-today" : ""} ${
                    isSelected ? "is-selected" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-0.5">
                    <div className="flex min-h-[0.75rem] gap-0.5">
                      {cell.entry?.note ? (
                        <MaterialIcon
                          name="eco"
                          className="text-[10px] text-primary-fixed-dim"
                        />
                      ) : null}
                    </div>
                    <span
                      className={`moon-cal-cell-day ${
                        cell.isToday || isSelected ? "is-accent" : ""
                      }`}
                    >
                      {String(cell.day).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-1 items-center justify-center py-0.5">
                    <MaterialIcon
                      name={icon}
                      className={`text-lg moon-glow md:text-2xl ${
                        cell.isToday || isSelected
                          ? "text-primary-container"
                          : "text-on-surface/40"
                      }`}
                    />
                  </div>

                  <div className="hidden min-h-0 flex-col gap-0 sm:flex">
                    <span className="truncate font-label text-[9px] leading-tight text-on-surface-variant/80">
                      {moon.lunarDay} л.д.
                    </span>
                    <span className="truncate font-label text-[8px] uppercase tracking-tighter text-primary-fixed-dim/70">
                      {moonPhaseLabelRu(moon.phase)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {selected ? (
            <aside
              className="moon-cal-day-panel moon-cal-substrate"
              aria-label="Информация о дне"
            >
              <div className="moon-cal-day-panel-head">
                <p className="font-label text-label uppercase tracking-widest text-on-surface-variant">
                  {selected.key}
                </p>
                <button
                  type="button"
                  className="moon-cal-day-panel-close"
                  aria-label="Закрыть"
                  onClick={() => setSelectedKey(null)}
                >
                  <MaterialIcon name="close" />
                </button>
              </div>
              <DayInfoContent selected={selected} />
            </aside>
          ) : null}
        </div>
      ) : (
        <div className="moon-cal-table-wrap moon-cal-substrate">
          <table className="moon-cal-table">
            <thead>
              <tr>
                <th scope="col">День</th>
                <th scope="col">Неделя</th>
                <th scope="col">Фаза</th>
                <th scope="col">Лунный день</th>
                <th scope="col">Освещ.</th>
                <th scope="col">Заметка</th>
              </tr>
            </thead>
            <tbody>
              {monthDays.map(day => {
                const moon = resolveMoonPhase(day.date, day.entry?.phase);
                const isSelected = selectedKey === day.key;
                const weekday = WEEKDAY_FULL_RU[mondayWeekdayIndex(day.date)];
                const expanded: SelectedDay = {
                  key: day.key,
                  date: day.date,
                  entry: day.entry,
                  moon,
                };

                return (
                  <Fragment key={day.key}>
                    <tr
                      data-selected={isSelected ? "true" : undefined}
                      data-today={day.isToday ? "true" : undefined}
                      tabIndex={0}
                      aria-selected={isSelected}
                      aria-expanded={isSelected}
                      onClick={() => toggleDay(day.key)}
                      onKeyDown={event => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          toggleDay(day.key);
                        }
                      }}
                    >
                      <td>
                        <time dateTime={day.key} className="moon-cal-table-day">
                          {formatDayShort(day.date)}
                          {day.isToday ? (
                            <span className="moon-cal-table-today">сегодня</span>
                          ) : null}
                        </time>
                      </td>
                      <td>{weekday}</td>
                      <td>
                        <span className="moon-cal-table-phase">
                          <MaterialIcon
                            name={moonPhaseIcon(moon.phase)}
                            className="text-xl text-primary-container moon-glow"
                          />
                          <span>{moonPhaseLabelRu(moon.phase)}</span>
                        </span>
                      </td>
                      <td className="moon-cal-table-mono">{moon.lunarDay}</td>
                      <td className="moon-cal-table-mono">
                        {moon.illumination}%
                      </td>
                      <td className="moon-cal-table-note">
                        {day.entry?.note?.trim() ? day.entry.note : "—"}
                      </td>
                    </tr>
                    {isSelected ? (
                      <tr className="moon-cal-table-expand" aria-live="polite">
                        <td colSpan={6}>
                          <div className="moon-cal-table-expand-inner">
                            <DayInfoContent selected={expanded} />
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
