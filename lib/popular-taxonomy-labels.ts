import type { ContentLabel, TaxonomyTagNamespace } from "./content-api";

/**
 * Shared popular taxonomy labels for the culture list.
 * Same set is reused on every culture; UI must not show more than MAX.
 */
export const MAX_POPULAR_TAXONOMY_LABELS = 3;

type PopularTaxonomyLabelSeed = {
  key: string;
  label: string;
  namespace: TaxonomyTagNamespace;
  sortOrder: number;
};

/** Canonical popular tags (taxonomy keys) — environment placements used across crops. */
export const POPULAR_TAXONOMY_LABEL_SEEDS: PopularTaxonomyLabelSeed[] = [
  {
    key: "environment.type.outdoor.bed",
    label: "Грядка",
    namespace: "ENVIRONMENT_VARIANT",
    sortOrder: 10,
  },
  {
    key: "environment.type.indoor.growbox",
    label: "Гроубокс",
    namespace: "ENVIRONMENT_VARIANT",
    sortOrder: 20,
  },
  {
    key: "environment.type.greenhouse",
    label: "Теплица",
    namespace: "ENVIRONMENT_TYPE",
    sortOrder: 30,
  },
];

export function getPopularTaxonomyLabels(
  limit: number = MAX_POPULAR_TAXONOMY_LABELS,
): ContentLabel[] {
  return POPULAR_TAXONOMY_LABEL_SEEDS.slice(0, Math.max(0, limit)).map(seed => ({
    id: seed.key,
    key: seed.key,
    label: seed.label,
    namespace: seed.namespace,
    sortOrder: seed.sortOrder,
  }));
}

/** Popular labels attached to every culture option (capped). */
export const POPULAR_TAXONOMY_LABELS = getPopularTaxonomyLabels();
