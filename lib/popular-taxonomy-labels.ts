import type { ContentLabel, TaxonomyTagNamespace } from "./content-api";

/**
 * Culture-specific popular taxonomy labels for the culture list / hub filters.
 * At most MAX tags are shown per culture (sidebar may use a smaller cap).
 */
export const MAX_POPULAR_TAXONOMY_LABELS = 5;

/** Sidebar culture list — keep compact. */
export const MAX_SIDEBAR_POPULAR_TAXONOMY_LABELS = 2;

type PopularTaxonomyLabelSeed = {
  key: string;
  label: string;
  namespace: TaxonomyTagNamespace;
  sortOrder: number;
};

/**
 * Canonical popular tags per crop root key (taxonomy keys).
 * Keys not listed here get no popular chips.
 */
export const CULTURE_POPULAR_TAXONOMY_LABEL_SEEDS: Record<
  string,
  PopularTaxonomyLabelSeed[]
> = {
  "crop.tomato": [
    {
      key: "guides.feeding",
      label: "Подкормка",
      namespace: "TOPIC",
      sortOrder: 10,
    },
    {
      key: "guides.harvest",
      label: "Уборка",
      namespace: "TOPIC",
      sortOrder: 20,
    },
    {
      key: "guides.sowing",
      label: "Засев",
      namespace: "TOPIC",
      sortOrder: 30,
    },
    {
      key: "crop.tomato.pink",
      label: "Розовые",
      namespace: "CROP_VARIANT",
      sortOrder: 40,
    },
    {
      key: "crop.tomato.determinate",
      label: "Детерминантные",
      namespace: "CROP_VARIANT",
      sortOrder: 50,
    },
  ],
  "crop.cucumber": [
    {
      key: "crop.cucumber.gherkin",
      label: "Корнишоны",
      namespace: "CROP_VARIANT",
      sortOrder: 10,
    },
    {
      key: "crop.cucumber.chinese",
      label: "Китайские",
      namespace: "CROP_VARIANT",
      sortOrder: 20,
    },
  ],
  "crop.pepper": [
    {
      key: "crop.pepper.bell",
      label: "Болгарский",
      namespace: "CROP_VARIANT",
      sortOrder: 10,
    },
    {
      key: "crop.pepper.hot",
      label: "Острый",
      namespace: "CROP_VARIANT",
      sortOrder: 20,
    },
  ],
  "crop.cabbage": [
    {
      key: "crop.cabbage.whitecabbage",
      label: "Белокочанная",
      namespace: "CROP_VARIANT",
      sortOrder: 10,
    },
    {
      key: "crop.cabbage.whitecabbage.broccoli",
      label: "Брокколи",
      namespace: "CROP_VARIANT",
      sortOrder: 20,
    },
  ],
  "crop.zucchini": [
    {
      key: "crop.zucchini.zucchini",
      label: "Кабачок",
      namespace: "CROP_VARIANT",
      sortOrder: 10,
    },
    {
      key: "crop.zucchini.whitefruited",
      label: "Белоплодный",
      namespace: "CROP_VARIANT",
      sortOrder: 20,
    },
  ],
  "crop.potato": [
    {
      key: "guides.spraying",
      label: "Опрыскивание",
      namespace: "TOPIC",
      sortOrder: 10,
    },
    {
      key: "guides.landing",
      label: "Посадка",
      namespace: "TOPIC",
      sortOrder: 20,
    },
  ],
  "crop.pumpkin": [
    {
      key: "crop.pumpkin.butternut",
      label: "Баттернат",
      namespace: "CROP_VARIANT",
      sortOrder: 10,
    },
    {
      key: "crop.pumpkin.muscat",
      label: "Мускатная",
      namespace: "CROP_VARIANT",
      sortOrder: 20,
    },
  ],
};

function seedsToLabels(
  seeds: PopularTaxonomyLabelSeed[],
  limit: number,
): ContentLabel[] {
  return seeds.slice(0, Math.max(0, limit)).map(seed => ({
    id: seed.key,
    key: seed.key,
    label: seed.label,
    namespace: seed.namespace,
    sortOrder: seed.sortOrder,
  }));
}

/** Popular labels for one culture (capped). Unknown culture → empty. */
export function getPopularTaxonomyLabelsForCulture(
  cultureTagKey: string,
  limit: number = MAX_POPULAR_TAXONOMY_LABELS,
): ContentLabel[] {
  const seeds = CULTURE_POPULAR_TAXONOMY_LABEL_SEEDS[cultureTagKey] ?? [];
  return seedsToLabels(seeds, limit);
}
