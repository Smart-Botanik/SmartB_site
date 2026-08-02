import {
  LUNAR_ACTIVITY_KINDS,
  parseMoonPhase,
  parseZodiacSign,
  plantPartForCropKey,
  resolveDefaultTone,
  zodiacFertility,
  type LunarActivityKind,
  type LunarFavorability,
  type LunarMoonPhase,
  type LunarZodiacSign,
} from "@growing/contracts";

import {
  DEFAULT_CULTURES,
  type DefaultCulture,
} from "./default-cultures";
import {
  FAVORABLE_ACTIVITIES,
  favorableActivityMeta,
  type DayTone,
  type FavorableActivity,
} from "./moon-favorable-days";

const ACTIVITY_TO_UI: Record<LunarActivityKind, FavorableActivity> = {
  LANDING: "landing",
  WATERING: "watering",
  NUTRIENTS: "nutrients",
  HARVEST: "harvest",
  CARE: "care",
};

const WAXING: ReadonlySet<LunarMoonPhase> = new Set([
  "waxing_crescent",
  "first_quarter",
  "waxing_gibbous",
]);

const WANING: ReadonlySet<LunarMoonPhase> = new Set([
  "waning_gibbous",
  "last_quarter",
  "waning_crescent",
]);

const WATER_SIGNS: ReadonlySet<LunarZodiacSign> = new Set([
  "cancer",
  "scorpio",
  "pisces",
]);

const EARTH_SIGNS: ReadonlySet<LunarZodiacSign> = new Set([
  "taurus",
  "virgo",
  "capricorn",
]);

const AIR_SIGNS: ReadonlySet<LunarZodiacSign> = new Set([
  "gemini",
  "libra",
  "aquarius",
]);

/** Max activity icons in a month cell. */
const CELL_ACTIVITY_ICON_LIMIT = 3;

export type FavorableCultureAction = {
  tagKey: string;
  cultureLabel: string;
  cultureEmoji: string;
  activityKind: LunarActivityKind;
  activityId: FavorableActivity;
  activityLabel: string;
  activityEmoji: string;
  /** Display line: «Томаты — Полив» */
  label: string;
};

export type FavorableActivityCultureGroup = {
  activityId: FavorableActivity;
  activityEmoji: string;
  activityShortLabel: string;
  cultures: Array<{
    tagKey: string;
    cultureLabel: string;
    cultureEmoji: string;
  }>;
};

/**
 * Group FAVORABLE pairs by activity for «Полив → 🍅 🥒 …».
 * Order follows FAVORABLE_ACTIVITIES; empty activities omitted.
 */
export function groupFavorableActionsByActivity(
  items: FavorableCultureAction[],
): FavorableActivityCultureGroup[] {
  const byActivity = new Map<
    FavorableActivity,
    Map<string, FavorableActivityCultureGroup["cultures"][number]>
  >();

  for (const item of items) {
    let cultures = byActivity.get(item.activityId);
    if (!cultures) {
      cultures = new Map();
      byActivity.set(item.activityId, cultures);
    }
    if (!cultures.has(item.tagKey)) {
      cultures.set(item.tagKey, {
        tagKey: item.tagKey,
        cultureLabel: item.cultureLabel,
        cultureEmoji: item.cultureEmoji,
      });
    }
  }

  return FAVORABLE_ACTIVITIES.flatMap(meta => {
    const cultures = byActivity.get(meta.id);
    if (!cultures || cultures.size === 0) return [];
    return [
      {
        activityId: meta.id,
        activityEmoji: meta.emoji,
        activityShortLabel: meta.shortLabel,
        cultures: [...cultures.values()],
      },
    ];
  });
}

export type MatrixDayInput = {
  moonPhase: string;
  moonZodiacSign: string;
  /** When set, only this crop; otherwise all DEFAULT_CULTURES. */
  cultureTagKey?: string | null;
  cultures?: DefaultCulture[];
};

function culturesFor(options: MatrixDayInput): DefaultCulture[] {
  const all = options.cultures ?? DEFAULT_CULTURES;
  const key = options.cultureTagKey?.trim();
  if (!key) return all;
  return all.filter(c => c.tagKey === key);
}

function toneForActivity(
  plantPart: ReturnType<typeof plantPartForCropKey>,
  moonPhase: string,
  moonZodiacSign: string,
  activityKind: LunarActivityKind,
): LunarFavorability {
  return resolveDefaultTone({
    plantPart,
    moonPhase,
    moonZodiacSign,
    activityKind,
  });
}

function pushUnique(
  out: FavorableActivity[],
  id: FavorableActivity,
): void {
  if (!out.includes(id)) out.push(id);
}

/**
 * Culture-independent «знаки дня» from phase × zodiac (presentation folklore).
 * Aligns with editorial day copy themes (уход / полив / удобрения / почва),
 * not the crop×activity matrix (ADR-0026).
 */
