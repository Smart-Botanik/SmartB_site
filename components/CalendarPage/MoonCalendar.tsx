"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";

import { GuideMarkdown } from "@/components/GuideMarkdown";
import { MaterialIcon } from "@/components/MaterialIcon";
import {
  fetchPublishedCalendarDay,
  fetchPublishedCalendarDays,
  type PublishedCalendarDay,
  type PublishedCalendarDayListItem,
} from "@/lib/calendar-api";
import {
  cellDayTone,
  cellFavorableActivities,
  listFavorableCultureActions,
  type FavorableCultureAction,
} from "@/lib/calendar-favorable";
import type { MoonCalendarEntry } from "@/lib/calendar-sections";
import { DEFAULT_CULTURES, type DefaultCulture } from "@/lib/default-cultures";
import {
  FAVORABLE_ACTIVITIES,
  UNFAVORABLE_DAY_EMOJIS,
  favorableActivityMeta,
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
  /** Initial culture tag key; empty = all cultures. Compact defaults to tomato. */
  initialCultureTagKey?: string;
};

type ViewMode = "grid" | "list";

type DayCell = {
  key: string;
  day: number;
  inMonth: boolean;
  date: Date;
  entry?: MoonCalendarEntry;
  published?: PublishedCalendarDayListItem;
  isToday: boolean;
};

type SelectedDay = {
  key: string;
  date: Date;
  entry?: MoonCalendarEntry;
  published?: PublishedCalendarDayListItem;
  moon: {
    phase: MoonPhaseId;
    age: number;
    lunarDay: number;
    illumination: number;
  };
};

type DayDetailState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; day: PublishedCalendarDay | null }
  | { status: "error"; message: string };

const WEEKDAY_FULL_RU = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
] as const;

const CULTURE_ALL = "";

/** Fallback preview images per culture tag key. */
const CULTURE_PREVIEW_MAP: Record<string, string> = {
  "crop.tomato": "/previews/tomato.jpg",
  "crop.zucchini": "/previews/zucchini.jpg",
  "crop.eggplant": "/previews/eggplant.jpg",
  "crop.cucumber": "/previews/cucumber.jpg",
};

type CulturePickerProps = {
  value: string;
  onChange: (tagKey: string) => void;
};

