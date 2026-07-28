import Image from "next/image";

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

const SECTION_ICONS: Record<GuideKnowledgeSection, string> = {
  growing: "/icons/growing.svg",
  preserving: "/icons/preserving.svg",
  reports: "/icons/reports.svg",
  interesting: "/icons/useful.svg",
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

  const iconSrc = SECTION_ICONS[sectionId];

  return (
    <div className="mx-auto max-w-container-max px-gutter pb-20 pt-16">
      <div className="header-knowledge section-header glass-effect relative mb-12 overflow-hidden rounded-2xl border border-outline-variant/10 px-6 py-8 dark:border-outline-variant/15 sm:px-8 sm:py-10">
        {/* Background Image Container */}
        <div className="header-knowledge-bg section-header-bg absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/knowledge-base-header.svg"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover object-[center_60%] opacity-65 dark:opacity-45 saturate-[1.15] dark:saturate-100 dark:brightness-95 transition-all duration-300"
          />
          {/* Readability gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/45 to-transparent dark:from-background/95 dark:via-background/65 dark:to-background/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent dark:from-background/90 dark:via-background/40 dark:to-transparent" />
        </div>

        {/* Header content */}
        <div className="relative z-10 flex items-start gap-4 sm:gap-6">
          {iconSrc ? (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-container-high p-3 border border-outline-variant/15 shadow-sm sm:h-20 sm:w-20">
              <Image
                src={iconSrc}
                alt=""
                width={48}
                height={48}
                className="h-11 w-11 sm:h-14 sm:w-14 object-contain"
              />
            </div>
          ) : null}
          <div className="flex flex-col min-w-0">
            <span className="font-label text-[10px] uppercase tracking-widest text-primary-fixed-dim sm:text-xs">
              База знаний
            </span>
            <h1 className="font-headline text-2xl font-bold text-on-surface sm:text-3xl">
              {meta.title}
            </h1>
            <p className="mt-1.5 text-xs text-on-surface-variant opacity-90 leading-relaxed max-w-2xl sm:text-sm">
              {meta.subtitle}
            </p>
          </div>
        </div>
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
                  : "border-outline-variant/30 bg-surface-container-low text-on-surface-variant hover:border-primary-container hover:text-primary-container dark:border-outline-variant/15"
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
