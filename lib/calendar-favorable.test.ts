import { describe, expect, it } from "vitest";

import {
  groupFavorableActionsByActivity,
  resolveGeneralDayActivities,
  type FavorableCultureAction,
} from "./calendar-favorable";

describe("resolveGeneralDayActivities", () => {
  it("waxing crescent in Virgo → care (уход / прополка)", () => {
    expect(
      resolveGeneralDayActivities("waxing_crescent", "virgo"),
    ).toEqual(["care"]);
  });

  it("waning gibbous in Pisces → watering, nutrients, soil", () => {
    expect(
      resolveGeneralDayActivities("waning_gibbous", "pisces"),
    ).toEqual(["watering", "nutrients", "soil"]);
  });

  it("returns empty without valid phase/zodiac", () => {
    expect(resolveGeneralDayActivities("", "virgo")).toEqual([]);
    expect(resolveGeneralDayActivities("full", "")).toEqual([]);
  });
});

describe("groupFavorableActionsByActivity", () => {
  const items: FavorableCultureAction[] = [
    {
      tagKey: "crop.tomato",
      cultureLabel: "Томаты",
      cultureEmoji: "🍅",
      activityKind: "WATERING",
      activityId: "watering",
      activityLabel: "Полив и увлажнение",
      activityEmoji: "💧",
      label: "Полив",
    },
    {
      tagKey: "crop.cucumber",
      cultureLabel: "Огурцы",
      cultureEmoji: "🥒",
      activityKind: "WATERING",
      activityId: "watering",
      activityLabel: "Полив и увлажнение",
      activityEmoji: "💧",
      label: "Полив",
    },
    {
      tagKey: "crop.tomato",
      cultureLabel: "Томаты",
      cultureEmoji: "🍅",
      activityKind: "HARVEST",
      activityId: "harvest",
      activityLabel: "Урожай",
      activityEmoji: "🌾",
      label: "Урожай",
    },
  ];

  it("groups by activity with culture emojis, ordered by activity catalog", () => {
    const groups = groupFavorableActionsByActivity(items);
    expect(groups.map(g => g.activityId)).toEqual(["watering", "harvest"]);
    expect(groups[0].cultures.map(c => c.tagKey)).toEqual([
      "crop.tomato",
      "crop.cucumber",
    ]);
    expect(groups[1].cultures).toHaveLength(1);
  });
});
