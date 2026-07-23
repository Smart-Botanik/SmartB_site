"use client";

import { useCallback, useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { CulturePresentationBlock } from "@/components/CulturePresentationBlock";
import { CultureThumbnail } from "@/components/CultureThumbnail";
import { GuideCultureFilters } from "@/components/GuideCultureFilters";
import { GuidesKnowledgeSections } from "@/components/GuidesKnowledgeSections";
import type { CropGuide } from "@/lib/content-api";
import {
  culturePresentationFromSlug,
  filterGuidesByCultureAndLabel,
  type CulturePresentation,
} from "@/lib/culture-presentation";
import {
  GUIDES_CATALOG_SECTION_IDS,
  getGuideSectionNavLinks,
  partitionGuidesByKnowledgeSection,
  type GuideKnowledgeSection,
} from "@/lib/guide-sections";
import {
  guideSectionNavHref,
  type GuideLinkVariant,
} from "@/lib/guide-view-paths";

type GuidesCatalogClientProps = {
  allGuides: CropGuide[];
  guidesBySection: Record<GuideKnowledgeSection, CropGuide[]>;
  presentations: CulturePresentation[];
  variant?: GuideLinkVariant;
};

function buildCatalogHref(
  pathname: string,
  culture?: string,
  label?: string,
): string {
  const params = new URLSearchParams();
  if (culture) {
    params.set("culture", culture);
  }
  if (label) {
    params.set("label", label);
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function GuidesCatalogClient({
  allGuides,
  guidesBySection,
  presentations,
  variant = "default",
}: GuidesCatalogClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const cultureSlug = searchParams.get("culture") ?? undefined;
  const labelKey = searchParams.get("label") ?? undefined;
  const selected = culturePresentationFromSlug(presentations, cultureSlug);
  const isView = variant === "view";

  const replaceQuery = useCallback(
    (nextCulture?: string, nextLabel?: string) => {
      const href = buildCatalogHref(pathname, nextCulture, nextLabel);
      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [pathname, router],
  );

  const selectCulture = useCallback(
    (hubSlug: string) => {
      if (selected?.hubSlug === hubSlug) {
        replaceQuery(undefined, undefined);
        return;
      }
      replaceQuery(hubSlug, undefined);
    },
    [replaceQuery, selected?.hubSlug],
  );

  const selectLabel = useCallback(
    (nextLabel?: string) => {
      if (!selected) {
        return;
      }
      replaceQuery(selected.hubSlug, nextLabel);
    },
    [replaceQuery, selected],
  );

  const clearCulture = useCallback(() => {
    replaceQuery(undefined, undefined);
  }, [replaceQuery]);

  const filteredGuidesBySection = useMemo(() => {
    if (!selected) {
      return guidesBySection;
    }
    const filtered = filterGuidesByCultureAndLabel(
      allGuides,
      selected.tagKey,
      labelKey,
    );
    return partitionGuidesByKnowledgeSection(filtered);
  }, [allGuides, guidesBySection, labelKey, selected]);

  const photoItems =
    selected?.photoUrls.map(url => ({
      url,
      alt: selected.label,
    })) ?? [];

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
        <p className="max-w-2xl font-body text-on-surface-variant">
          Гайды по выращиванию — от рассады до урожая. Выберите культуру или откройте другой
          раздел базы знаний.
        </p>
      </div>

      <nav className="mb-12 flex flex-wrap gap-2" aria-label="Разделы базы знаний">
        {getGuideSectionNavLinks().map(item => {
          const href = guideSectionNavHref(item.sectionId, variant);
          const isActive = item.sectionId === "growing";
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

      <nav className="mb-8 flex flex-wrap gap-2" aria-label="Культуры">
        {presentations.map(culture => {
          const isActive = selected?.hubSlug === culture.hubSlug;
          return (
            <button
              key={culture.tagKey}
              type="button"
              aria-pressed={isActive}
              onClick={() => selectCulture(culture.hubSlug)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary-container bg-secondary-container text-primary"
                  : "border-outline-variant/30 bg-surface-container text-on-surface-variant hover:border-primary-container hover:text-primary-container dark:border-outline-variant/15"
              }`}
            >
              <CultureThumbnail
                option={{ label: culture.label, icon: culture.icon }}
                size={20}
                variant="inline"
              />
              {culture.label}
            </button>
          );
        })}
      </nav>

      {selected ? (
        <div className="mb-12 space-y-6">
          <CulturePresentationBlock
            title={selected.label}
            lead={selected.hubLead}
            about={selected.aboutShort}
            photos={photoItems}
            popularTags={selected.popularTags}
            activeTagKey={labelKey}
            onSelectTag={key => selectLabel(key)}
            onClearTag={() => selectLabel(undefined)}
          />

          <GuideCultureFilters
            cultureSlug={selected.hubSlug}
            cultureLabel={selected.label}
            filters={selected.popularTags}
            activeKey={labelKey}
            linkVariant={variant}
            onSelectLabel={selectLabel}
            onClearCulture={clearCulture}
          />
        </div>
      ) : null}

      <GuidesKnowledgeSections
        guidesBySection={filteredGuidesBySection}
        linkVariant={variant}
        sectionIds={GUIDES_CATALOG_SECTION_IDS}
      />
    </div>
  );
}
