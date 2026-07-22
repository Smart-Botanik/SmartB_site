import { Suspense } from "react";

import { GuidesCatalogClient } from "@/components/GuidesCatalog/GuidesCatalogClient";
import { GuidesKnowledgeSections } from "@/components/GuidesKnowledgeSections";
import {
  fetchPublishedCropGuides,
  sortPublishedGuides,
  type CropGuide,
} from "@/lib/content-api";
import {
  fallbackCulturePresentations,
  loadCulturePresentations,
  type CulturePresentation,
} from "@/lib/culture-presentation";
import {
  partitionGuidesByKnowledgeSection,
  type GuideKnowledgeSection,
} from "@/lib/guide-sections";
import type { GuideLinkVariant } from "@/lib/guide-view-paths";

type GuidesCatalogProps = {
  allGuides: CropGuide[];
  guidesBySection: Record<GuideKnowledgeSection, CropGuide[]>;
  presentations: CulturePresentation[];
  variant?: GuideLinkVariant;
};

function GuidesCatalogFallback({
  guidesBySection,
  variant = "default",
}: {
  guidesBySection: Record<GuideKnowledgeSection, CropGuide[]>;
  variant?: GuideLinkVariant;
}) {
  const isView = variant === "view";
  return (
    <div
      className={
        isView
          ? "guide-view-page mx-auto max-w-[960px] px-6 pb-20 pt-6"
          : "mx-auto max-w-container-max px-gutter pb-20 pt-16"
      }
    >
      <div className="relative mb-12 px-[12px] py-[24px]">
        <div className="hero-gradient absolute inset-0 -z-10" />
        <div className="mb-2 flex flex-col gap-1">
          <span className="font-label text-label uppercase tracking-widest text-primary-fixed-dim">
            База знаний
          </span>
          <h1 className="font-display text-display text-primary md:text-[64px] md:leading-tight">
            Гайды и материалы
          </h1>
        </div>
      </div>
      <GuidesKnowledgeSections
        guidesBySection={guidesBySection}
        linkVariant={variant}
        sectionIds={["growing"]}
      />
    </div>
  );
}

export function GuidesCatalog({
  allGuides,
  guidesBySection,
  presentations,
  variant = "default",
}: GuidesCatalogProps) {
  return (
    <Suspense
      fallback={
        <GuidesCatalogFallback guidesBySection={guidesBySection} variant={variant} />
      }
    >
      <GuidesCatalogClient
        allGuides={allGuides}
        guidesBySection={guidesBySection}
        presentations={presentations}
        variant={variant}
      />
    </Suspense>
  );
}

export async function loadGuidesCatalogData() {
  let allGuides: CropGuide[] = [];
  let guidesBySection = partitionGuidesByKnowledgeSection([]);
  let presentations: CulturePresentation[] = [];

  try {
    allGuides = sortPublishedGuides(await fetchPublishedCropGuides());
    guidesBySection = partitionGuidesByKnowledgeSection(allGuides);
  } catch {
    /* пустые разделы — placeholder в UI */
  }

  try {
    presentations = await loadCulturePresentations();
  } catch {
    presentations = fallbackCulturePresentations();
  }

  if (presentations.length === 0) {
    presentations = fallbackCulturePresentations();
  }

  return { allGuides, guidesBySection, presentations };
}
