import Link from "next/link";

import type { ContentLabel } from "@/lib/content-api";
import { guideCultureHubHref, type GuideLinkVariant } from "@/lib/guide-view-paths";

type GuideCultureFiltersProps = {
  cultureSlug: string;
  /** Shown as a persistent context chip (e.g. «Томаты»). */
  cultureLabel?: string;
  filters: ContentLabel[];
  activeKey?: string;
  linkVariant?: GuideLinkVariant;
  /**
   * When set, filters are buttons (instant, no navigation).
   * Culture chip clears label; «Все» clears culture selection if provided.
   */
  onSelectLabel?: (labelKey: string | undefined) => void;
  onClearCulture?: () => void;
};

export function GuideCultureFilters({
  cultureSlug,
  cultureLabel,
  filters,
  activeKey,
  linkVariant = "default",
  onSelectLabel,
  onClearCulture,
}: GuideCultureFiltersProps) {
  if (!cultureLabel && filters.length === 0) {
    return null;
  }

  const baseHref = guideCultureHubHref(cultureSlug, linkVariant);
  const interactive = onSelectLabel != null;
  const activeFilter = activeKey
    ? filters.find(filter => filter.key === activeKey)
    : undefined;

  return (
    <nav className="guide-culture-filters" aria-label="Фильтр по меткам">
      {cultureLabel ? (
        interactive && onClearCulture ? (
          <button
            type="button"
            className="guide-culture-filter guide-culture-filter-culture guide-culture-filter-active"
            onClick={onClearCulture}
            title="Сбросить культуру"
          >
            {cultureLabel}
          </button>
        ) : (
          <Link
            href={baseHref}
            className="guide-culture-filter guide-culture-filter-culture guide-culture-filter-active"
          >
            {cultureLabel}
          </Link>
        )
      ) : null}

      {interactive ? (
        <button
          type="button"
          className={`guide-culture-filter${activeKey ? "" : " guide-culture-filter-active"}`}
          onClick={() => onSelectLabel(undefined)}
        >
          Все
        </button>
      ) : (
        <Link
          href={baseHref}
          className={`guide-culture-filter${activeKey ? "" : " guide-culture-filter-active"}`}
        >
          Все
        </Link>
      )}

      {filters.map(filter => {
        const isActive = activeKey === filter.key;
        if (interactive) {
          return (
            <button
              key={filter.key}
              type="button"
              className={`guide-culture-filter${isActive ? " guide-culture-filter-active" : ""}`}
              aria-pressed={isActive}
              onClick={() => onSelectLabel(isActive ? undefined : filter.key)}
            >
              {filter.label}
            </button>
          );
        }

        const href = `${baseHref}?label=${encodeURIComponent(filter.key)}`;
        return (
          <Link
            key={filter.key}
            href={href}
            className={`guide-culture-filter${isActive ? " guide-culture-filter-active" : ""}`}
          >
            {filter.label}
          </Link>
        );
      })}

      {cultureLabel && activeFilter ? (
        <span className="guide-culture-filters-summary" aria-live="polite">
          {cultureLabel} + {activeFilter.label}
        </span>
      ) : null}
    </nav>
  );
}
