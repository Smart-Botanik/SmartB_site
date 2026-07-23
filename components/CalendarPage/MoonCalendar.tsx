"use client";

import { Fragment, useMemo, useState } from "react";

import { MaterialIcon } from "@/components/MaterialIcon";
import type { MoonCalendarEntry } from "@/lib/calendar-sections";
import {
  FAVORABLE_ACTIVITIES,
  UNFAVORABLE_DAY_EMOJIS,
  dayToneFromPhase,
  dayToneLabelRu,
  favorableActivityMeta,
  favorableForDay,
  type DayTone,
  type FavorableActivity,
} from "@/lib/moon-favorable-days";
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
  /** Dense grid for home / embeds — no table mode, inline day panel. */
  variant?: "full" | "compact";
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
  favorable: FavorableActivity[];
  tone: DayTone;
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

function FavorableEmoji({
  id,
  className = "",
}: {
  id: FavorableActivity;
  className?: string;
}) {
  const meta = favorableActivityMeta(id);
  return (
    <span className={`moon-cal-cell-fav ${className}`} aria-hidden>
      {meta.emoji}
    </span>
  );
}

function CellBottomMarks({
  tone,
  favorable,
}: {
  tone: DayTone;
  favorable: FavorableActivity[];
}) {
  if (tone === "unfavorable") {
    return (
      <div className="moon-cal-cell-marks moon-cal-cell-marks--bottom">
        {UNFAVORABLE_DAY_EMOJIS.map(emoji => (
          <span key={emoji} className="moon-cal-cell-fav" aria-hidden>
            {emoji}
          </span>
        ))}
      </div>
    );
  }

  if (favorable.length === 0) {
    return (
      <div className="moon-cal-cell-marks moon-cal-cell-marks--bottom" />
    );
  }

  return (
    <div className="moon-cal-cell-marks moon-cal-cell-marks--bottom">
      {favorable.map(id => (
        <FavorableEmoji key={id} id={id} />
      ))}
    </div>
  );
}

function DayInfoContent({
  selected,
  compact = false,
}: {
  selected: SelectedDay;
  compact?: boolean;
}) {
  const toneLabel = dayToneLabelRu(selected.tone);

  return (
    <>
      <div className="moon-cal-day-panel-body">
        <MaterialIcon
          name={moonPhaseIcon(selected.moon.phase)}
          className="moon-cal-day-panel-moon text-primary-container moon-glow"
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

      {toneLabel ? (
        <p className={`moon-cal-day-tone moon-cal-day-tone--${selected.tone}`}>
          {selected.tone === "unfavorable" ? (
            <span className="moon-cal-day-tone-emojis" aria-hidden>
              😠 👎
            </span>
          ) : null}
          {toneLabel}
        </p>
      ) : null}

      {selected.tone !== "unfavorable" && selected.favorable.length > 0 ? (
        <ul className="moon-cal-favorable-list" aria-label="Благоприятные работы">
          {selected.favorable.map(id => {
            const meta = favorableActivityMeta(id);
            return (
              <li key={id} className="moon-cal-favorable-item">
                <span className="moon-cal-favorable-icon" aria-hidden>
                  {meta.emoji}
                </span>
                <span>{meta.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}

      {selected.entry?.note ? (
        <p className="mt-3 font-body text-on-surface">{selected.entry.note}</p>
      ) : compact && selected.favorable.length > 0 ? null : (
        <p className="mt-3 font-body text-on-surface-variant">
          {compact
            ? "В этот день специальных работ не отмечено."
            : "Подсказки на этот день появятся, когда запись добавят в админке."}
        </p>
      )}
    </>
  );
}

function FavorableLegend() {
  return (
    <div className="moon-cal-legend-block">
      <ul className="moon-cal-tone-legend" aria-label="Благоприятность дня">
        <li>
          <span className="moon-cal-tone-swatch is-favorable" aria-hidden />
          Благоприятный
        </li>
        <li>
          <span className="moon-cal-tone-swatch is-unfavorable" aria-hidden />
          <span aria-hidden>😠👎</span>
          Неблагоприятный
        </li>
      </ul>
      <ul className="moon-cal-favorable-legend" aria-label="Обозначения работ">
        {FAVORABLE_ACTIVITIES.map(item => (
          <li key={item.id}>
            <span className="moon-cal-favorable-icon" aria-hidden>
              {item.emoji}
            </span>
            <span>{item.shortLabel}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MoonCalendar({
  entries,
  initialYear,
  initialMonthIndex,
  variant = "full",
}: MoonCalendarProps) {
  const isCompact = variant === "compact";
  const now = new Date();
  const [year, setYear] = useState(initialYear ?? now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(
    initialMonthIndex ?? now.getMonth(),
  );
  const [view, setView] = useState<ViewMode>("grid");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const activeView: ViewMode = isCompact ? "grid" : view;

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
          return {
            date,
            entry,
            moon,
            key: selectedKey,
            favorable: favorableForDay(date.getDate()),
            tone: dayToneFromPhase(moon.phase),
          } satisfies SelectedDay;
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
    <div
      className={`moon-cal-root${isCompact ? " moon-cal-root--compact" : ""}`}
    >
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
          {!isCompact ? (
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
          ) : null}
        </div>
      </header>

      {activeView === "grid" ? (
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
              const favorable = cell.inMonth
                ? favorableForDay(cell.day)
                : [];
              const tone = cell.inMonth
                ? dayToneFromPhase(moon.phase)
                : "neutral";

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
                  } ${favorable.length > 0 ? "has-favorable" : ""} ${
                    tone !== "neutral" ? `is-tone-${tone}` : ""
                  }`}
                >
                  <div className="moon-cal-cell-head">
                    <div className="moon-cal-cell-marks">
                      {!isCompact && cell.entry?.note ? (
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

                  <div className="moon-cal-cell-moon-stage">
                    <MaterialIcon
                      name={icon}
                      className="moon-cal-cell-moon"
                    />
                  </div>

                  {isCompact ? (
                    <div className="moon-cal-cell-foot">
                      <CellBottomMarks tone={tone} favorable={favorable} />
                    </div>
                  ) : (
                    <div className="moon-cal-cell-foot hidden sm:flex">
                      <CellBottomMarks tone={tone} favorable={favorable} />
                      <span className="truncate font-label text-[9px] leading-tight text-on-surface-variant/80">
                        {moon.lunarDay} л.д.
                      </span>
                      <span className="truncate font-label text-[8px] uppercase tracking-tighter text-primary-fixed-dim/70">
                        {moonPhaseLabelRu(moon.phase)}
                      </span>
                    </div>
                  )}
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
              <DayInfoContent selected={selected} compact={isCompact} />
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
                  favorable: favorableForDay(day.day),
                  tone: dayToneFromPhase(moon.phase),
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

      {isCompact ? <FavorableLegend /> : null}
    </div>
  );
}
