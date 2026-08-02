/** Activity meta for lunar calendar presentation (icons / labels). */

export type FavorableActivity =
  | "landing"
  | "watering"
  | "nutrients"
  | "harvest"
  | "care"
  | "soil";

/** Day tone for cell presentation — from matrix resolve, not CMS generalState. */
export type DayTone = "favorable" | "unfavorable" | "neutral";

export type FavorableActivityMeta = {
  id: FavorableActivity;
  /** Color emoji glyph for presentation markers / text lines. */
  emoji: string;
  /** Optional Material Symbol (cells / legend); preferred over emoji when set. */
  materialIcon?: string;
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
    materialIcon: "water_drop",
    label: "Полив и увлажнение",
    shortLabel: "Полив",
  },
  {
    id: "nutrients",
    emoji: "🧴",
    materialIcon: "nutrition",
    label: "Удобрения",
    shortLabel: "Удобрения",
  },
  {
    id: "harvest",
    emoji: "🌾",
    label: "Урожай",
    shortLabel: "Урожай",
  },
  {
    id: "care",
    emoji: "✂️",
    materialIcon: "content_cut",
    label: "Уход, прополка, борьба с вредителями",
    shortLabel: "Уход",
  },
  {
    id: "soil",
    emoji: "🪴",
    label: "Работа с почвой",
    shortLabel: "Почва",
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

export function dayToneLabelRu(tone: DayTone): string | null {
  if (tone === "favorable") return "Благоприятный день";
  if (tone === "unfavorable") return "Неблагоприятный день";
  return null;
}

/** Presentation markers for unfavorable (red) days. */
export const UNFAVORABLE_DAY_EMOJIS = ["😠", "👎"] as const;
