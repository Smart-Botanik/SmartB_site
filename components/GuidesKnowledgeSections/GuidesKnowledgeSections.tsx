"use client";

import { useEffect, useState, type ReactNode } from "react";

import {
  GuidePreviewCard,
  type GuidePreviewLayout,
} from "@/components/GuidePreviewCard";
import { GuidesLayoutToggle } from "@/components/GuidesLayoutToggle";
import type { CropGuide } from "@/lib/content-api";
import type { GuideLinkVariant } from "@/lib/guide-view-paths";
import {
  GUIDE_SECTION_META,
  type GuideKnowledgeSection,
} from "@/lib/guide-sections";

const LAYOUT_STORAGE_KEY = "site.guides.layout";

function readStoredLayout(): GuidePreviewLayout {
  if (typeof window === "undefined") {
    return "card";
  }
  try {
    const value = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (value === "card" || value === "list") {
      return value;
    }
  } catch {
    /* private mode / blocked storage */
  }
  return "card";
}

type GuidesKnowledgeSectionsProps = {
  guidesBySection: Record<GuideKnowledgeSection, CropGuide[]>;
  linkVariant?: GuideLinkVariant;
  /** Какие разделы показать; по умолчанию все */
  sectionIds?: GuideKnowledgeSection[];
  /** Controlled layout; when omitted, toggle + localStorage. */
  layout?: GuidePreviewLayout;
  showLayoutToggle?: boolean;
};

function SectionHeader({
  id,
  title,
  subtitle,
  accentClass,
  trailing,
}: {
  id: string;
  title: string;
  subtitle: string;
  accentClass: string;
  trailing?: ReactNode;
}) {
  return (
    <div id={id} className="mb-6 flex scroll-mt-28 items-end justify-between gap-4">
      <div className="flex min-w-0 flex-col">
        <h2 className="font-headline text-headline text-primary">{title}</h2>
        <div className={`mt-1 h-1 w-24 ${accentClass}`} />
        <p className="mt-2 max-w-xl text-on-surface-variant">{subtitle}</p>
      </div>
      {trailing ? <div className="shrink-0 pb-1">{trailing}</div> : null}
    </div>
  );
}

function GuideSectionGrid({
  sectionId,
  guides,
  linkVariant = "default",
  layout,
  headerTrailing,
}: {
  sectionId: GuideKnowledgeSection;
  guides: CropGuide[];
  linkVariant?: GuideLinkVariant;
  layout: GuidePreviewLayout;
  headerTrailing?: ReactNode;
}) {
  const meta = GUIDE_SECTION_META[sectionId];
  const listClassName =
    layout === "list"
      ? "guide-preview-list guide-preview-list--layout-list"
      : "guide-preview-list guide-preview-list--layout-card grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section>
      <SectionHeader
        id={sectionId}
        title={meta.title}
        subtitle={meta.subtitle}
        accentClass={meta.accentClass}
        trailing={headerTrailing}
      />

      {guides.length > 0 ? (
        <ul className={listClassName} data-layout={layout}>
          {guides.map(guide => (
            <li key={guide.id}>
              <GuidePreviewCard
                guide={guide}
                linkVariant={linkVariant}
                layout={layout}
                size="middle"
              />
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
  layout: layoutProp,
  showLayoutToggle = true,
}: GuidesKnowledgeSectionsProps) {
  const controlled = layoutProp !== undefined;
  const [layout, setLayout] = useState<GuidePreviewLayout>(layoutProp ?? "card");

  useEffect(() => {
    if (controlled) {
      setLayout(layoutProp);
      return;
    }
    setLayout(readStoredLayout());
  }, [controlled, layoutProp]);

  function handleLayoutChange(next: GuidePreviewLayout) {
    setLayout(next);
    if (controlled) {
      return;
    }
    try {
      window.localStorage.setItem(LAYOUT_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }

  const toggle =
    showLayoutToggle && !controlled ? (
      <GuidesLayoutToggle layout={layout} onChange={handleLayoutChange} />
    ) : null;

  return (
    <div className="space-y-20">
      {sectionIds.map((sectionId, index) => (
        <GuideSectionGrid
          key={sectionId}
          sectionId={sectionId}
          guides={guidesBySection[sectionId]}
          linkVariant={linkVariant}
          layout={layout}
          headerTrailing={index === 0 ? toggle : undefined}
        />
      ))}
    </div>
  );
}
