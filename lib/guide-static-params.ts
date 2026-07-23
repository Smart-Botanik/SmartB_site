import { fetchPublishedCropGuides } from "@/lib/content-api";

/** Fallback when CMS is down at build time — keeps `output: 'export'` happy (non-empty params). */
const FALLBACK_GUIDE_SLUGS = ["coming-soon"] as const;

/**
 * Slugs for `/guides/[slug]` (+ `/view`) static export.
 * Never returns [] — Next falsely reports empty as "missing generateStaticParams".
 */
export async function guideStaticParams(): Promise<{ slug: string }[]> {
  try {
    const guides = await fetchPublishedCropGuides();
    const params = guides
      .map(guide => guide.slug?.trim())
      .filter((slug): slug is string => Boolean(slug))
      .map(slug => ({ slug }));
    if (params.length > 0) {
      return params;
    }
  } catch {
    /* CMS unavailable during build */
  }
  return FALLBACK_GUIDE_SLUGS.map(slug => ({ slug }));
}
