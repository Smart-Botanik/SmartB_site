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
  groupFavorableActionsByActivity,
  listFavorableCultureActions,
  resolveGeneralDayActivities,
  type FavorableCultureAction,
} from "@/lib/calendar-favorable";
import type { MoonCalendarEntry } from "@/lib/calendar-sections";
import { DEFAULT_CULTURES } from "@/lib/default-cultures";
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
  getZodiacSymbol,
  getZodiacLabelRu,
  mondayWeekdayIndex,
  monthTitleRu,
  moonPhaseIcon,
  moonPhaseLabelRu,
  moonPhaseImage,
  parseDateKey,
  resolveMoonPhase,
  startOfMonth,
  type MoonPhaseId,
} from "@/lib/moon-phase";

type MoonCalendarProps = {
  entries: MoonCalendarEntry[];
  initialYear?: number;
  initialMonthIndex?: number;
  /**
   * `compact` — home / embeds (grid only).
   * `full` — `/calendar` page: same grid + table mode toggle.
   */
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

  const activeCulture =
    value === CULTURE_ALL
      ? null
      : (DEFAULT_CULTURES.find((c) => c.tagKey === value) ?? null);
  const activeImage = activeCulture
    ? (CULTURE_PREVIEW_MAP[activeCulture.tagKey] ?? null)
    : null;
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
        onClick={() => setOpen((o) => !o)}
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
          <span
            className="moon-cal-culture-picker-thumb moon-cal-culture-picker-thumb--all"
            aria-hidden
          >
            🌱
          </span>
        )}
        <span className="moon-cal-culture-picker-label">{activeLabel}</span>
        <span className="moon-cal-culture-picker-chevron" aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div
          className="moon-cal-culture-picker-panel"
          role="listbox"
          aria-label="Выберите культуру"
        >
          {/* All cultures option */}
          <button
            type="button"
            role="option"
            aria-selected={value === CULTURE_ALL}
            className={`moon-cal-culture-chip${value === CULTURE_ALL ? " is-active" : ""}`}
            onClick={() => select(CULTURE_ALL)}
          >
            <span className="moon-cal-culture-chip-thumb moon-cal-culture-chip-thumb--all">
              🌱
            </span>
            <span className="moon-cal-culture-chip-label">Все</span>
          </button>

          {DEFAULT_CULTURES.map((culture) => {
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
                  <span className="moon-cal-culture-chip-thumb" aria-hidden>
                    {culture.emoji}
                  </span>
                )}
                <span className="moon-cal-culture-chip-label">
                  {culture.label}
                </span>
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
    const date = new Date(
      last.getFullYear(),
      last.getMonth(),
      last.getDate() + 1,
    );
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

function monthQueryRange(
  year: number,
  monthIndex: number,
): {
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

function ActivityIcon({
  id,
  className = "moon-cal-cell-fav",
}: {
  id: FavorableActivity;
  className?: string;
}) {
  const meta = favorableActivityMeta(id);
  if (meta.materialIcon) {
    return <MaterialIcon name={meta.materialIcon} className={className} />;
  }
  return (
    <span className={className} aria-hidden>
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
      <div
        className="moon-cal-cell-marks moon-cal-cell-marks--bottom moon-cal-cell-fav-string"
        aria-hidden
      >
        {UNFAVORABLE_DAY_EMOJIS.join("")}
      </div>
    );
  }

  if (favorable.length === 0) {
    return <div className="moon-cal-cell-marks moon-cal-cell-marks--bottom" />;
  }

  return (
    <div
      className="moon-cal-cell-marks moon-cal-cell-marks--bottom moon-cal-cell-fav-string"
      aria-hidden
    >
      {favorable.map((id) => (
        <ActivityIcon key={id} id={id} />
      ))}
    </div>
  );
}

function DayInfoContent({
  selected,
  detail,
  favorableFor,
  daySigns,
  cultureTagKey,
  compact = false,
}: {
  selected: SelectedDay;
  detail: DayDetailState;
  favorableFor: FavorableCultureAction[];
  daySigns: FavorableActivity[];
  cultureTagKey: string;
  compact?: boolean;
}) {
  const cmsTitle = detail.status === "ready" ? detail.day?.title?.trim() : "";
  const listTitle = selected.published?.title?.trim() ?? "";
  const cmsBody =
    detail.status === "ready" ? (detail.day?.bodyMd?.trim() ?? "") : "";
  const pageNote = selected.entry?.note?.trim() ?? "";
  const culture = cultureTagKey
    ? DEFAULT_CULTURES.find((c) => c.tagKey === cultureTagKey)
    : null;
  const activityGroups = culture
    ? []
    : groupFavorableActionsByActivity(favorableFor);
  const singleCultureActivities = culture
    ? Array.from(
        new Map(
          favorableFor.map((item) => [item.activityId, item] as const),
        ).values(),
      )
    : [];
  const hasZodiac = Boolean(
    (detail.status === "ready" && detail.day?.moonZodiacSign) ||
    selected.published?.moonZodiacSign,
  );

  const zodiacSign =
    (detail.status === "ready" && detail.day?.moonZodiacSign) ||
    selected.published?.moonZodiacSign ||
    selected.entry?.zodiacSign;
  const zodiacSymbol = getZodiacSymbol(zodiacSign);

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
          <div className="mt-2 flex flex-wrap gap-2 font-label text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high/90 border border-outline-variant/15 text-primary font-semibold shadow-2xs">
              <MaterialIcon
                name={moonPhaseIcon(selected.moon.phase)}
                className="text-sm text-primary-container moon-glow"
              />
              <span>
                {moonPhaseLabelRu(selected.moon.phase)} ·{" "}
                {selected.moon.lunarDay} лунный день
              </span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high/90 border border-outline-variant/15 text-primary font-semibold shadow-2xs">
              <MaterialIcon
                name="light_mode"
                className="text-sm text-primary-container"
              />
              <span>освещённость {selected.moon.illumination}%</span>
            </span>

            {zodiacSign ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high/90 border border-outline-variant/15 text-secondary font-semibold shadow-2xs">
                <span
                  aria-hidden="true"
                  className="text-sm font-extrabold leading-none"
                >
                  {zodiacSymbol}
                </span>
                <span>{getZodiacLabelRu(zodiacSign)}</span>
              </span>
            ) : null}

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high/90 border border-outline-variant/15 text-on-surface-variant font-semibold shadow-2xs">
              <MaterialIcon
                name="event"
                className="text-sm text-primary-container"
              />
              <span>{WEEKDAY_FULL_RU[mondayWeekdayIndex(selected.date)]}</span>
            </span>
          </div>
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

          {!culture && daySigns.length > 0 ? (
            <div className="moon-cal-favorable-block">
              <p className="moon-cal-favorable-heading">Благоприятные для:</p>
              <ul
                className="moon-cal-favorable-list"
                aria-label="Благоприятные для"
              >
                {daySigns.map((id) => {
                  const meta = favorableActivityMeta(id);
                  return (
                    <li key={id} className="moon-cal-favorable-item">
                      <span className="moon-cal-favorable-icon" aria-hidden>
                        {meta.emoji}
                      </span>
                      <span>{meta.shortLabel}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {culture && singleCultureActivities.length > 0 ? (
            <div className="moon-cal-favorable-block">
              <p className="moon-cal-favorable-heading">
                {`Благоприятно · ${culture.label}`}
              </p>
              <ul
                className="moon-cal-favorable-list"
                aria-label={`Благоприятно · ${culture.label}`}
              >
                {singleCultureActivities.map((item) => {
                  const meta = favorableActivityMeta(item.activityId);
                  return (
                    <li
                      key={item.activityId}
                      className="moon-cal-favorable-item"
                    >
                      <span className="moon-cal-favorable-icon" aria-hidden>
                        {meta.emoji}
                      </span>
                      <span>{meta.shortLabel}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {!culture && activityGroups.length > 0 ? (
            <div className="moon-cal-favorable-block">
              <p className="moon-cal-favorable-heading">По культурам</p>
              <ul
                className="moon-cal-favorable-by-activity"
                aria-label="По культурам"
              >
                {activityGroups.map((group) => (
                  <li
                    key={group.activityId}
                    className="moon-cal-favorable-by-activity-row"
                  >
                    <span className="moon-cal-favorable-by-activity-lead">
                      <span aria-hidden>{group.activityEmoji}</span>
                      <span>{group.activityShortLabel}</span>
                    </span>
                    <span className="moon-cal-favorable-by-activity-cultures">
                      {group.cultures.map((c) => (
                        <span
                          key={c.tagKey}
                          className="moon-cal-favorable-culture-emoji"
                          title={c.cultureLabel}
                          aria-label={c.cultureLabel}
                        >
                          {c.cultureEmoji}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : hasZodiac ? (
            culture ? (
              singleCultureActivities.length === 0 ? (
                <p className="mt-3 font-body text-on-surface-variant">
                  {`Нет явно благоприятных работ для «${culture.label}» на этот день.`}
                </p>
              ) : null
            ) : daySigns.length === 0 && activityGroups.length === 0 ? (
              <p className="mt-3 font-body text-on-surface-variant">
                Нет явно благоприятных работ по культурам на этот день.
              </p>
            ) : null
          ) : detail.status === "ready" ? (
            <p className="mt-3 font-body text-on-surface-variant">
              Знак зодиака для дня ещё не в кэше — благоприятность появится
              после публикации дня с эфемеридами.
            </p>
          ) : null}
        </>
      ) : null}
      {(() => {
        const uniqueCultures = Array.from(
          new Set(favorableFor.map((item) => item.tagKey)),
        );
        const previewImages = uniqueCultures
          .map((key) => ({
            key,
            url: CULTURE_PREVIEW_MAP[key],
            label: DEFAULT_CULTURES.find((c) => c.tagKey === key)?.label || key,
          }))
          .filter((item) => !!item.url);

        if (previewImages.length === 0) return null;

        return (
          <div className="mt-5 grid grid-cols-2 gap-2 border-t border-outline-variant/10 pt-4">
            {previewImages.map((img) => (
              <div
                key={img.key}
                className="relative group overflow-hidden rounded-xl border border-outline-variant/10 dark:border-outline-variant/15 aspect-[4/3] bg-surface-container-high"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.label}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] font-semibold text-white truncate w-full">
                    {img.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      })()}
    </>
  );
}

function FavorableLegend({ cultureTagKey }: { cultureTagKey: string }) {
  const culture = cultureTagKey
    ? DEFAULT_CULTURES.find((c) => c.tagKey === cultureTagKey)
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
        {FAVORABLE_ACTIVITIES.map((item) => (
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
  const [dayDetail, setDayDetail] = useState<DayDetailState>({
    status: "idle",
  });
  const [publishedByDate, setPublishedByDate] = useState<
    Map<string, PublishedCalendarDayListItem>
  >(() => new Map());
  const [cultureTagKey, setCultureTagKey] = useState(
    () => initialCultureTagKey ?? (isCompact ? "crop.tomato" : CULTURE_ALL),
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

    fetchPublishedCalendarDays(from, to).then((days) => {
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
    return buildMonthCells(year, monthIndex).map((cell) => ({
      ...cell,
      entry: entryByDate.get(cell.key),
      published: publishedByDate.get(cell.key),
    }));
  }, [year, monthIndex, entryByDate, publishedByDate]);

  const monthDays = useMemo(
    () => cells.filter((cell) => cell.inMonth),
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
              ? (dayDetail.day?.moonPhase ??
                published?.moonPhase ??
                entry?.phase)
              : (published?.moonPhase ?? entry?.phase);
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

  const daySigns = useMemo(() => {
    if (!selected) return [];
    const published =
      dayDetail.status === "ready" && dayDetail.day
        ? dayDetail.day
        : selected.published;
    const zodiac = published?.moonZodiacSign?.trim();
    if (!zodiac) return [];
    const phase = published?.moonPhase?.trim() || selected.moon.phase;
    return resolveGeneralDayActivities(phase, zodiac);
  }, [selected, dayDetail]);

  useEffect(() => {
    if (!selectedKey) {
      setDayDetail({ status: "idle" });
      return;
    }

    let cancelled = false;
    setDayDetail({ status: "loading" });

    fetchPublishedCalendarDay(selectedKey)
      .then((day) => {
        if (!cancelled) {
          setDayDetail({ status: "ready", day });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setDayDetail({
            status: "error",
            message: error instanceof Error ? error.message : "ошибка запроса",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedKey]);

  useEffect(() => {
    if (!selectedKey) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedKey(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedKey]);

  function shiftMonth(delta: number) {
    const next = new Date(year, monthIndex + delta, 1);
    setYear(next.getFullYear());
    setMonthIndex(next.getMonth());
    setSelectedKey(null);
  }

  function toggleDay(key: string) {
    setSelectedKey((current) => (current === key ? null : key));
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
              <MaterialIcon name="chevron_left" />
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
              <MaterialIcon name="chevron_right" />
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
            {WEEKDAY_LABELS_RU.map((label) => (
              <div key={label} role="columnheader" className="moon-cal-weekday">
                {label}
              </div>
            ))}

            {cells.map((cell) => {
              const moon = resolveCellMoon(
                cell.date,
                cell.published,
                cell.entry?.phase,
              );
              const isSelected = selectedKey === cell.key;
              const matrix = cell.inMonth
                ? matrixInputForDay(moon.phase, cell.published, cultureTagKey)
                : null;
              const favorable = matrix ? cellFavorableActivities(matrix) : [];
              const tone: DayTone = matrix ? cellDayTone(matrix) : "neutral";
              const hasCmsNote = Boolean(
                cell.published?.title || cell.entry?.note,
              );

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
                    favorable.length > 0 ? "has-favorable" : ""
                  } ${tone !== "neutral" ? `is-tone-${tone}` : ""}`}
                >
                  <div className="moon-cal-cell-bg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={moonPhaseImage(moon.phase)}
                      alt=""
                      className="moon-cal-cell-bg-img"
                    />
                  </div>

                  <div className="moon-cal-cell-head">
                    <div className="moon-cal-cell-head-start">
                      {!isCompact && hasCmsNote ? (
                        <MaterialIcon
                          name="eco"
                          className="text-[10px] text-primary-fixed-dim"
                        />
                      ) : null}
                    </div>
                    <div className="moon-cal-cell-head-end">
                      <span
                        className={`moon-cal-cell-day ${
                          cell.isToday || isSelected ? "is-accent" : ""
                        }`}
                      >
                        {String(cell.day).padStart(2, "0")}
                      </span>
                      <span className="moon-cal-cell-lunar-stack">
                        <span className="moon-cal-cell-lunar">
                          {moon.lunarDay} л.д.
                        </span>
                        {cell.published?.moonZodiacSign ||
                        cell.entry?.zodiacSign ? (
                          <span
                            aria-hidden="true"
                            className="moon-cal-cell-zodiac"
                            title={
                              cell.published?.moonZodiacSign ||
                              cell.entry?.zodiacSign
                            }
                          >
                            {getZodiacSymbol(
                              cell.published?.moonZodiacSign ||
                                cell.entry?.zodiacSign,
                            )}
                          </span>
                        ) : null}
                      </span>
                    </div>
                  </div>

                  <div className="moon-cal-cell-moon-stage">
                    <MaterialIcon
                      name={moonPhaseIcon(moon.phase)}
                      className={`moon-glow text-lg sm:text-2xl ${
                        cell.isToday || isSelected
                          ? "text-primary-container"
                          : "text-on-surface/50 dark:text-on-surface/60"
                      }`}
                    />
                  </div>

                  <div className="moon-cal-cell-foot flex flex-col-reverse items-start gap-0.5">
                    <CellBottomMarks tone={tone} favorable={favorable} />
                    <span className="truncate font-label text-[9px] font-extrabold uppercase tracking-tight text-primary drop-shadow-xs dark:text-primary-container sm:text-[10px] inline-flex items-center gap-1">
                      <MaterialIcon
                        name={moonPhaseIcon(moon.phase)}
                        className="text-[11px] leading-none"
                      />
                      <span>{moonPhaseLabelRu(moon.phase)}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {selected ? (
            isCompact ? (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={() => setSelectedKey(null)}
              >
                <aside
                  className="relative w-full max-w-md overflow-hidden rounded-2xl bg-surface-container-high border border-outline-variant/10 dark:border-outline-variant/15 p-5 shadow-2xl max-h-[85vh] overflow-y-auto"
                  aria-label="Информация о дне"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between gap-2 mb-4 border-b border-outline-variant/10 pb-3">
                    <p className="font-label text-label uppercase tracking-widest text-on-surface-variant">
                      {selected.key}
                    </p>
                    <button
                      type="button"
                      className="text-on-surface-variant hover:text-primary transition-colors"
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
                    daySigns={daySigns}
                    cultureTagKey={cultureTagKey}
                    compact={true}
                  />
                </aside>
              </div>
            ) : (
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
                  daySigns={daySigns}
                  cultureTagKey={cultureTagKey}
                  compact={false}
                />
              </aside>
            )
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
              {monthDays.map((day) => {
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
                      onKeyDown={(event) => {
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
                            <span className="moon-cal-table-today">
                              сегодня
                            </span>
                          ) : null}
                        </time>
                      </td>
                      <td>{weekday}</td>
                      <td>
                        <span className="moon-cal-table-phase inline-flex items-center gap-1.5">
                          <MaterialIcon
                            name={moonPhaseIcon(moon.phase)}
                            className="text-xl text-primary-container moon-glow"
                          />
                          <span>{moonPhaseLabelRu(moon.phase)}</span>
                          {day.published?.moonZodiacSign ||
                          day.entry?.zodiacSign ? (
                            <span className="inline-flex items-center gap-1 ml-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-surface-container-high border border-outline-variant/15 text-secondary">
                              <span
                                aria-hidden="true"
                                className="text-xs font-bold"
                              >
                                {getZodiacSymbol(
                                  day.published?.moonZodiacSign ||
                                    day.entry?.zodiacSign,
                                )}
                              </span>
                              <span>
                                {day.published?.moonZodiacSign ||
                                  day.entry?.zodiacSign}
                              </span>
                            </span>
                          ) : null}
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
                              daySigns={selectedKey === day.key ? daySigns : []}
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
