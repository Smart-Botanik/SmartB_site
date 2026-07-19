import Link from "next/link";

import type { ContentLabel } from "@/lib/content-api";
import { guideCultureHubHref, type GuideLinkVariant } from "@/lib/guide-view-paths";

type GuideCultureFiltersProps = {
  cultureSlug: string;
  filters: ContentLabel[];
  activeKey?: string;
  linkVariant?: GuideLinkVariant;
};

export function GuideCultureFilters({
  cultureSlug,
  filters,
  activeKey,
  linkVariant = "default",
}: GuideCultureFiltersProps) {
  if (filters.length === 0) {
    return null;
  }

  const baseHref = guideCultureHubHref(cultureSlug, linkVariant);

  return (
    <nav className="guide-culture-filters" aria-label="Фильтр по меткам">
      <Link
        href={baseHref}
        className={`guide-culture-filter${activeKey ? "" : " guide-culture-filter-active"}`}
      >
        Все
      </Link>
      {filters.map(filter => {
        const href = `${baseHref}?label=${encodeURIComponent(filter.key)}`;
        const isActive = activeKey === filter.key;
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
    </nav>
  );
}
