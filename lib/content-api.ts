import { graphqlRequest } from "./graphql";

export type CropKind = "TOMATO" | "ZUCCHINI" | "EGGPLANT" | "CUCUMBER";

export type ContentMedia = {
  id: string;
  url: string;
  width?: number | null;
  height?: number | null;
};

export type GuideScope = "overview" | "variant" | "howto";

export type TaxonomyChip = {
  key: string;
  label: string;
};

export type TaxonomyTagNamespace =
  | "CROP"
  | "CROP_VARIANT"
  | "TOPIC"
  | "PRODUCT_USE"
  | "ENVIRONMENT_TYPE"
  | "ENVIRONMENT_VARIANT";

export type TaxonomyTag = {
  id: string;
  key: string;
  namespace: TaxonomyTagNamespace;
  label: string;
  sortOrder: number;
  parentId?: string | null;
  cropKind?: CropKind | null;
  variantAxis?: string | null;
};

export type ContentLabel = {
  id: string;
  key: string;
  label: string;
  namespace?: TaxonomyTagNamespace;
  sortOrder?: number;
};

export type GuideMeta = {
  scope: GuideScope;
  terms: TaxonomyChip[];
};

export type CropGuide = {
  id: string;
  cropKind: CropKind;
  slug: string;
  title: string;
  excerpt?: string | null;
  body: unknown;
  bodySiteMd?: string | null;
  bodySiteMdResolved?: string | null;
  bodyTelegramMd?: string | null;
  cover?: ContentMedia | null;
  taxonomyTags?: TaxonomyTag[];
  sortOrder?: number;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type SitePage = {
  id: string;
  key: string;
  title: string;
  sections: unknown;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

const TAXONOMY_TAG_FIELDS = `
  id
  key
  namespace
  label
  sortOrder
  parentId
  cropKind
  variantAxis
`;

const GUIDE_FIELDS = `
  id
  cropKind
  slug
  title
  excerpt
  body
  bodySiteMd
  bodySiteMdResolved
  bodyTelegramMd
  cover { id url width height }
  taxonomyTags { ${TAXONOMY_TAG_FIELDS} }
  sortOrder
  publishedAt
  seoTitle
  seoDescription
`;

const SITE_PAGE_FIELDS = `
  id
  key
  title
  sections
  seoTitle
  seoDescription
`;

export async function fetchPublishedSitePage(key: string) {
  const data = await graphqlRequest<{ publishedSitePage: SitePage | null }>(
    `query PublishedSitePage($key: String!) {
      publishedSitePage(key: $key) { ${SITE_PAGE_FIELDS} }
    }`,
    { key },
  );
  return data.publishedSitePage;
}

export async function fetchPublishedCropGuides(
  cropKind?: CropKind,
  termKey?: string,
) {
  const data = await graphqlRequest<{ publishedCropGuides: CropGuide[] }>(
    `query PublishedCropGuides($cropKind: CropKind, $termKey: String) {
      publishedCropGuides(cropKind: $cropKind, termKey: $termKey) { ${GUIDE_FIELDS} }
    }`,
    {
      ...(cropKind ? { cropKind } : {}),
      ...(termKey ? { termKey } : {}),
    },
  );
  return data.publishedCropGuides;
}

export type MediaKind = "IMAGE" | "VIDEO";

export type GalleryMedia = {
  id: string;
  url: string;
  mime?: string | null;
  width?: number | null;
  height?: number | null;
  kind?: MediaKind | null;
  posterMediaId?: string | null;
};

export type MediaGalleryItem = {
  id: string;
  galleryId: string;
  mediaId: string;
  caption?: string | null;
  alt?: string | null;
  sortOrder: number;
  posterMediaId?: string | null;
  tagIds: string[];
  media?: GalleryMedia | null;
  poster?: GalleryMedia | null;
};

export type MediaGallery = {
  id: string;
  title?: string | null;
  status: string;
  tagIds: string[];
  items: MediaGalleryItem[];
};

const GALLERY_FIELDS = `
  id
  title
  status
  tagIds
  items {
    id
    galleryId
    mediaId
    caption
    alt
    sortOrder
    posterMediaId
    tagIds
    media {
      id
      url
      mime
      width
      height
      kind
      posterMediaId
    }
    poster {
      id
      url
      mime
      width
      height
      kind
    }
  }
`;

/** ADR-0019 — published gallery by id (BFF → content → media when cutover). */
export async function fetchPublishedGallery(id: string) {
  if (!id.trim()) return null;
  try {
    const data = await graphqlRequest<{ publishedGallery: MediaGallery | null }>(
      `query PublishedGallery($id: ID!) {
        publishedGallery(id: $id) { ${GALLERY_FIELDS} }
      }`,
      { id },
    );
    return data.publishedGallery;
  } catch {
    return null;
  }
}

export type UsefulGalleries = {
  imageGalleryId?: string | null;
  videoGalleryId?: string | null;
  image?: MediaGallery | null;
  video?: MediaGallery | null;
};

/** «Полезное» galleries from content-service env ids (preferred). */
export async function fetchPublishedUsefulGalleries() {
  try {
    const data = await graphqlRequest<{
      publishedUsefulGalleries: UsefulGalleries;
    }>(
      `query PublishedUsefulGalleries {
        publishedUsefulGalleries {
          imageGalleryId
          videoGalleryId
          image { ${GALLERY_FIELDS} }
          video { ${GALLERY_FIELDS} }
        }
      }`,
    );
    return data.publishedUsefulGalleries;
  } catch {
    return {
      imageGalleryId: null,
      videoGalleryId: null,
      image: null,
      video: null,
    } satisfies UsefulGalleries;
  }
}

export function sortPublishedGuides(guides: CropGuide[]): CropGuide[] {
  return [...guides].sort((a, b) => {
    const orderDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    if (orderDiff !== 0) {
      return orderDiff;
    }
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bTime - aTime;
  });
}

export function taxonomyTagToContentLabel(tag: TaxonomyTag): ContentLabel {
  return {
    id: tag.id,
    key: tag.key,
    label: tag.label,
    namespace: tag.namespace,
    sortOrder: tag.sortOrder,
  };
}

export function collectCultureLabelFilters(guides: CropGuide[]): ContentLabel[] {
  const byKey = new Map<string, ContentLabel>();
  for (const guide of guides) {
    for (const tag of guide.taxonomyTags ?? []) {
      if (tag.namespace !== "CROP_VARIANT") {
        continue;
      }
      if (!byKey.has(tag.key)) {
        byKey.set(tag.key, taxonomyTagToContentLabel(tag));
      }
    }
  }
  return [...byKey.values()].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.label.localeCompare(b.label, "ru"),
  );
}

export async function fetchPublishedCropGuide(slug: string) {
  const data = await graphqlRequest<{ publishedCropGuide: CropGuide | null }>(
    `query PublishedCropGuide($slug: String!) {
      publishedCropGuide(slug: $slug) { ${GUIDE_FIELDS} }
    }`,
    { slug },
  );
  return data.publishedCropGuide;
}

export const DEFAULT_CROP_ORDER: CropKind[] = [
  "TOMATO",
  "ZUCCHINI",
  "EGGPLANT",
  "CUCUMBER",
];

export const CROP_KIND_LABELS: Record<CropKind, string> = {
  TOMATO: "Томаты",
  ZUCCHINI: "Кабачки",
  EGGPLANT: "Баклажаны",
  CUCUMBER: "Огурцы",
};

/** URL slug для hub-страницы культуры */
export const CROP_KIND_SLUGS: Record<CropKind, string> = {
  TOMATO: "tomat",
  ZUCCHINI: "kabachok",
  EGGPLANT: "baklazhan",
  CUCUMBER: "ogurec",
};

const CROP_SLUG_TO_KIND: Record<string, CropKind> = {
  tomat: "TOMATO",
  kabachok: "ZUCCHINI",
  baklazhan: "EGGPLANT",
  ogurec: "CUCUMBER",
};

export function cropKindFromSlug(slug: string): CropKind | null {
  return CROP_SLUG_TO_KIND[slug] ?? null;
}

const CROP_PREVIEW_IMAGES: Record<CropKind, { url: string; alt: string }> = {
  TOMATO: {
    url: "https://images.unsplash.com/photo-1592924357224-548917444334?auto=format&fit=crop&w=800&q=80",
    alt: "Спелые помидоры",
  },
  ZUCCHINI: {
    url: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=800&q=80",
    alt: "Кабачки на грядке",
  },
  EGGPLANT: {
    url: "https://images.unsplash.com/photo-1659261205536-6c2f4c8b6b0a?auto=format&fit=crop&w=800&q=80",
    alt: "Баклажаны",
  },
  CUCUMBER: {
    url: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80",
    alt: "Огурцы",
  },
};

export function getGuidePreviewImage(guide: CropGuide): { url: string; alt: string } {
  if (guide.cover?.url) {
    return { url: guide.cover.url, alt: guide.title };
  }

  if (Array.isArray(guide.body)) {
    for (const block of guide.body) {
      if (typeof block !== "object" || block === null) continue;
      const typed = block as Record<string, unknown>;

      if (typed.type === "image" && typeof typed.url === "string") {
        return {
          url: typed.url,
          alt: typeof typed.alt === "string" ? typed.alt : guide.title,
        };
      }

      if (typed.type === "factCards" && typeof typed.heroImage === "object" && typed.heroImage) {
        const hero = typed.heroImage as { url?: string; alt?: string };
        if (hero.url) {
          return { url: hero.url, alt: hero.alt ?? guide.title };
        }
      }
    }
  }

  return CROP_PREVIEW_IMAGES[guide.cropKind];
}

export function getCropPreviewImage(cropKind: CropKind): { url: string; alt: string } {
  return CROP_PREVIEW_IMAGES[cropKind];
}

function inferGuideScopeFromTags(tags: TaxonomyTag[]): GuideScope {
  if (tags.some(tag => tag.namespace === "CROP_VARIANT")) {
    return "variant";
  }
  if (tags.some(tag => tag.namespace === "TOPIC") && tags.length === 1) {
    return "howto";
  }
  return "overview";
}

function inferGuideScopeFromLabels(labels: ContentLabel[]): GuideScope {
  if (labels.some(label => label.namespace === "CROP_VARIANT")) {
    return "variant";
  }
  if (labels.some(label => label.namespace === "TOPIC") && labels.length === 1) {
    return "howto";
  }
  return "overview";
}

export function parseGuideMeta(source: {
  body?: unknown;
  bodySiteMd?: string | null;
  taxonomyTags?: TaxonomyTag[];
  /** @deprecated use taxonomyTags */
  labels?: ContentLabel[];
}): GuideMeta {
  const fallback: GuideMeta = { scope: "overview", terms: [] };

  const tags =
    source.taxonomyTags ??
    source.labels?.map(label => ({
      id: label.id,
      key: label.key,
      namespace: (label.namespace ?? "TOPIC") as TaxonomyTagNamespace,
      label: label.label,
      sortOrder: label.sortOrder ?? 0,
    })) ??
    [];

  if (tags.length > 0) {
    const terms = tags.map(tag => ({
      key: tag.key,
      label: tag.label,
    }));
    return {
      scope: inferGuideScopeFromTags(tags),
      terms,
    };
  }

  if (source.bodySiteMd?.trim()) {
    const fm = parseFrontmatterInline(source.bodySiteMd);
    if (fm.scope || (fm.terms && fm.terms.length > 0)) {
      return {
        scope: fm.scope ?? "overview",
        terms: fm.terms ?? [],
      };
    }
  }

  if (!Array.isArray(source.body)) return fallback;

  const taxonomyBlock = source.body.find(
    block =>
      typeof block === "object" &&
      block !== null &&
      (block as { type?: string }).type === "taxonomy",
  ) as
    | {
        scope?: GuideScope;
        terms?: Array<{ key?: string; label?: string }>;
      }
    | undefined;

  if (!taxonomyBlock) return fallback;

  const scope =
    taxonomyBlock.scope === "variant" || taxonomyBlock.scope === "howto"
      ? taxonomyBlock.scope
      : "overview";

  const terms = (taxonomyBlock.terms ?? [])
    .filter(term => term.key && term.label)
    .map(term => ({ key: String(term.key), label: String(term.label) }));

  return { scope, terms };
}

function parseFrontmatterInline(markdown: string): GuideMeta {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { scope: "overview", terms: [] };

  const meta: GuideMeta = { scope: "overview", terms: [] };
  for (const line of match[1].split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("scope:")) {
      const scope = trimmed.slice(6).trim();
      if (scope === "overview" || scope === "variant" || scope === "howto") {
        meta.scope = scope;
      }
    }
    const termMatch = trimmed.match(/^-\s+key:\s*(.+?)\s+label:\s*(.+)$/);
    if (termMatch) {
      meta.terms.push({ key: termMatch[1].trim(), label: termMatch[2].trim() });
    }
  }
  return meta;
}

export function getGuideMarkdownContent(guide: CropGuide): string {
  if (guide.bodySiteMdResolved?.trim()) {
    return stripFrontmatterInline(guide.bodySiteMdResolved);
  }
  if (guide.bodySiteMd?.trim()) {
    return stripFrontmatterInline(guide.bodySiteMd);
  }
  return "";
}

function stripFrontmatterInline(markdown: string): string {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();
}