export function resolveGeneralDayActivities(
  moonPhase: string,
  moonZodiacSign: string,
): FavorableActivity[] {
  const phase = parseMoonPhase(moonPhase);
  const sign = parseZodiacSign(moonZodiacSign);
  if (!phase || !sign) return [];

  const fertility = zodiacFertility(sign);
  if (!fertility) return [];

  const out: FavorableActivity[] = [];
  const isWater = WATER_SIGNS.has(sign);
  const isEarth = EARTH_SIGNS.has(sign);
  const isAir = AIR_SIGNS.has(sign);

  // Уход / прополка / вредители — barren, new/full, earth & air cultivation days
  if (
    fertility === "barren" ||
    phase === "new" ||
    phase === "full" ||
    isEarth ||
    isAir
  ) {
    pushUnique(out, "care");
  }

  // Полив — water signs; fertile waxing (active uptake)
  if (phase !== "new") {
    if (isWater) {
      pushUnique(out, "watering");
    } else if (WAXING.has(phase) && fertility === "fertile") {
      pushUnique(out, "watering");
    }
  }

  // Удобрения — full; fertile waxing (mineral); fertile/water waning (organic)
  if (phase === "full") {
    pushUnique(out, "nutrients");
  } else if (WAXING.has(phase) && fertility === "fertile") {
    pushUnique(out, "nutrients");
  } else if (WANING.has(phase) && (fertility === "fertile" || isWater)) {
    pushUnique(out, "nutrients");
  }

  // Работа с почвой — waning earth/water days
  if (WANING.has(phase) && (isEarth || isWater)) {
    pushUnique(out, "soil");
  }

  return out;
}

/**
 * Common / filtered calendar: FAVORABLE culture × activity pairs
 * via contracts catalog (ADR-0026) — not dated CMS marks.
 */
export function listFavorableCultureActions(
  options: MatrixDayInput,
): FavorableCultureAction[] {
  const items: FavorableCultureAction[] = [];

  for (const culture of culturesFor(options)) {
    const plantPart = plantPartForCropKey(culture.tagKey);
    if (plantPart == null) continue;

    for (const activityKind of LUNAR_ACTIVITY_KINDS) {
      const tone = toneForActivity(
        plantPart,
        options.moonPhase,
        options.moonZodiacSign,
        activityKind,
      );
      if (tone !== "FAVORABLE") continue;

      const activityId = ACTIVITY_TO_UI[activityKind];
      const meta = favorableActivityMeta(activityId);
      const single = Boolean(options.cultureTagKey?.trim());
      items.push({
        tagKey: culture.tagKey,
        cultureLabel: culture.label,
        cultureEmoji: culture.emoji,
        activityKind,
        activityId,
        activityLabel: meta.label,
        activityEmoji: meta.emoji,
        label: single ? meta.label : `${culture.label} — ${meta.label}`,
      });
    }
  }

  return items;
}

/**
 * Favorable activity icons for a cell.
 * — selected culture → crop×activity matrix
 * — «Все» → general day signs (phase × zodiac), not culture emojis
 */
export function cellFavorableActivities(
  options: MatrixDayInput,
): FavorableActivity[] {
  if (!options.cultureTagKey?.trim()) {
    return resolveGeneralDayActivities(
      options.moonPhase,
      options.moonZodiacSign,
    ).slice(0, CELL_ACTIVITY_ICON_LIMIT);
  }

  const seen = new Set<FavorableActivity>();
  const out: FavorableActivity[] = [];
  for (const item of listFavorableCultureActions(options)) {
    if (seen.has(item.activityId)) continue;
    seen.add(item.activityId);
    out.push(item.activityId);
    if (out.length >= CELL_ACTIVITY_ICON_LIMIT) break;
  }
  return out;
}

/**
 * Cell tone for a selected culture (never from CMS generalState).
 * LANDING UNFAVORABLE → unfavorable; any FAVORABLE → favorable; else neutral.
 * «All cultures» → favorable when general day has work signs; else neutral.
 */
export function cellDayTone(options: MatrixDayInput): DayTone {
  const key = options.cultureTagKey?.trim();
  if (!key) {
    const signs = resolveGeneralDayActivities(
      options.moonPhase,
      options.moonZodiacSign,
    );
    return signs.length > 0 ? "favorable" : "neutral";
  }

  const culture = (options.cultures ?? DEFAULT_CULTURES).find(
    c => c.tagKey === key,
  );
  if (!culture) return "neutral";

  const plantPart = plantPartForCropKey(culture.tagKey);
  if (plantPart == null) return "neutral";

  const landing = toneForActivity(
    plantPart,
    options.moonPhase,
    options.moonZodiacSign,
    "LANDING",
  );
  if (landing === "UNFAVORABLE") return "unfavorable";

  for (const activityKind of LUNAR_ACTIVITY_KINDS) {
    if (
      toneForActivity(
        plantPart,
        options.moonPhase,
        options.moonZodiacSign,
        activityKind,
      ) === "FAVORABLE"
    ) {
      return "favorable";
    }
  }

  return "neutral";
}
