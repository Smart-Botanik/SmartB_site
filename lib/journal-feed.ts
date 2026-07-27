import type { CropGuide } from "./content-api";
import {
  CROP_KIND_LABELS,
  fetchPublishedCropGuides,
  getGuidePreviewImage,
  sortPublishedGuides,
} from "./content-api";
import {
  JOURNAL_FEATURED,
  JOURNAL_NEWS,
  type JournalNewsArticle,
} from "./journal-content";

/** Taxonomy TOPIC key for editorial news on `/journal` (BK-CONTENT-JOURNAL-1 seed). */
export const JOURNAL_NEWS_TERM_KEY = "topic.news";

function formatPublishedDate(iso?: string | null): string {
  if (!iso) {
    return "";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function resolveNewsCategory(guide: CropGuide): string {
  const topicTag = (guide.taxonomyTags ?? []).find(
    tag => tag.namespace === "TOPIC" && tag.key !== JOURNAL_NEWS_TERM_KEY,
  );
  if (topicTag?.label) {
    return topicTag.label;
  }
  return CROP_KIND_LABELS[guide.cropKind];
}

function cropGuideToJournalArticle(guide: CropGuide): JournalNewsArticle {
  const preview = getGuidePreviewImage(guide);

  return {
    id: guide.id,
    category: resolveNewsCategory(guide),
    date: formatPublishedDate(guide.publishedAt),
    title: guide.title,
    excerpt: guide.excerpt?.trim() || "Читайте материал на сайте СмартБотаник.",
    imageUrl: preview.url,
    imageAlt: preview.alt,
    href: `/guides/${guide.slug}`,
  };
}

export type JournalNewsFeed = {
  featured: JournalNewsArticle;
  articles: JournalNewsArticle[];
  source: "cms" | "placeholder";
};

export async function resolveJournalNewsFeed(): Promise<JournalNewsFeed> {
  try {
    const guides = sortPublishedGuides(
      await fetchPublishedCropGuides(undefined, JOURNAL_NEWS_TERM_KEY),
    );

    if (guides.length === 0) {
      return {
        featured: JOURNAL_FEATURED,
        articles: JOURNAL_NEWS,
        source: "placeholder",
      };
    }

    const mapped = guides.map(cropGuideToJournalArticle);

    return {
      featured: mapped[0],
      articles: mapped.slice(1, 3),
      source: "cms",
    };
  } catch {
    return {
      featured: JOURNAL_FEATURED,
      articles: JOURNAL_NEWS,
      source: "placeholder",
    };
  }
}
