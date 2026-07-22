/** Approximate lunar phase helpers for calendar viz (not ephemeris-grade). */

export type MoonPhaseId =
  | "new"
  | "waxing_crescent"
  | "first_quarter"
  | "waxing_gibbous"
  | "full"
  | "waning_gibbous"
  | "last_quarter"
  | "waning_crescent";

const SYNODIC_DAYS = 29.53058867;
/** Known new moon near epoch (UTC midnight). */
const KNOWN_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0);

const PHASE_ICONS: Record<MoonPhaseId, string> = {
  new: "brightness_1",
  waxing_crescent: "brightness_2",
  first_quarter: "brightness_3",
  waxing_gibbous: "brightness_4",
  full: "brightness_5",
  waning_gibbous: "brightness_6",
  last_quarter: "brightness_7",
  waning_crescent: "dark_mode",
};

const PHASE_LABELS_RU: Record<MoonPhaseId, string> = {
  new: "Новолуние",
  waxing_crescent: "Растущий серп",
  first_quarter: "Первая четверть",
  waxing_gibbous: "Растущая",
  full: "Полнолуние",
  waning_gibbous: "Убывающая",
  last_quarter: "Последняя четверть",
  waning_crescent: "Убывающий серп",
};

const PHASE_ALIASES: Record<string, MoonPhaseId> = {
  new: "new",
  новолуние: "new",
  waxing_crescent: "waxing_crescent",
  crescent: "waxing_crescent",
  first_quarter: "first_quarter",
  "1q": "first_quarter",
  waxing_gibbous: "waxing_gibbous",
  full: "full",
  полнолуние: "full",
  waning_gibbous: "waning_gibbous",
  last_quarter: "last_quarter",
  "3q": "last_quarter",
  waning_crescent: "waning_crescent",
};

export function parseMoonPhase(value: string | undefined): MoonPhaseId | undefined {
  if (!value?.trim()) {
    return undefined;
  }
  const key = value.trim().toLowerCase().replace(/\s+/g, "_");
  return PHASE_ALIASES[key];
}

export function moonAgeDays(date: Date): number {
  const ms = date.getTime() - KNOWN_NEW_MOON_MS;
  const age = (ms / 86400000) % SYNODIC_DAYS;
  return age < 0 ? age + SYNODIC_DAYS : age;
}

export function phaseFromAge(age: number): MoonPhaseId {
  const t = age / SYNODIC_DAYS;
  if (t < 0.03 || t >= 0.97) return "new";
  if (t < 0.22) return "waxing_crescent";
  if (t < 0.28) return "first_quarter";
  if (t < 0.47) return "waxing_gibbous";
  if (t < 0.53) return "full";
  if (t < 0.72) return "waning_gibbous";
  if (t < 0.78) return "last_quarter";
  return "waning_crescent";
}

export function lunarDayFromAge(age: number): number {
  return Math.min(30, Math.floor(age) + 1);
}

export function illuminationPercent(age: number): number {
  const fraction = 0.5 * (1 - Math.cos((2 * Math.PI * age) / SYNODIC_DAYS));
  return Math.round(fraction * 100);
}

export function moonPhaseIcon(phase: MoonPhaseId): string {
  return PHASE_ICONS[phase];
}

export function moonPhaseLabelRu(phase: MoonPhaseId): string {
  return PHASE_LABELS_RU[phase];
}

export function resolveMoonPhase(
  date: Date,
  cmsPhase?: string,
): { phase: MoonPhaseId; age: number; lunarDay: number; illumination: number } {
  const age = moonAgeDays(date);
  const parsed = parseMoonPhase(cmsPhase);
  const phase = parsed ?? phaseFromAge(age);
  return {
    phase,
    age,
    lunarDay: lunarDayFromAge(age),
    illumination: illuminationPercent(age),
  };
}

/** Local YYYY-MM-DD (no UTC shift). */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function startOfMonth(year: number, monthIndex: number): Date {
  return new Date(year, monthIndex, 1);
}

/** Monday-first weekday index 0..6 */
export function mondayWeekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

const MONTH_LABELS_RU = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export function monthTitleRu(year: number, monthIndex: number): string {
  return `${MONTH_LABELS_RU[monthIndex]} ${year}`;
}

export const WEEKDAY_LABELS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;
