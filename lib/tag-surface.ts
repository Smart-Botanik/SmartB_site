import { CROP_TAG_HUB_SLUGS } from "@growing/contracts";

import {
  collectCultureLabelFilters,
  cropKindFromSlug,
  sortPublishedGuides,
  type ContentLabel,
  type CropGuide,
  type CropKind,
} from "./content-api";
import { cultureFromHubSlug } from "./default-cultures";
import { graphqlRequest } from "./graphql";
import { resolveMediaUrl, type ContentMedia } from "./culture-options";
import { getPopularTaxonomyLabelsForCulture } from "./popular-taxonomy-labels";

export type ContentFacetWords = {
  hubTitle?: string | null;
  hubLead?: string | null;
  chipCaption?: string | null;
  seoDescription?: string | null;
  aboutShort?: string | null;
  highlight?: string | null;
};

export type TagSurfaceFacets = {
  revision: string;
  chipIcon?: string | null;
  logo?: ContentMedia | null;
  imageM?: ContentMedia | null;
  previews: ContentMedia[];
  words: ContentFacetWords;
};

export type TagSurfaceTag = {
  id: string;
  key: string;
  label: string;
  scopeKey: string;
  sortOrder: number;
  cropKind?: CropKind | null;
};

export type TagSurface = {
  revision: string;
  tag: TagSurfaceTag;
  facets?: TagSurfaceFacets | null;
  guides: CropGuide[];
};

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
  sortOrder
  publishedAt
  seoTitle
  seoDescription
  cover { id url width height }
  taxonomyTags {
    id
    key
    namespace
    label
    sortOrder
    parentId
    cropKind
    variantAxis
  }
`;

const TAG_SURFACE_QUERY = `
  query PublishedTagSurface($tagKey: String!) {
    publishedTagSurface(tagKey: $tagKey) {
      revision
      tag {
        id
        key
        label
        scopeKey
        sortOrder
        cropKind
      }
      facets {
        revision
        chipIcon
        logo { id url width height }
        imageM { id url width height }
        previews { id url width height }
        words {
          hubTitle
          hubLead
          chipCaption
          seoDescription
          aboutShort
          highlight
        }
      }
      guides { ${GUIDE_FIELDS} }
    }
  }
`;

const HUB_SLUG_BY_TAG_KEY = Object.fromEntries(
  Object.entries(CROP_TAG_HUB_SLUGS).map(([tagKey, hubSlug]) => [hubSlug, tagKey]),
) as Record<string, string>;

export function cropTagKeyFromHubSlug(hubSlug: string): string {
  return HUB_SLUG_BY_TAG_KEY[hubSlug] ?? `crop.${hubSlug}`;
}

export async function fetchPublishedTagSurface(
  tagKey: string,
): Promise<TagSurface | null> {
  const data = await graphqlRequest<{ publishedTagSurface: TagSurface | null }>(
    TAG_SURFACE_QUERY,
    { tagKey },
  );
  return data.publishedTagSurface;
}

export function filterGuidesByLabelKey(
  guides: CropGuide[],
  labelKey?: string,
): CropGuide[] {
  if (!labelKey) {
    return guides;
  }
  return guides.filter(guide =>
    guide.taxonomyTags?.some(tag => tag.key === labelKey),
  );
}

export type CultureHubPageData = {
  cultureSlug: string;
  cultureLabel: string;
  cropKind: CropKind | null;
  hubLead: string;
  aboutShort?: string;
  seoDescription?: string;
  heroPreview?: ContentMedia | null;
  /** Hero + facet previews for presentation gallery. */
  presentationPhotos: ContentMedia[];
  revision?: string;
  allGuides: CropGuide[];
  guides: CropGuide[];
  labelFilters: ReturnType<typeof collectCultureLabelFilters>;
};

const DEFAULT_HUB_LEAD =
  "Обзорные материалы и узкие статьи по подвидам и способам выращивания.";

export async function loadCultureHubPageData(params: {
  cultureSlug: string;
  activeLabelKey?: string;
}): Promise<CultureHubPageData | null> {
  const fallbackCulture = cultureFromHubSlug(params.cultureSlug);
  const tagKey = cropTagKeyFromHubSlug(params.cultureSlug);

  let surface: TagSurface | null = null;
  try {
    surface = await fetchPublishedTagSurface(tagKey);
  } catch {
    surface = null;
  }

  if (!surface && !fallbackCulture) {
    return null;
  }

  const facets = surface?.facets;
  const cultureLabel =
    facets?.words.hubTitle?.trim() ||
    surface?.tag.label ||
    fallbackCulture?.label ||
    params.cultureSlug;

  const hubLead = facets?.words.hubLead?.trim() || DEFAULT_HUB_LEAD;
  const aboutShort = facets?.words.aboutShort?.trim() || undefined;
  const seoDescription = facets?.words.seoDescription?.trim() || undefined;
  const heroPreview =
    facets?.imageM ?? facets?.previews[0] ?? null;
  const presentationPhotos = collectPresentationPhotos(facets);

  const allGuides = sortPublishedGuides(surface?.guides ?? []);
  const guides = filterGuidesByLabelKey(allGuides, params.activeLabelKey);
  const cultureTagKey =
    surface?.tag.key ?? fallbackCulture?.tagKey ?? tagKey;

  return {
    cultureSlug: params.cultureSlug,
    cultureLabel,
    cropKind:
      (surface?.tag.cropKind as CropKind | null | undefined) ??
      cropKindFromSlug(params.cultureSlug) ??
      null,
    hubLead,
    aboutShort,
    seoDescription,
    heroPreview,
    presentationPhotos,
    revision: surface?.revision,
    allGuides,
    guides,
    labelFilters: mergeCultureLabelFilters(
      getPopularTaxonomyLabelsForCulture(cultureTagKey),
      collectCultureLabelFilters(allGuides),
    ),
  };
}

function collectPresentationPhotos(
  facets?: TagSurfaceFacets | null,
): ContentMedia[] {
  const byKey = new Map<string, ContentMedia>();
  for (const media of [facets?.imageM, ...(facets?.previews ?? [])]) {
    if (!media?.url) {
      continue;
    }
    const key = media.id || media.url;
    if (!byKey.has(key)) {
      byKey.set(key, media);
    }
  }
  return [...byKey.values()];
}

/** Culture popular tags first, then other labels collected from guides. */
function mergeCultureLabelFilters(
  popular: ContentLabel[],
  collected: ContentLabel[],
): ContentLabel[] {
  const byKey = new Map<string, ContentLabel>();
  for (const label of [...popular, ...collected]) {
    if (!byKey.has(label.key)) {
      byKey.set(label.key, label);
    }
  }
  return [...byKey.values()];
}

export function tagSurfaceSeo(params: {
  cultureLabel: string;
  seoDescription?: string | null;
  facets?: TagSurfaceFacets | null;
}): { title: string; description: string } {
  const label = params.cultureLabel;
  const description =
    params.seoDescription?.trim() ||
    params.facets?.words.seoDescription?.trim() ||
    `Материалы по выращиванию: ${label.toLowerCase()}.`;
  return {
    title: `${label} — руководства`,
    description,
  };
}

export function resolveTagSurfaceMediaUrl(media?: ContentMedia | null): string | null {
  if (!media?.url) {
    return null;
  }
  return resolveMediaUrl(media.url);
}