function CulturePicker({ value, onChange }: CulturePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const activeCulture = value === CULTURE_ALL
    ? null
    : DEFAULT_CULTURES.find(c => c.tagKey === value) ?? null;
  const activeImage = activeCulture ? (CULTURE_PREVIEW_MAP[activeCulture.tagKey] ?? null) : null;
  const activeLabel = activeCulture?.label ?? "Все культуры";

  function select(tagKey: string) {
    onChange(tagKey);
    setOpen(false);
  }

  return (
    <div className="moon-cal-culture-picker" ref={ref}>
      <button
        type="button"
        className={`moon-cal-culture-picker-trigger${open ? " is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Культура: ${activeLabel}`}
        onClick={() => setOpen(o => !o)}
      >
        {activeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeImage}
            alt=""
            aria-hidden
            className="moon-cal-culture-picker-thumb"
          />
        ) : (
          <span className="moon-cal-culture-picker-thumb moon-cal-culture-picker-thumb--all" aria-hidden>
            🌱
          </span>
        )}
        <span className="moon-cal-culture-picker-label">{activeLabel}</span>
        <span className="moon-cal-culture-picker-chevron" aria-hidden>▾</span>
      </button>

      {open && (
        <div className="moon-cal-culture-picker-panel" role="listbox" aria-label="Выберите культуру">
          {/* All cultures option */}
          <button
            type="button"
            role="option"
            aria-selected={value === CULTURE_ALL}
            className={`moon-cal-culture-chip${value === CULTURE_ALL ? " is-active" : ""}`}
            onClick={() => select(CULTURE_ALL)}
          >
            <span className="moon-cal-culture-chip-thumb moon-cal-culture-chip-thumb--all">🌱</span>
            <span className="moon-cal-culture-chip-label">Все</span>
          </button>

          {DEFAULT_CULTURES.map(culture => {
            const img = CULTURE_PREVIEW_MAP[culture.tagKey] ?? null;
            const isActive = value === culture.tagKey;
            return (
              <button
                key={culture.tagKey}
                type="button"
                role="option"
                aria-selected={isActive}
                className={`moon-cal-culture-chip${isActive ? " is-active" : ""}`}
                onClick={() => select(culture.tagKey)}
              >
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img}
                    alt=""
                    aria-hidden
                    className="moon-cal-culture-chip-thumb"
                  />
                ) : (
                  <span className="moon-cal-culture-chip-thumb" aria-hidden>{culture.emoji}</span>
                )}
                <span className="moon-cal-culture-chip-label">{culture.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

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

function monthQueryRange(year: number, monthIndex: number): {
  from: string;
  to: string;
} {
  const cells = buildMonthCells(year, monthIndex);
  return {
    from: cells[0].key,
    to: cells[cells.length - 1].key,
  };
}

function formatDayShort(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function resolveCellMoon(
  date: Date,
  published?: PublishedCalendarDayListItem,
  pagePhase?: string,
) {
  return resolveMoonPhase(date, published?.moonPhase ?? pagePhase);
}

function matrixInputForDay(
  moonPhase: string,
  published: PublishedCalendarDayListItem | PublishedCalendarDay | undefined,
  cultureTagKey: string,
) {
  const zodiac = published?.moonZodiacSign?.trim();
  if (!zodiac) return null;
  return {
    moonPhase: published?.moonPhase?.trim() || moonPhase,
    moonZodiacSign: zodiac,
    cultureTagKey: cultureTagKey || null,
  };
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
  favCultures,
}: {
  tone: DayTone;
  favorable: FavorableActivity[];
  favCultures?: DefaultCulture[];
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

  if (favCultures && favCultures.length > 0) {
    const maxVisible = 2;
    const visibleCultures = favCultures.slice(0, maxVisible);
    const extraCount = favCultures.length - maxVisible;

    return (
      <div className="moon-cal-cell-marks moon-cal-cell-marks--bottom">
        {visibleCultures.map(culture => (
          <span
            key={culture.tagKey}
            className="moon-cal-cell-fav"
            title={culture.label}
            aria-hidden
          >
            {culture.emoji}
          </span>
        ))}
        {extraCount > 0 ? (
          <span className="text-[9px] font-semibold text-on-surface-variant/80 select-none ml-0.5">
            +{extraCount}
          </span>
        ) : null}
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
  detail,
  favorableFor,
  cultureTagKey,
  compact = false,
}: {
  selected: SelectedDay;
  detail: DayDetailState;
  favorableFor: FavorableCultureAction[];
  cultureTagKey: string;
  compact?: boolean;
}) {
  const cmsTitle = detail.status === "ready" ? detail.day?.title?.trim() : "";
  const listTitle = selected.published?.title?.trim() ?? "";
  const cmsBody =
    detail.status === "ready" ? detail.day?.bodyMd?.trim() ?? "" : "";
  const pageNote = selected.entry?.note?.trim() ?? "";
  const culture = cultureTagKey
    ? DEFAULT_CULTURES.find(c => c.tagKey === cultureTagKey)
    : null;
  const favorableHeading = culture
    ? `Благоприятно · ${culture.label}`
    : "Благоприятно для";
  const hasZodiac = Boolean(
    (detail.status === "ready" && detail.day?.moonZodiacSign) ||
      selected.published?.moonZodiacSign,
  );

  return (
    <>
      <div className="moon-cal-day-panel-body">
        <MaterialIcon
          name={moonPhaseIcon(selected.moon.phase)}
          className="moon-cal-day-panel-moon text-primary-container moon-glow"
        />
        <div>
          <h4 className="font-headline text-xl text-primary md:text-2xl">
            {cmsTitle || listTitle || moonPhaseLabelRu(selected.moon.phase)}
          </h4>
          <p className="mt-1 font-label text-label text-on-surface-variant">
            {moonPhaseLabelRu(selected.moon.phase)} · {selected.moon.lunarDay}{" "}
            лунный день · освещённость {selected.moon.illumination}%
          </p>
          <p className="mt-1 font-label text-label text-on-surface-variant">
            {WEEKDAY_FULL_RU[mondayWeekdayIndex(selected.date)]}
          </p>
        </div>
      </div>

      {detail.status === "loading" ? (
        <p className="mt-3 font-body text-on-surface-variant">
          Загружаем описание дня…
        </p>
      ) : null}

      {detail.status === "error" ? (
        <p className="mt-3 font-body text-on-surface-variant">
          Не удалось загрузить день: {detail.message}
        </p>
      ) : null}

      {detail.status === "ready" || detail.status === "idle" ? (
        <>
          {favorableFor.length > 0 ? (
            <div className="moon-cal-favorable-block">
              <p className="moon-cal-favorable-heading">{favorableHeading}</p>
              <ul
                className="moon-cal-favorable-list"
                aria-label={favorableHeading}
              >
                {favorableFor.map(item => (
                  <li
                    key={`${item.tagKey}:${item.activityKind}`}
                    className="moon-cal-favorable-item"
                  >
                    {!culture ? (
                      <span className="moon-cal-favorable-icon" aria-hidden>
                        {item.cultureEmoji}
                      </span>
                    ) : null}
                    <span>{item.label}</span>
                    <span className="moon-cal-favorable-icon" aria-hidden>
                      {item.activityEmoji}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : hasZodiac ? (
            <p className="mt-3 font-body text-on-surface-variant">
              {culture
                ? `Нет явно благоприятных работ для «${culture.label}» на этот день.`
                : "Нет явно благоприятных работ по культурам на этот день."}
            </p>
          ) : detail.status === "ready" ? (
            <p className="mt-3 font-body text-on-surface-variant">
              Знак зодиака для дня ещё не в кэше — благоприятность появится
              после публикации дня с эфемеридами.
            </p>
          ) : null}

          {cmsBody ? (
            <div className="moon-cal-day-body mt-3">
              <GuideMarkdown markdown={cmsBody} className="guide-markdown" />
            </div>
          ) : pageNote ? (
            <p className="mt-3 font-body text-on-surface">{pageNote}</p>
          ) : detail.status === "ready" && !compact ? (
            <p className="mt-3 font-body text-on-surface-variant">
              Описание дня ещё не опубликовано в админке.
            </p>
          ) : null}
        </>
      ) : null}
    </>
  );
}

function FavorableLegend({ cultureTagKey }: { cultureTagKey: string }) {
  const culture = cultureTagKey
    ? DEFAULT_CULTURES.find(c => c.tagKey === cultureTagKey)
    : null;

  return (
    <div className="moon-cal-legend-block">
      <ul className="moon-cal-tone-legend" aria-label="Благоприятность дня">
        <li>
          <span className="moon-cal-tone-swatch is-favorable" aria-hidden />
          Благоприятный
          {culture ? ` · ${culture.label}` : ""}
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
  initialCultureTagKey,
}: MoonCalendarProps) {
  const isCompact = variant === "compact";
  const now = new Date();
  const [year, setYear] = useState(initialYear ?? now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(
    initialMonthIndex ?? now.getMonth(),
  );
  const [view, setView] = useState<ViewMode>("grid");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [dayDetail, setDayDetail] = useState<DayDetailState>({ status: "idle" });
  const [publishedByDate, setPublishedByDate] = useState<
    Map<string, PublishedCalendarDayListItem>
  >(() => new Map());
  const [cultureTagKey, setCultureTagKey] = useState(
    () =>
      initialCultureTagKey ??
      (isCompact ? "crop.tomato" : CULTURE_ALL),
  );
  const activeView: ViewMode = isCompact ? "grid" : view;

  const entryByDate = useMemo(() => {
    const map = new Map<string, MoonCalendarEntry>();
    for (const entry of entries) {
      map.set(entry.date, entry);
    }
    return map;
  }, [entries]);

  useEffect(() => {
    let cancelled = false;
    const { from, to } = monthQueryRange(year, monthIndex);

    fetchPublishedCalendarDays(from, to).then(days => {
      if (cancelled) return;
      const map = new Map<string, PublishedCalendarDayListItem>();
      for (const day of days) {
        map.set(day.date, day);
      }
      setPublishedByDate(map);
    });

    return () => {
      cancelled = true;
    };
  }, [year, monthIndex]);

  const cells = useMemo(() => {
    return buildMonthCells(year, monthIndex).map(cell => ({
      ...cell,
      entry: entryByDate.get(cell.key),
      published: publishedByDate.get(cell.key),
    }));
  }, [year, monthIndex, entryByDate, publishedByDate]);

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
          const published = publishedByDate.get(selectedKey);
          const cmsPhase =
            dayDetail.status === "ready"
              ? dayDetail.day?.moonPhase ?? published?.moonPhase ?? entry?.phase
              : published?.moonPhase ?? entry?.phase;
          const moon = resolveMoonPhase(date, cmsPhase);
          return {
            date,
            entry,
            published,
            moon,
            key: selectedKey,
          } satisfies SelectedDay;
        })()
      : null;

  const favorableFor = useMemo(() => {
    if (!selected) return [];
    const published =
      dayDetail.status === "ready" && dayDetail.day
        ? dayDetail.day
        : selected.published;
    const input = matrixInputForDay(
      selected.moon.phase,
      published,
      cultureTagKey,
    );
    if (!input) return [];
    return listFavorableCultureActions(input);
  }, [selected, dayDetail, cultureTagKey]);

  useEffect(() => {
    if (!selectedKey) {
      setDayDetail({ status: "idle" });
      return;
    }

    let cancelled = false;
    setDayDetail({ status: "loading" });

    fetchPublishedCalendarDay(selectedKey)
      .then(day => {
        if (!cancelled) {
          setDayDetail({ status: "ready", day });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setDayDetail({
            status: "error",
            message:
              error instanceof Error ? error.message : "ошибка запроса",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedKey]);

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

          <div className="moon-cal-toolbar-controls">
            <div className="moon-cal-culture-select">
              <span className="moon-cal-culture-select-label">Культура</span>
              <CulturePicker
                value={cultureTagKey}
                onChange={setCultureTagKey}
              />
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
                  <MaterialIcon
                    name="calendar_view_month"
                    className="text-base"
                  />
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
              const moon = resolveCellMoon(
                cell.date,
                cell.published,
                cell.entry?.phase,
              );
              const icon = moonPhaseIcon(moon.phase);
              const isSelected = selectedKey === cell.key;
              const matrix = cell.inMonth
                ? matrixInputForDay(moon.phase, cell.published, cultureTagKey)
                : null;
              const favorable = matrix ? cellFavorableActivities(matrix) : [];
              const tone: DayTone = matrix ? cellDayTone(matrix) : "neutral";
              const hasCmsNote = Boolean(
                cell.published?.title || cell.entry?.note,
              );

              const isAllCultures = cultureTagKey === "";
              const favCultures = (() => {
                if (!isAllCultures || !cell.inMonth) return [];
                const allMatrix = matrixInputForDay(moon.phase, cell.published, "");
                if (!allMatrix) return [];
                const actions = listFavorableCultureActions(allMatrix);
                const seen = new Set<string>();
                const list: DefaultCulture[] = [];
                for (const action of actions) {
                  if (!seen.has(action.tagKey)) {
                    seen.add(action.tagKey);
                    const c = DEFAULT_CULTURES.find(x => x.tagKey === action.tagKey);
                    if (c) list.push(c);
                  }
                }
                return list;
              })();

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
                  } ${
                    (isAllCultures ? favCultures.length > 0 : favorable.length > 0)
                      ? "has-favorable"
                      : ""
                  } ${tone !== "neutral" ? `is-tone-${tone}` : ""}`}
                >
                  <div className="moon-cal-cell-head">
                    <div className="moon-cal-cell-marks">
                      {!isCompact && hasCmsNote ? (
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
                      <CellBottomMarks
                        tone={tone}
                        favorable={favorable}
                        favCultures={favCultures}
                      />
                    </div>
                  ) : (
                    <div className="moon-cal-cell-foot hidden sm:flex">
                      <CellBottomMarks
                        tone={tone}
                        favorable={favorable}
                        favCultures={favCultures}
                      />
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
              <DayInfoContent
                selected={selected}
                detail={dayDetail}
                favorableFor={favorableFor}
                cultureTagKey={cultureTagKey}
                compact={isCompact}
              />
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
                const moon = resolveCellMoon(
                  day.date,
                  day.published,
                  day.entry?.phase,
                );
                const isSelected = selectedKey === day.key;
                const weekday = WEEKDAY_FULL_RU[mondayWeekdayIndex(day.date)];
                const note =
                  day.published?.title?.trim() ||
                  day.entry?.note?.trim() ||
                  "—";
                const expanded: SelectedDay = {
                  key: day.key,
                  date: day.date,
                  entry: day.entry,
                  published: day.published,
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
                      <td className="moon-cal-table-note">{note}</td>
                    </tr>
                    {isSelected ? (
                      <tr className="moon-cal-table-expand" aria-live="polite">
                        <td colSpan={6}>
                          <div className="moon-cal-table-expand-inner">
                            <DayInfoContent
                              selected={
                                selectedKey === day.key && selected
                                  ? selected
                                  : expanded
                              }
                              detail={dayDetail}
                              favorableFor={
                                selectedKey === day.key ? favorableFor : []
                              }
                              cultureTagKey={cultureTagKey}
                            />
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

      {isCompact ? <FavorableLegend cultureTagKey={cultureTagKey} /> : null}
      {!isCompact ? (
        <div className="mt-3">
          <FavorableLegend cultureTagKey={cultureTagKey} />
        </div>
      ) : null}
    </div>
  );
}
