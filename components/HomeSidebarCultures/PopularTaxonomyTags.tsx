"use client";

import Link from "next/link";

import type { ContentLabel } from "@/lib/content-api";
import { cultureHubHref } from "@/lib/culture-options";
import { MAX_SIDEBAR_POPULAR_TAXONOMY_LABELS } from "@/lib/popular-taxonomy-labels";

type PopularTaxonomyTagsProps = {
  hubSlug: string;
  tags: ContentLabel[];
};

export function PopularTaxonomyTags({ hubSlug, tags }: PopularTaxonomyTagsProps) {
  const visible = tags.slice(0, MAX_SIDEBAR_POPULAR_TAXONOMY_LABELS);
  if (visible.length === 0) {
    return null;
  }

  const baseHref = cultureHubHref(hubSlug);

  return (
    <ul
      className="relative z-10 mt-1 flex flex-wrap gap-x-[0.3rem] gap-y-[0.05rem]"
      aria-label="Метки культуры"
    >
      {visible.map(tag => (
        <li key={tag.key}>
          <Link
            href={`${baseHref}?label=${encodeURIComponent(tag.key)}`}
            className="inline-flex rounded-md border border-outline-variant/20 bg-surface-container-high px-1.5 py-1 text-[11px] leading-none text-on-surface-variant transition-colors hover:border-primary-container/35 hover:text-primary-container dark:border-outline-variant/15 dark:hover:border-primary-container/25"
            onClick={event => event.stopPropagation()}
          >
            {tag.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
