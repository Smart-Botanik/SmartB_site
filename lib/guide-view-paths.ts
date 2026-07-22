import { GUIDE_SECTION_PAGE_HREF, type GuideKnowledgeSection } from "./guide-sections";

/** Маршруты standalone view-режима (QR, визитки). */

export function isGuideStandaloneView(pathname: string): boolean {
  if (/^\/guides\/view\/?$/.test(pathname)) {
    return true;
  }
  if (/^\/guides\/kultury\/[^/]+\/view\/?$/.test(pathname)) {
    return true;
  }
  if (/^\/guides\/[^/]+\/view\/?$/.test(pathname)) {
    return true;
  }
  return false;
}

export type GuideLinkVariant = "default" | "view";

export function guidesCatalogHref(variant: GuideLinkVariant = "default"): string {
  return variant === "view" ? "/guides/view" : "/guides";
}

export function guideCultureHubHref(
  cultureSlug: string,
  variant: GuideLinkVariant = "default",
): string {
  return variant === "view"
    ? `/guides/kultury/${cultureSlug}/view`
    : `/guides/kultury/${cultureSlug}`;
}

export function guideArticleHref(slug: string, variant: GuideLinkVariant = "default"): string {
  return variant === "view" ? `/guides/${slug}/view` : `/guides/${slug}`;
}

export function guideSectionNavHref(
  sectionId: string,
  variant: GuideLinkVariant = "default",
): string {
  if (sectionId === "growing") {
    return guidesCatalogHref(variant);
  }

  return (
    GUIDE_SECTION_PAGE_HREF[sectionId as GuideKnowledgeSection] ??
    GUIDE_SECTION_PAGE_HREF.growing
  );
}
