import {
  LUNAR_ACTIVITY_KINDS,
  plantPartForCropKey,
  resolveDefaultTone,
  type LunarActivityKind,
  type LunarFavorability,
} from "@growing/contracts";

import {
  DEFAULT_CULTURES,
  type DefaultCulture,
} from "./default-cultures";
import {
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

/** Favorable activity icons for a cell (selected culture, or empty if «all»). */
export function cellFavorableActivities(
  options: MatrixDayInput,
): FavorableActivity[] {
  if (!options.cultureTagKey?.trim()) {
    return [];
  }
  const seen = new Set<FavorableActivity>();
  const out: FavorableActivity[] = [];
  for (const item of listFavorableCultureActions(options)) {
    if (seen.has(item.activityId)) continue;
    seen.add(item.activityId);
    out.push(item.activityId);
  }
  return out;
}

/**
 * Cell tone for a selected culture (never from CMS generalState).
 * LANDING UNFAVORABLE → unfavorable; any FAVORABLE → favorable; else neutral.
 * «All cultures» → always neutral (no cell paint).
 */
export function cellDayTone(options: MatrixDayInput): DayTone {
  const key = options.cultureTagKey?.trim();
  if (!key) return "neutral";

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
