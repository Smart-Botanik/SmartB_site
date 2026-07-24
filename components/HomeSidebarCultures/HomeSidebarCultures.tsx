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

import { PopularTaxonomyTags } from "./PopularTaxonomyTags";

type HomeSidebarCulturesProps = {
  cultures?: CultureOption[];
};

function DefaultCultureList({ cultures }: { cultures: DefaultCulture[] }) {
  return (
    <>
      {cultures.map(culture => {
        const href = cultureHubHref(culture.hubSlug);

        return (
          <li key={culture.tagKey}>
            <div className="group relative flex items-start gap-3 rounded-xl border border-transparent p-2 transition-all hover:border-primary-container/20 hover:bg-surface-container-high dark:hover:border-primary-container/15">
              <Link
                href={href}
                className="absolute inset-0 z-0 rounded-xl"
                aria-label={culture.label}
              />
              <div
                className="pointer-events-none relative z-0 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-2xl leading-none"
                aria-hidden
              >
                <span>{culture.emoji}</span>
              </div>
              <div className="relative min-w-0 flex-1">
                <span className="pointer-events-none font-medium text-on-surface group-hover:text-primary-container">
                  {culture.label}
                </span>
                <PopularTaxonomyTags
                  hubSlug={culture.hubSlug}
                  tags={culture.popularTags}
                />
              </div>
              <MaterialIcon
                name="chevron_right"
                className="pointer-events-none relative z-0 mt-1 text-[20px] text-outline transition-transform group-hover:translate-x-0.5 group-hover:text-primary-fixed-dim"
              />
            </div>
          </li>
        );
      })}
    </>
  );
}

function ApiCultureList({ cultures }: { cultures: CultureOption[] }) {
  return (
    <>
      {cultures.map(option => {
        const href = cultureHubHref(option.hubSlug);
        const tags: ContentLabel[] = option.popularTags ?? [];

        return (
          <li key={option.tagKey}>
            <div className="group relative flex items-start gap-3 rounded-xl border border-transparent p-2 transition-all hover:border-primary-container/20 hover:bg-surface-container-high dark:hover:border-primary-container/15">
              <Link
                href={href}
                className="absolute inset-0 z-0 rounded-xl"
                aria-label={option.label}
              />
              <div className="pointer-events-none relative z-0 shrink-0" aria-hidden>
                <CultureThumbnail option={option} />
              </div>
              <div className="relative min-w-0 flex-1">
                <span className="pointer-events-none font-medium text-on-surface group-hover:text-primary-container">
                  {option.label}
                </span>
                <PopularTaxonomyTags hubSlug={option.hubSlug} tags={tags} />
              </div>
              <MaterialIcon
                name="chevron_right"
                className="pointer-events-none relative z-0 mt-1 text-[20px] text-outline transition-transform group-hover:translate-x-0.5 group-hover:text-primary-fixed-dim"
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
      <div className="glass-effect rounded-2xl border border-outline-variant/10 p-5 dark:border-outline-variant/15">
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
