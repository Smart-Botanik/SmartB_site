"use client";

import Image from "next/image";
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
      <div className="header-knowledge section-header glass-effect relative mb-12 overflow-hidden rounded-2xl border border-outline-variant/10 px-6 py-8 dark:border-outline-variant/15 sm:px-8 sm:py-10">
        {/* Background Image Container */}
        <div className="header-knowledge-bg section-header-bg absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/knowledge-base-header.svg"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover object-[center_60%] opacity-90 dark:opacity-75 saturate-[1.2] dark:saturate-110 dark:brightness-100 transition-all duration-300"
          />
          {/* Readability gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/30 to-transparent dark:from-background/85 dark:via-background/45 dark:to-background/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/65 via-background/20 to-transparent dark:from-background/80 dark:via-background/30 dark:to-transparent" />
        </div>

        {/* Header content */}
        <div className="relative z-10 flex items-start gap-4 sm:gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-container-high p-4 border border-outline-variant/15 shadow-sm sm:h-20 sm:w-20 sm:p-5">
            <Image
              src="/icons/growing.svg"
              alt=""
              width={48}
              height={48}
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-headline text-2xl font-bold text-on-surface sm:text-3xl">
              Гайды и материалы
            </h1>
            <p className="mt-1.5 text-xs text-on-surface-variant opacity-90 leading-relaxed max-w-2xl sm:text-sm">
              Гайды по выращиванию — от рассады до урожая. Выберите культуру или откройте другой
              раздел базы знаний.
            </p>
          </div>
        </div>
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
