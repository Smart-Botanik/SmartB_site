import Image from "next/image";
import Link from "next/link";

import { CultureThumbnail } from "@/components/CultureThumbnail";
import { MaterialIcon } from "@/components/MaterialIcon";
import type { ContentLabel } from "@/lib/content-api";
import {
  cultureHubHref,
  loadCultureOptions,
  type CultureOption,
} from "@/lib/culture-options";
import {
  DEFAULT_CULTURES,
  type DefaultCulture,
} from "@/lib/default-cultures";

import { PopularTaxonomyTags } from "./PopularTaxonomyTags";

type HomeSidebarCulturesProps = {
  cultures?: CultureOption[];
  cultureTagKeys?: string[];
};

function DefaultCultureList({ cultures }: { cultures: DefaultCulture[] }) {
  return (
    <>
      {cultures.map(culture => {
        const href = cultureHubHref(culture.hubSlug);

        return (
          <li key={culture.tagKey}>
            <div className="group relative flex items-start gap-3 rounded-xl border border-outline-variant/10 dark:border-outline-variant/15 bg-surface-container-low/30 p-2 mx-1.5 transition-all hover:border-primary-container/20 hover:bg-surface-container-high dark:hover:border-primary-container/20">
              <Link
                href={href}
                className="absolute inset-0 z-10 rounded-xl"
                aria-label={culture.label}
              />
              <div className="pointer-events-none relative z-0 shrink-0" aria-hidden>
                <CultureThumbnail
                  option={{
                    label: culture.label,
                    tagKey: culture.tagKey,
                    hubSlug: culture.hubSlug,
                    preview: culture.image ? { id: culture.tagKey, url: culture.image } : null,
                  }}
                />
              </div>
              <div className="pointer-events-none relative z-0 min-w-0 flex-1">
                <span className="font-medium text-on-surface group-hover:text-primary-container">
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
            <div className="group relative flex items-start gap-3 rounded-xl border border-outline-variant/10 dark:border-outline-variant/15 bg-surface-container-low/30 p-2 mx-1.5 transition-all hover:border-primary-container/20 hover:bg-surface-container-high dark:hover:border-primary-container/20">
              <Link
                href={href}
                className="absolute inset-0 z-10 rounded-xl"
                aria-label={option.label}
              />
              <div className="pointer-events-none relative z-0 shrink-0" aria-hidden>
                <CultureThumbnail option={option} />
              </div>
              <div className="pointer-events-none relative z-0 min-w-0 flex-1">
                <span className="font-medium text-on-surface group-hover:text-primary-container">
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

export async function HomeSidebarCultures({
  cultures: passedCultures,
  cultureTagKeys,
}: HomeSidebarCulturesProps = {}) {
  const cultures =
    passedCultures ?? (await loadCultureOptions(cultureTagKeys));
  const useApiCatalog = cultures != null && cultures.length > 0;

  return (
    <aside className="block-culture-section lg:sticky lg:top-24 lg:self-start">
      <div className="glass-effect overflow-hidden rounded-2xl border border-outline-variant/10 dark:border-outline-variant/15">
        <div className="header-cultures section-header relative overflow-hidden px-4 py-5 sm:px-5 sm:py-5 border-b border-outline-variant/10 dark:border-outline-variant/15">
          {/* Background Image Container */}
          <div className="header-cultures-bg section-header-bg absolute inset-0 z-0 pointer-events-none select-none">
            <Image
              src="/previews/tomato.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              priority
              className="object-cover object-center opacity-65 dark:opacity-45 saturate-[1.15] dark:saturate-100 dark:brightness-95 transition-all duration-300"
            />
            {/* Readability gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/45 to-transparent dark:from-background/95 dark:via-background/65 dark:to-background/25" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent dark:from-background/90 dark:via-background/40 dark:to-transparent" />
          </div>

          {/* Header content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden shadow-md ring-1 ring-white/10 bg-surface-container-high flex items-center justify-center p-1.5">
                  <Image
                    src="/icons/growing.svg"
                    alt="Культуры"
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="font-headline text-lg font-bold text-on-surface sm:text-xl">
                    Культуры
                  </h2>
                  <p className="mt-0.5 text-xs text-on-surface-variant opacity-90 leading-relaxed">
                    Гайды и материалы по основным культурам.
                  </p>
                </div>
              </div>
              <Link
                href="/guides"
                className="font-label text-[10px] uppercase tracking-wide text-primary hover:text-primary-container transition-colors duration-200 flex items-center gap-1 mt-1 shrink-0"
              >
                <span>Все</span>
                <span className="text-xs">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content list container */}
        <div className="p-4 sm:p-5">
          <ul className="space-y-2">
            {useApiCatalog ? (
              <ApiCultureList cultures={cultures} />
            ) : (
              <DefaultCultureList cultures={DEFAULT_CULTURES} />
            )}
          </ul>
        </div>
      </div>
    </aside>
  );
}
