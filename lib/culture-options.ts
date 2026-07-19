import { CROP_KIND_ROOT_KEYS, type CropKind } from "@growing/contracts";

import type { ContentLabel } from "./content-api";
import {
  DEFAULT_CULTURES,
  DEFAULT_CULTURE_TAG_KEYS,
  type DefaultCulture,
} from "./default-cultures";
import { graphqlRequest } from "./graphql";
import { siteEnv } from "./env";
import {
  MAX_POPULAR_TAXONOMY_LABELS,
  POPULAR_TAXONOMY_LABELS,
} from "./popular-taxonomy-labels";

export type ContentMedia = {
  id: string;
  url: string;
  width?: number | null;
  height?: number | null;
};

export type CultureChipIcon = {
  kind: "EMOJI" | "MEDIA";
  emoji?: string | null;
  image?: ContentMedia | null;
};

export type CultureOption = {
  tagKey: string;
  tagId: string;
  label: string;
  hubSlug: string;
  sortOrder: number;
  icon: CultureChipIcon;
  preview?: ContentMedia | null;
  /** Shared popular taxonomy labels (same set for every culture, max 3). */
  popularTags?: ContentLabel[];
};

export type CultureOptionsCatalog = {
  revision: string;
  options: CultureOption[];
};

const CULTURE_OPTIONS_QUERY = `
  query PublishedCultureOptions {
    publishedCultureOptions {
      revision
      options {
        tagKey
        tagId
        label
        hubSlug
        sortOrder
        icon {
          kind
          emoji
          image {
            id
            url
            width
            height
          }
        }
        preview {
          id
          url
          width
          height
        }
      }
    }
  }
`;

export async function fetchPublishedCultureOptions(): Promise<CultureOptionsCatalog> {
  const data = await graphqlRequest<{ publishedCultureOptions: CultureOptionsCatalog }>(
    CULTURE_OPTIONS_QUERY,
  );
  return data.publishedCultureOptions;
}

export function filterCultureOptionsByCropKinds(
  options: CultureOption[],
  cropKinds?: CropKind[],
): CultureOption[] {
  if (!cropKinds?.length) {
    return options;
  }

  const allowedKeys = new Set(cropKinds.map(kind => CROP_KIND_ROOT_KEYS[kind]));
  return filterCultureOptionsByTagKeys(options, [...allowedKeys]);
}

/** Filter + reorder catalog options by preferred tag keys (default cultures). */
export function filterCultureOptionsByTagKeys(
  options: CultureOption[],
  tagKeys?: string[],
): CultureOption[] {
  if (!tagKeys?.length) {
    return options;
  }

  const byKey = new Map(options.map(option => [option.tagKey, option]));
  return tagKeys
    .map(key => byKey.get(key))
    .filter((option): option is CultureOption => option != null);
}

function attachPopularTags(
  option: CultureOption,
  popularTags: ContentLabel[] = POPULAR_TAXONOMY_LABELS,
): CultureOption {
  return {
    ...option,
    popularTags: popularTags.slice(0, MAX_POPULAR_TAXONOMY_LABELS),
  };
}

function cultureOptionFromDefault(culture: DefaultCulture, sortOrder: number): CultureOption {
  return attachPopularTags({
    tagKey: culture.tagKey,
    tagId: culture.tagKey,
    label: culture.label,
    hubSlug: culture.hubSlug,
    sortOrder,
    icon: { kind: "EMOJI", emoji: culture.emoji },
  }, culture.popularTags);
}

/**
 * Always returns the preferred default set (Томаты, Перец, …),
 * enriching with API catalog when a tag is published.
 */
export function resolveDefaultCultureOptions(
  catalogOptions: CultureOption[],
  tagKeys: string[] = DEFAULT_CULTURE_TAG_KEYS,
): CultureOption[] {
  const byKey = new Map(catalogOptions.map(option => [option.tagKey, option]));
  const defaultsByKey = new Map(DEFAULT_CULTURES.map(c => [c.tagKey, c]));

  return tagKeys.map((key, index) => {
    const fromApi = byKey.get(key);
    if (fromApi) {
      return attachPopularTags(fromApi);
    }
    const fallback = defaultsByKey.get(key);
    if (fallback) {
      return cultureOptionFromDefault(fallback, index);
    }
    return cultureOptionFromDefault(
      {
        tagKey: key,
        label: key.replace(/^crop\./, ""),
        hubSlug: key.replace(/^crop\./, ""),
        emoji: "🌱",
        popularTags: POPULAR_TAXONOMY_LABELS,
      },
      index,
    );
  });
}

/** Absolute URL for Media from Nest (relative /uploads/...). */
export function resolveMediaUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  const base = siteEnv.apiBaseUrl.replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

export function cultureHubHref(hubSlug: string): string {
  return `/guides/kultury/${hubSlug}`;
}
