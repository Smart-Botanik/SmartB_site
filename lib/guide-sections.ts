import type { CropGuide } from "./content-api";

export type GuideKnowledgeSection = "growing" | "preserving" | "reports" | "interesting";

/** TOPIC keys → раздел знаний (канон для редакторов). */
export const GUIDE_SECTION_TOPIC_KEYS: Record<
  Exclude<GuideKnowledgeSection, "growing">,
  string[]
> = {
  preserving: ["topic.preserving", "topic.preservation", "topic.canning"],
  reports: ["topic.reports", "topic.report"],
  interesting: ["topic.interesting"],
};

export const GUIDE_SECTION_ORDER: GuideKnowledgeSection[] = [
  "growing",
  "preserving",
  "reports",
  "interesting",
];

/** Канонические маршруты разделов (не якоря на `/guides`). */
export const GUIDE_SECTION_PAGE_HREF: Record<GuideKnowledgeSection, string> = {
  growing: "/guides",
  preserving: "/preserving",
  reports: "/reports",
  interesting: "/useful",
};

/** На `/guides` остаётся только выращивание. */
export const GUIDES_CATALOG_SECTION_IDS: GuideKnowledgeSection[] = ["growing"];

const SECTION_ORDER = GUIDE_SECTION_ORDER;

export const GUIDE_SECTION_META: Record<
  GuideKnowledgeSection,
  { title: string; subtitle: string; accentClass: string }
> = {
  growing: {
    title: "Выращивание",
    subtitle: "Техники, субстраты, свет и полив — от рассады до урожая.",
    accentClass: "bg-primary-container",
  },
  preserving: {
    title: "Закрутка",
    subtitle: "Консервирование, маринование и хранение урожая.",
    accentClass: "bg-secondary-fixed-dim",
  },
  reports: {
    title: "Репорты",
    subtitle: "Публичные гроу-репорты с заметками, метриками и фото по неделям.",
    accentClass: "bg-secondary-fixed-dim",
  },
  interesting: {
    title: "Полезное",
    subtitle: "Подборки, эксперименты и истории из сообщества.",
    accentClass: "bg-tertiary-container",
  },
};

function guideTopicKeys(guide: CropGuide): string[] {
  return (guide.taxonomyTags ?? []).map(tag => tag.key);
}

export function resolveGuideKnowledgeSection(guide: CropGuide): GuideKnowledgeSection {
  const keys = guideTopicKeys(guide);

  for (const section of SECTION_ORDER) {
    if (section === "growing") {
      continue;
    }
    const topicKeys = GUIDE_SECTION_TOPIC_KEYS[section];
    if (topicKeys.some(key => keys.includes(key))) {
      return section;
    }
  }

  return "growing";
}

export type GuideSectionNavLink = {
  href: string;
  label: string;
  sectionId: GuideKnowledgeSection;
};

export function getGuideSectionNavLinks(): GuideSectionNavLink[] {
  return GUIDE_SECTION_ORDER.map(sectionId => ({
    sectionId,
    href: GUIDE_SECTION_PAGE_HREF[sectionId],
    label: GUIDE_SECTION_META[sectionId].title,
  }));
}

export function partitionGuidesByKnowledgeSection(
  guides: CropGuide[],
): Record<GuideKnowledgeSection, CropGuide[]> {
  const buckets: Record<GuideKnowledgeSection, CropGuide[]> = {
    growing: [],
    preserving: [],
    reports: [],
    interesting: [],
  };

  for (const guide of guides) {
    buckets[resolveGuideKnowledgeSection(guide)].push(guide);
  }

  return buckets;
}
