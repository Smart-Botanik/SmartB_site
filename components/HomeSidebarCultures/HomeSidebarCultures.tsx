import Link from "next/link";

import { CultureThumbnail } from "@/components/CultureThumbnail";
import { MaterialIcon } from "@/components/MaterialIcon";
import type { ContentLabel } from "@/lib/content-api";
import {
  cultureHubHref,
  type CultureOption,
} from "@/lib/culture-options";
import {
  DEFAULT_CULTURES,
  type DefaultCulture,
} from "@/lib/default-cultures";
import { MAX_SIDEBAR_POPULAR_TAXONOMY_LABELS } from "@/lib/popular-taxonomy-labels";

type HomeSidebarCulturesProps = {
  cultures?: CultureOption[];
};

function PopularTaxonomyTags({
  hubSlug,
  tags,
}: {
  hubSlug: string;
  tags: ContentLabel[];
}) {
  const visible = tags.slice(0, MAX_SIDEBAR_POPULAR_TAXONOMY_LABELS);
  if (visible.length === 0) {
    return null;
  }

  const baseHref = cultureHubHref(hubSlug);

  return (
    <ul className="mt-1 flex flex-wrap gap-x-[0.3rem] gap-y-[0.05rem]" aria-label="Метки культуры">
      {visible.map(tag => (
        <li key={tag.key}>
          <Link
            href={`${baseHref}?label=${encodeURIComponent(tag.key)}`}
            className="inline-flex rounded-md border border-outline-variant/25 bg-surface-container-high px-1.5 py-1 text-[11px] leading-none text-on-surface-variant transition-colors hover:border-primary-container/40 hover:text-primary-container"
          >
            {tag.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function DefaultCultureList({ cultures }: { cultures: DefaultCulture[] }) {
  return (
    <>
      {cultures.map(culture => (
        <li key={culture.tagKey}>
          <div className="group flex items-start gap-3 rounded-xl border border-transparent p-2 transition-all hover:border-primary-container/20 hover:bg-surface-container-high">
            <Link
              href={cultureHubHref(culture.hubSlug)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-2xl leading-none"
              aria-label={culture.label}
            >
              <span aria-hidden>{culture.emoji}</span>
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={cultureHubHref(culture.hubSlug)}
                className="font-medium text-on-surface hover:text-primary-container"
              >
                {culture.label}
              </Link>
              <PopularTaxonomyTags
                hubSlug={culture.hubSlug}
                tags={culture.popularTags}
              />
            </div>
            <MaterialIcon
              name="chevron_right"
              className="mt-1 text-[20px] text-outline transition-transform group-hover:translate-x-0.5 group-hover:text-primary-fixed-dim"
            />
          </div>
        </li>
      ))}
    </>
  );
}

function ApiCultureList({ cultures }: { cultures: CultureOption[] }) {
  return (
    <>
      {cultures.map(option => {
        const href = cultureHubHref(option.hubSlug);

        return (
          <li key={option.tagKey}>
            <div className="group flex items-start gap-3 rounded-xl border border-transparent p-2 transition-all hover:border-primary-container/20 hover:bg-surface-container-high">
              <Link href={href} className="shrink-0" aria-label={option.label}>
                <CultureThumbnail option={option} />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={href}
                  className="font-medium text-on-surface hover:text-primary-container"
                >
                  {option.label}
                </Link>
                <PopularTaxonomyTags
                  hubSlug={option.hubSlug}
                  tags={option.popularTags ?? []}
                />
              </div>
              <MaterialIcon
                name="chevron_right"
                className="mt-1 text-[20px] text-outline transition-transform group-hover:translate-x-0.5 group-hover:text-primary-fixed-dim"
              />
            </div>
          </li>
        );
      })}
    </>
  );
}

export function HomeSidebarCultures({ cultures }: HomeSidebarCulturesProps) {
  const useApiCatalog = cultures != null && cultures.length > 0;

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="glass-effect rounded-2xl border border-outline-variant/10 p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="font-headline text-headline-mobile text-on-surface">Культуры</h2>
          <Link
            href="/guides"
            className="font-label text-[10px] uppercase tracking-wide text-primary-container hover:underline"
          >
            Все
          </Link>
        </div>
        <p className="mb-4 text-sm text-on-surface-variant opacity-80">
          Гайды и материалы по основным культурам.
        </p>
        <ul className="space-y-2">
          {useApiCatalog ? (
            <ApiCultureList cultures={cultures} />
          ) : (
            <DefaultCultureList cultures={DEFAULT_CULTURES} />
          )}
        </ul>
      </div>
    </aside>
  );
}
