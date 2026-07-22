import { GuidesKnowledgeSections } from "@/components/GuidesKnowledgeSections";
import {
  fetchPublishedCropGuides,
  sortPublishedGuides,
} from "@/lib/content-api";
import {
  GUIDE_SECTION_META,
  getGuideSectionNavLinks,
  partitionGuidesByKnowledgeSection,
  type GuideKnowledgeSection,
} from "@/lib/guide-sections";
import { guideSectionNavHref } from "@/lib/guide-view-paths";

type KnowledgeSectionPageProps = {
  sectionId: Exclude<GuideKnowledgeSection, "growing">;
};

export async function KnowledgeSectionPage({ sectionId }: KnowledgeSectionPageProps) {
  const meta = GUIDE_SECTION_META[sectionId];
  let guidesBySection = partitionGuidesByKnowledgeSection([]);

  try {
    const guides = sortPublishedGuides(await fetchPublishedCropGuides());
    guidesBySection = partitionGuidesByKnowledgeSection(guides);
  } catch {
    /* empty section placeholder */
  }

  return (
    <div className="mx-auto max-w-container-max px-gutter pb-20 pt-16">
      <div className="relative mb-12 px-[12px] py-[24px]">
        <div className="hero-gradient absolute inset-0 -z-10" />
        <div className="mb-2 flex flex-col gap-1">
          <span className="font-label text-label uppercase tracking-widest text-primary-fixed-dim">
            База знаний
          </span>
          <h1 className="font-display text-display text-primary md:text-[64px] md:leading-tight">
            {meta.title}
          </h1>
        </div>
        <p className="max-w-2xl font-body text-on-surface-variant">{meta.subtitle}</p>
      </div>

      <nav className="mb-12 flex flex-wrap gap-2" aria-label="Разделы базы знаний">
        {getGuideSectionNavLinks().map(item => {
          const href = guideSectionNavHref(item.sectionId);
          const isActive = item.sectionId === sectionId;
          return (
            <a
              key={item.sectionId}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                isActive
                  ? "border-primary-container bg-secondary-container text-primary"
                  : "border-outline-variant/30 bg-surface-container-low text-on-surface-variant hover:border-primary-container hover:text-primary-container"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <GuidesKnowledgeSections
        guidesBySection={guidesBySection}
        sectionIds={[sectionId]}
      />
    </div>
  );
}
