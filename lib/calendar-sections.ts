export type CalendarModeId = "moon" | "seasons";

export type CalendarIntroSection = {
  type: "calendarIntro";
  title?: string;
  subtitle?: string;
  defaultMode?: CalendarModeId;
};

export type CalendarModeSection = {
  type: "calendarMode";
  mode: CalendarModeId;
  label?: string;
  descriptionMd?: string;
  /** Mode-specific CMS payload; shape evolves with editors. */
  data?: unknown;
};

export type CalendarLunarGuidePhase = {
  id: "new" | "waxing" | "full" | "waning" | string;
  label: string;
  body: string;
  imageSrc: string;
};

export type CalendarLunarGuideZodiacSign = {
  symbol: string;
  name: string;
};

export type CalendarLunarGuideZodiacGroup = {
  id: "fertile" | "neutral" | "barren" | string;
  label: string;
  signs: CalendarLunarGuideZodiacSign[];
  body: string;
};

/** Simple «how to use lunar calendar» block on `/calendar`. */
export type CalendarLunarGuideSection = {
  type: "calendarLunarGuide";
  title: string;
  subtitle?: string;
  phases: CalendarLunarGuidePhase[];
  tips: string[];
  zodiacGroups: CalendarLunarGuideZodiacGroup[];
};

export type ParsedCalendarSections = {
  intro: CalendarIntroSection;
  modes: Record<CalendarModeId, CalendarModeSection>;
  lunarGuide: CalendarLunarGuideSection;
  defaultMode: CalendarModeId;
};

const MODE_IDS: CalendarModeId[] = ["moon", "seasons"];

const DEFAULT_INTRO: CalendarIntroSection = {
  type: "calendarIntro",
  title: "Лунный календарь",
  subtitle: "Лунный календарь для работ в саду — фазы и подсказки по дням.",
  defaultMode: "moon",
};

const DEFAULT_MODES: Record<CalendarModeId, CalendarModeSection> = {
  moon: {
    type: "calendarMode",
    mode: "moon",
    label: "Лунный календарь",
    descriptionMd:
      "Фазы Луны и краткие подсказки по дням. Данные редактируются в админке.",
    data: {
      year: 2026,
      entries: [] as Array<{ date: string; phase?: string; note?: string }>,
    },
  },
  seasons: {
    type: "calendarMode",
    mode: "seasons",
    label: "Сезонный календарь",
    descriptionMd:
      "Окна сезонов и сезонные работы. Данные редактируются в админке.",
    data: {
      year: 2026,
      seasons: [] as Array<{
        id: string;
        label: string;
        start?: string;
        end?: string;
        note?: string;
      }>,
    },
  },
};

