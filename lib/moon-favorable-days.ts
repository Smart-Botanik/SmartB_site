/** Demo favorable-day markers for calendar presentation (hardcoded; CMS later). */

import type { MoonPhaseId } from "@/lib/moon-phase";

export type FavorableActivity =
  | "landing"
  | "watering"
  | "nutrients"
  | "harvest"
  | "care";

/** General lunar day tone (favorable / not) for presentation tint. */
export type DayTone = "favorable" | "unfavorable" | "neutral";

export type FavorableActivityMeta = {
  id: FavorableActivity;
  /** Color emoji glyph for presentation markers. */
  emoji: string;
  label: string;
  shortLabel: string;
};

export const FAVORABLE_ACTIVITIES: FavorableActivityMeta[] = [
  {
    id: "landing",
    emoji: "🌱",
    label: "Посадка",
    shortLabel: "Посадка",
  },
  {
    id: "watering",
    emoji: "💧",
    label: "Полив",
    shortLabel: "Полив",
  },
  {
    id: "nutrients",
    emoji: "🧪",
    label: "Подкормка",
    shortLabel: "Питание",
  },
  {
    id: "harvest",
    emoji: "🌾",
    label: "Урожай",
    shortLabel: "Урожай",
  },
  {
    id: "care",
    emoji: "🧤",
    label: "Уход",
    shortLabel: "Уход",
  },
];

const META_BY_ID = Object.fromEntries(
  FAVORABLE_ACTIVITIES.map(item => [item.id, item]),
) as Record<FavorableActivity, FavorableActivityMeta>;

export function favorableActivityMeta(
  id: FavorableActivity,
): FavorableActivityMeta {
  return META_BY_ID[id];
}

/**
 * Rough moon-phase → day tone for presentation.
 * Most phases favorable; only new/full marked unfavorable (demo bias).
 */
export function dayToneFromPhase(phase: MoonPhaseId): DayTone {
  switch (phase) {
    case "new":
    case "full":
      return "unfavorable";
    case "waxing_crescent":
    case "first_quarter":
    case "waxing_gibbous":
    case "waning_gibbous":
    case "last_quarter":
    case "waning_crescent":
      return "favorable";
    default:
      return "favorable";
  }
}

export function dayToneLabelRu(tone: DayTone): string | null {
  if (tone === "favorable") return "Благоприятный день";
  if (tone === "unfavorable") return "Неблагоприятный день";
  return null;
}

/** Presentation markers for unfavorable (red) days. */
export const UNFAVORABLE_DAY_EMOJIS = ["😠", "👎"] as const;

/**
 * Day-of-month → favorable activities (applies to any viewed month).
 * Presentation sample only — replace with CMS later.
 */
export const DEMO_FAVORABLE_BY_DAY: Record<number, FavorableActivity[]> = {
  1: ["care"],
  2: ["watering"],
  3: ["landing", "care"],
  5: ["nutrients"],
  6: ["watering", "care"],
  8: ["landing"],
  9: ["watering", "nutrients"],
  11: ["harvest"],
  12: ["care", "watering"],
  14: ["landing", "watering"],
  15: ["nutrients", "care"],
  17: ["watering"],
  18: ["harvest", "care"],
  20: ["landing", "nutrients"],
  21: ["watering", "care"],
  23: ["watering", "landing"],
  24: ["care"],
  26: ["harvest"],
  27: ["nutrients", "watering"],
  28: ["landing", "care"],
  30: ["watering", "harvest"],
};

export function favorableForDay(dayOfMonth: number): FavorableActivity[] {
  return DEMO_FAVORABLE_BY_DAY[dayOfMonth] ?? [];
}
