import type { ContentLabel } from "./content-api";
import { getPopularTaxonomyLabelsForCulture } from "./popular-taxonomy-labels";

/**
 * Дефолтный набор культур для sidebar / selector на site.
 * Не завязан на legacy CropKind enum — только taxonomy tag keys / labels.
 * Popular taxonomy labels are culture-specific (max 5; sidebar shows max 2).
 */

type DefaultCultureSeed = {
  tagKey: string;
  label: string;
  hubSlug: string;
  emoji: string;
};

export type DefaultCulture = DefaultCultureSeed & {
  /** Culture-specific popular taxonomy labels (sidebar-capped). */
  popularTags: ContentLabel[];
};

const DEFAULT_CULTURE_SEEDS: DefaultCultureSeed[] = [
  { tagKey: "crop.tomato", label: "Томаты", hubSlug: "tomat", emoji: "🍅" },
  { tagKey: "crop.pepper", label: "Перец", hubSlug: "perec", emoji: "🌶️" },
  { tagKey: "crop.cucumber", label: "Огурцы", hubSlug: "ogurec", emoji: "🥒" },
  { tagKey: "crop.potato", label: "Картошка", hubSlug: "kartoshka", emoji: "🥔" },
  { tagKey: "crop.cabbage", label: "Капуста", hubSlug: "kapusta", emoji: "🥬" },
  { tagKey: "crop.pumpkin", label: "Тыква", hubSlug: "tykva", emoji: "🎃" },
];

export const DEFAULT_CULTURES: DefaultCulture[] = DEFAULT_CULTURE_SEEDS.map(
  culture => ({
    ...culture,
    popularTags: getPopularTaxonomyLabelsForCulture(culture.tagKey),
  }),
);

export const DEFAULT_CULTURE_TAG_KEYS = DEFAULT_CULTURES.map(c => c.tagKey);

export function cultureFromHubSlug(slug: string): DefaultCulture | null {
  return DEFAULT_CULTURES.find(c => c.hubSlug === slug) ?? null;
}
