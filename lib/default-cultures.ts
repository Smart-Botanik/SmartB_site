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
  image?: string;
};

export type DefaultCulture = DefaultCultureSeed & {
  /** Culture-specific popular taxonomy labels (sidebar-capped). */
  popularTags: ContentLabel[];
};

const DEFAULT_CULTURE_SEEDS: DefaultCultureSeed[] = [
  {
    tagKey: "crop.tomato",
    label: "Томаты",
    hubSlug: "tomat",
    emoji: "🍅",
    image: "/previews/tomato.jpg",
  },
  {
    tagKey: "crop.zucchini",
    label: "Кабачки",
    hubSlug: "kabachok",
    emoji: "🥒",
    image: "/previews/zucchini.jpg",
  },
  {
    tagKey: "crop.eggplant",
    label: "Баклажаны",
    hubSlug: "baklazhan",
    emoji: "🍆",
    image: "/previews/eggplant.jpg",
  },
  {
    tagKey: "crop.cucumber",
    label: "Огурцы",
    hubSlug: "ogurec",
    emoji: "🥒",
    image: "/previews/cucumber.jpg",
  },
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
