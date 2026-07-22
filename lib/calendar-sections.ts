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

export type ParsedCalendarSections = {
  intro: CalendarIntroSection;
  modes: Record<CalendarModeId, CalendarModeSection>;
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
    defaultMode: "moon",
  };
}

/** Raw sections array for seed / admin defaults. */
export function getDefaultCalendarSectionsJson(): unknown[] {
  const defaults = getDefaultCalendarSections();
  return [defaults.intro, defaults.modes.moon, defaults.modes.seasons];
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
