import { GuidePreviewCard } from "@/components/GuidePreviewCard";
import type { CropGuide } from "@/lib/content-api";
import type { GuideLinkVariant } from "@/lib/guide-view-paths";
import {
  GUIDE_SECTION_META,
  type GuideKnowledgeSection,
} from "@/lib/guide-sections";

type GuidesKnowledgeSectionsProps = {
  guidesBySection: Record<GuideKnowledgeSection, CropGuide[]>;
  linkVariant?: GuideLinkVariant;
  /** Какие разделы показать; по умолчанию все */
  sectionIds?: GuideKnowledgeSection[];
};

function SectionHeader({
  id,
  title,
  subtitle,
  accentClass,
}: {
  id: string;
  title: string;
  subtitle: string;
  accentClass: string;
}) {
  return (
    <div id={id} className="mb-6 flex scroll-mt-28 items-end justify-between">
      <div className="flex flex-col">
        <h2 className="font-headline text-headline text-primary">{title}</h2>
        <div className={`mt-1 h-1 w-24 ${accentClass}`} />
        <p className="mt-2 max-w-xl text-on-surface-variant">{subtitle}</p>
      </div>
    </div>
  );
}

function GuideSectionGrid({
  sectionId,
  guides,
  linkVariant = "default",
}: {
  sectionId: GuideKnowledgeSection;
  guides: CropGuide[];
  linkVariant?: GuideLinkVariant;
}) {
  const meta = GUIDE_SECTION_META[sectionId];

  return (
    <section>
      <SectionHeader
        id={sectionId}
        title={meta.title}
        subtitle={meta.subtitle}
        accentClass={meta.accentClass}
      />

      {guides.length > 0 ? (
        <ul className="guide-preview-list grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guides.map(guide => (
            <li key={guide.id}>
              <GuidePreviewCard guide={guide} linkVariant={linkVariant} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-outline-variant/40 bg-surface-container-low px-6 py-10 text-center text-on-surface-variant">
          Пока нет опубликованных материалов в этом разделе. Скоро добавим статьи.
        </p>
      )}
    </section>
  );
}

const DEFAULT_SECTION_IDS: GuideKnowledgeSection[] = [
  "growing",
  "preserving",
  "reports",
  "interesting",
];

export function GuidesKnowledgeSections({
  guidesBySection,
  linkVariant = "default",
  sectionIds = DEFAULT_SECTION_IDS,
}: GuidesKnowledgeSectionsProps) {
  return (
    <div className="space-y-20">
      {sectionIds.map(sectionId => (
        <GuideSectionGrid
          key={sectionId}
          sectionId={sectionId}
          guides={guidesBySection[sectionId]}
          linkVariant={linkVariant}
        />
      ))}
    </div>
  );
}