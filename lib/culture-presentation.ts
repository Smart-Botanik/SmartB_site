import type { ContentLabel, CropGuide, CropKind } from "./content-api";
import { cropKindFromSlug } from "./content-api";
import {
  fetchPublishedCultureOptions,
  type CultureChipIcon,
} from "./culture-options";
import { DEFAULT_CULTURES } from "./default-cultures";
import { getPopularTaxonomyLabelsForCulture } from "./popular-taxonomy-labels";
import {
  loadCultureHubPageData,
  resolveTagSurfaceMediaUrl,
} from "./tag-surface";

export type CulturePresentation = {
  tagKey: string;
  hubSlug: string;
  label: string;
  /** @deprecated Prefer `icon` (LOGO PNG / emoji from publishedCultureOptions). */
  emoji: string;
  icon: CultureChipIcon;
  hubLead: string;
  aboutShort?: string;
  photoUrls: string[];
  popularTags: ContentLabel[];
};

function iconFromEmoji(emoji: string): CultureChipIcon {
  return { kind: "EMOJI", emoji };
}

const CROP_KIND_BY_TAG_KEY: Partial<Record<string, CropKind>> = {
  "crop.tomato": "TOMATO",
  "crop.zucchini": "ZUCCHINI",
  "crop.eggplant": "EGGPLANT",
  "crop.cucumber": "CUCUMBER",
};

const DEFAULT_HUB_LEAD =
  "Обзорные материалы и узкие статьи по подвидам и способам выращивания.";

export function guideMatchesCultureTag(
  guide: CropGuide,
  cultureTagKey: string,
): boolean {
  const tags = guide.taxonomyTags ?? [];
  if (
    tags.some(
      tag =>
        tag.key === cultureTagKey || tag.key.startsWith(`${cultureTagKey}.`),
    )
  ) {
    return true;
  }

  const cropKind = CROP_KIND_BY_TAG_KEY[cultureTagKey];
  return cropKind != null && guide.cropKind === cropKind;
}

export function filterGuidesByCultureAndLabel(
  guides: CropGuide[],
  cultureTagKey?: string,
  labelKey?: string,
): CropGuide[] {
  let next = guides;

  if (cultureTagKey) {
    next = next.filter(guide => guideMatchesCultureTag(guide, cultureTagKey));
  }

  if (labelKey) {
    next = next.filter(guide =>
      guide.taxonomyTags?.some(tag => tag.key === labelKey),
    );
  }

  return next;
}

function presentationFromDefault(
  culture: (typeof DEFAULT_CULTURES)[number],
  icon?: CultureChipIcon,
): CulturePresentation {
  const resolvedIcon = icon ?? iconFromEmoji(culture.emoji);
  return {
    tagKey: culture.tagKey,
    hubSlug: culture.hubSlug,
    label: culture.label,
    emoji: resolvedIcon.emoji?.trim() || culture.emoji,
    icon: resolvedIcon,
    hubLead: DEFAULT_HUB_LEAD,
    photoUrls: [],
    popularTags: getPopularTaxonomyLabelsForCulture(culture.tagKey),
  };
}

export function fallbackCulturePresentations(): CulturePresentation[] {
  return DEFAULT_CULTURES.map(culture => presentationFromDefault(culture));
}

async function loadCultureOptionIcons(): Promise<Map<string, CultureChipIcon>> {
  try {
    const catalog = await fetchPublishedCultureOptions();
    return new Map(
      catalog.options.map(option => [option.tagKey, option.icon] as const),
    );
  } catch {
    return new Map();
  }
}

export async function loadCulturePresentations(): Promise<CulturePresentation[]> {
  const iconsByTagKey = await loadCultureOptionIcons();

  const presentations = await Promise.all(
    DEFAULT_CULTURES.map(async culture => {
      const icon = iconsByTagKey.get(culture.tagKey);
      try {
        const hub = await loadCultureHubPageData({ cultureSlug: culture.hubSlug });
        const photoUrls = (hub?.presentationPhotos ?? [])
          .map(media => resolveTagSurfaceMediaUrl(media))
          .filter((url): url is string => Boolean(url));
        const resolvedIcon = icon ?? iconFromEmoji(culture.emoji);

        return {
          tagKey: culture.tagKey,
          hubSlug: culture.hubSlug,
          label: hub?.cultureLabel ?? culture.label,
          emoji: resolvedIcon.emoji?.trim() || culture.emoji,
          icon: resolvedIcon,
          hubLead: hub?.hubLead ?? DEFAULT_HUB_LEAD,
          aboutShort: hub?.aboutShort,
          photoUrls,
          popularTags: getPopularTaxonomyLabelsForCulture(culture.tagKey),
        } satisfies CulturePresentation;
      } catch {
        return presentationFromDefault(culture, icon);
      }
    }),
  );

  return presentations.length > 0 ? presentations : fallbackCulturePresentations();
}

export function culturePresentationFromSlug(
  presentations: CulturePresentation[],
  hubSlug: string | undefined,
): CulturePresentation | undefined {
  if (!hubSlug) {
    return undefined;
  }
  return presentations.find(item => item.hubSlug === hubSlug);
}

export function cropKindForCultureHubSlug(hubSlug: string): CropKind | null {
  return cropKindFromSlug(hubSlug);
}