/** Compact RU howto — phases + tips + zodiac (with symbols). */
export const DEFAULT_LUNAR_GUIDE: CalendarLunarGuideSection = {
  type: "calendarLunarGuide",
  title: "Как пользоваться лунным календарём",
  subtitle: "Кратко о фазах, подкормках и знаках зодиака для посева.",
  phases: [
    {
      id: "new",
      label: "Новолуние",
      imageSrc: "/calendar/moon-phase-new.svg",
      body: "Худшее время для посадок: не сажайте и не пересаживайте. Неблагоприятны три дня — день до, новолуние и день после.",
    },
    {
      id: "waxing",
      label: "Растущая Луна",
      imageSrc: "/calendar/moon-phase-waxing.svg",
      body: "Соки тянутся вверх — лучшее время для надземных культур (зелень, травы, фрукты, овощи, цветы): посадка, пересадка, прививка.",
    },
    {
      id: "full",
      label: "Полнолуние",
      imageSrc: "/calendar/moon-phase-full.svg",
      body: "Один день без посадок и пересадок. Можно полоть, подкармливать и обрабатывать от вредителей.",
    },
    {
      id: "waning",
      label: "Убывающая Луна",
      imageSrc: "/calendar/moon-phase-waning.svg",
      body: "Энергия к корням — работайте с корнеплодами и луковичными.",
    },
  ],
  tips: [
    "Сажайте на рассвете или до обеда.",
    "На растущей Луне — минеральные подкормки; на убывающей — органические.",
  ],
  zodiacGroups: [
    {
      id: "fertile",
      label: "Плодородные",
      signs: [
        { symbol: "♋", name: "Рак" },
        { symbol: "♉", name: "Телец" },
        { symbol: "♏", name: "Скорпион" },
        { symbol: "♓", name: "Рыбы" },
      ],
      body: "Лучшие дни для посева и посадки — всходы сильнее, урожай выше.",
    },
    {
      id: "neutral",
      label: "Нейтральные",
      signs: [
        { symbol: "♍", name: "Дева" },
        { symbol: "♐", name: "Стрелец" },
        { symbol: "♎", name: "Весы" },
        { symbol: "♑", name: "Козерог" },
      ],
      body: "Сеять и сажать можно, урожай скорее средний.",
    },
    {
      id: "barren",
      label: "Неплодородные",
      signs: [
        { symbol: "♊", name: "Близнецы" },
        { symbol: "♒", name: "Водолей" },
        { symbol: "♌", name: "Лев" },
        { symbol: "♈", name: "Овен" },
      ],
      body: "От посева лучше отказаться — полоть и делать другие огородные работы.",
    },
  ],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseModeId(value: unknown): CalendarModeId | undefined {
  if (value === "moon" || value === "seasons") {
    return value;
  }
  return undefined;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function parsePhases(value: unknown): CalendarLunarGuidePhase[] {
  if (!Array.isArray(value)) {
    return structuredClone(DEFAULT_LUNAR_GUIDE.phases);
  }
  const phases = value.filter(isRecord).flatMap(item => {
    const id = asOptionalString(item.id);
    const label = asOptionalString(item.label);
    const body = asOptionalString(item.body);
    const imageSrc = asOptionalString(item.imageSrc);
    if (!id || !label || !body || !imageSrc) {
      return [];
    }
    return [{ id, label, body, imageSrc }];
  });
  return phases.length > 0 ? phases : structuredClone(DEFAULT_LUNAR_GUIDE.phases);
}

function parseTips(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [...DEFAULT_LUNAR_GUIDE.tips];
  }
  const tips = value.filter((tip): tip is string => typeof tip === "string" && tip.trim().length > 0);
  return tips.length > 0 ? tips : [...DEFAULT_LUNAR_GUIDE.tips];
}

function parseZodiacGroups(value: unknown): CalendarLunarGuideZodiacGroup[] {
  if (!Array.isArray(value)) {
    return structuredClone(DEFAULT_LUNAR_GUIDE.zodiacGroups);
  }
  const groups = value.filter(isRecord).flatMap(group => {
    const id = asOptionalString(group.id);
    const label = asOptionalString(group.label);
    const body = asOptionalString(group.body);
    if (!id || !label || !body || !Array.isArray(group.signs)) {
      return [];
    }
    const signs = group.signs.filter(isRecord).flatMap(sign => {
      const symbol = asOptionalString(sign.symbol);
      const name = asOptionalString(sign.name);
      if (!symbol || !name) {
        return [];
      }
      return [{ symbol, name }];
    });
    if (signs.length === 0) {
      return [];
    }
    return [{ id, label, signs, body }];
  });
  return groups.length > 0 ? groups : structuredClone(DEFAULT_LUNAR_GUIDE.zodiacGroups);
}

function parseLunarGuide(section: Record<string, unknown>): CalendarLunarGuideSection {
  return {
    type: "calendarLunarGuide",
    title:
      asOptionalString(section.title) ?? DEFAULT_LUNAR_GUIDE.title,
    subtitle:
      asOptionalString(section.subtitle) ?? DEFAULT_LUNAR_GUIDE.subtitle,
    phases: parsePhases(section.phases),
    tips: parseTips(section.tips),
    zodiacGroups: parseZodiacGroups(section.zodiacGroups),
  };
}

export function getDefaultCalendarSections(): ParsedCalendarSections {
  return {
    intro: { ...DEFAULT_INTRO },
    modes: {
      moon: { ...DEFAULT_MODES.moon, data: structuredClone(DEFAULT_MODES.moon.data) },
      seasons: {
        ...DEFAULT_MODES.seasons,
        data: structuredClone(DEFAULT_MODES.seasons.data),
      },
    },
    lunarGuide: structuredClone(DEFAULT_LUNAR_GUIDE),
    defaultMode: "moon",
  };
}

/** Raw sections array for seed / admin defaults. */
export function getDefaultCalendarSectionsJson(): unknown[] {
  const defaults = getDefaultCalendarSections();
  return [
    defaults.intro,
    defaults.modes.moon,
    defaults.modes.seasons,
    defaults.lunarGuide,
  ];
}

export function parseCalendarSections(sections: unknown): ParsedCalendarSections {
  const result = getDefaultCalendarSections();

  if (!Array.isArray(sections)) {
    return result;
  }

  for (const section of sections.filter(isRecord)) {
    if (section.type === "calendarIntro") {
      const defaultMode = parseModeId(section.defaultMode) ?? result.defaultMode;
      result.intro = {
        type: "calendarIntro",
        title: asOptionalString(section.title) ?? result.intro.title,
        subtitle: asOptionalString(section.subtitle) ?? result.intro.subtitle,
        defaultMode,
      };
      result.defaultMode = defaultMode;
      continue;
    }

    if (section.type === "calendarMode") {
      const mode = parseModeId(section.mode);
      if (!mode) {
        continue;
      }
      result.modes[mode] = {
        type: "calendarMode",
        mode,
        label: asOptionalString(section.label) ?? result.modes[mode].label,
        descriptionMd:
          asOptionalString(section.descriptionMd) ?? result.modes[mode].descriptionMd,
        data: "data" in section ? section.data : result.modes[mode].data,
      };
      continue;
    }

    if (section.type === "calendarLunarGuide") {
      result.lunarGuide = parseLunarGuide(section);
    }
  }

  if (result.intro.defaultMode) {
    result.defaultMode = result.intro.defaultMode;
  }

  return result;
}

export function listCalendarModes(
  parsed: ParsedCalendarSections,
): CalendarModeSection[] {
  return MODE_IDS.map(id => parsed.modes[id]);
}

export type MoonCalendarEntry = {
  date: string;
  phase?: string;
  note?: string;
};

export type SeasonCalendarWindow = {
  id: string;
  label: string;
  start?: string;
  end?: string;
  note?: string;
};

export function parseMoonEntries(data: unknown): MoonCalendarEntry[] {
  if (!isRecord(data) || !Array.isArray(data.entries)) {
    return [];
  }
  return data.entries.filter(isRecord).flatMap(entry => {
    const date = asOptionalString(entry.date);
    if (!date) {
      return [];
    }
    return [
      {
        date,
        phase: asOptionalString(entry.phase),
        note: asOptionalString(entry.note),
      },
    ];
  });
}

export function parseSeasonWindows(data: unknown): SeasonCalendarWindow[] {
  if (!isRecord(data) || !Array.isArray(data.seasons)) {
    return [];
  }
  return data.seasons.filter(isRecord).flatMap(season => {
    const id = asOptionalString(season.id);
    const label = asOptionalString(season.label);
    if (!id || !label) {
      return [];
    }
    return [
      {
        id,
        label,
        start: asOptionalString(season.start),
        end: asOptionalString(season.end),
        note: asOptionalString(season.note),
      },
    ];
  });
}
