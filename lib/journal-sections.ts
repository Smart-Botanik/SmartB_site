export type JournalIntroSection = {
  type: "journalIntro";
  title?: string;
  subtitle?: string;
};

export type ParsedJournalSections = {
  intro: {
    title: string;
    subtitle: string;
  };
};

const DEFAULT_INTRO = {
  title: "Журнал выращивания",
  subtitle:
    "Точная аналитика и живые заметки из циклов. Новости платформы, эксперименты сообщества и обновления из нашей сети гроверов.",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function getDefaultJournalSections(): ParsedJournalSections {
  return {
    intro: { ...DEFAULT_INTRO },
  };
}

export function parseJournalSections(sections: unknown): ParsedJournalSections {
  const result = getDefaultJournalSections();

  if (!Array.isArray(sections)) {
    return result;
  }

  for (const section of sections.filter(isRecord)) {
    if (section.type !== "journalIntro") {
      continue;
    }
    result.intro = {
      title: asOptionalString(section.title) ?? result.intro.title,
      subtitle: asOptionalString(section.subtitle) ?? result.intro.subtitle,
    };
  }

  return result;
}
