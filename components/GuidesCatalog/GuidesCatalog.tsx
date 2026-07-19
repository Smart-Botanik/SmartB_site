import Link from "next/link";

import { GuidesKnowledgeSections } from "@/components/GuidesKnowledgeSections";
import { DEFAULT_CULTURES } from "@/lib/default-cultures";
import {
  fetchPublishedCropGuides,
  sortPublishedGuides,
  type CropGuide,
} from "@/lib/content-api";
import {
  getGuideSectionNavLinks,
  partitionGuidesByKnowledgeSection,
  type GuideKnowledgeSection,
} from "@/lib/guide-sections";
import {
  guideCultureHubHref,
  guideSectionNavHref,
  type GuideLinkVariant,
} from "@/lib/guide-view-paths";

type GuidesCatalogProps = {
  guidesBySection: Record<GuideKnowledgeSection, CropGuide[]>;
  variant?: GuideLinkVariant;
};

export function GuidesCatalog({ guidesBySection, variant = "default" }: GuidesCatalogProps) {
  const isView = variant === "view";

  return (
    <div
      className={
        isView
          ? "guide-view-page mx-auto max-w-[960px] px-6 pb-20 pt-6"
          : "mx-auto max-w-container-max px-gutter pb-20 pt-16"
      }
    >
      <div className="relative mb-12">
        <div className="hero-gradient absolute inset-0 -z-10" />
        <div className="mb-2 flex flex-col gap-1">
          <span className="font-label text-label uppercase tracking-widest text-primary-fixed-dim">
            База знаний
          </span>
          <h1 className="font-display text-display text-primary md:text-[64px] md:leading-tight">
            Гайды и материалы
          </h1>
        </div>
        <p className="max-w-2xl font-body text-on-surface-variant">
          Выращивание, закрутка, репорты и подборки — всё для цикла от семени до банки.
          Выберите раздел или культуру ниже.
        </p>
      </div>

      <nav className="mb-12 flex flex-wrap gap-2" aria-label="Разделы базы знаний">
        {getGuideSectionNavLinks().map(item => (
          <a
            key={item.href}
            href={guideSectionNavHref(item.sectionId, variant)}
            className="rounded-full border border-outline-variant/30 bg-surface-container-low px-4 py-2 text-sm text-on-surface-variant transition-colors hover:border-primary-container hover:text-primary-container"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <nav className="mb-12 flex flex-wrap gap-2" aria-label="Культуры">
        {DEFAULT_CULTURES.map(culture => (
          <Link
            key={culture.tagKey}
            href={guideCultureHubHref(culture.hubSlug, variant)}
            className="inline-flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:border-primary-container hover:text-primary-container"
          >
            <span className="text-base leading-none" aria-hidden>
              {culture.emoji}
            </span>
            {culture.label}
          </Link>
        ))}
      </nav>

      <GuidesKnowledgeSections guidesBySection={guidesBySection} linkVariant={variant} />
    </div>
  );
}

export async function loadGuidesCatalogData() {
  let guidesBySection = partitionGuidesByKnowledgeSection([]);

  try {
    const guides = sortPublishedGuides(await fetchPublishedCropGuides());
    guidesBySection = partitionGuidesByKnowledgeSection(guides);
  } catch {
    /* пустые разделы — placeholder в UI */
  }

  return guidesBySection;
}
