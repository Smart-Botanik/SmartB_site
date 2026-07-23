import { HomeDiaryCta } from "@/components/HomeDiaryCta";
import { HomeHero } from "@/components/HomeHero";
import { HomeKnowledge } from "@/components/HomeKnowledge";
import { HomeLatest } from "@/components/HomeLatest";
import { HomeLunarCalendar } from "@/components/HomeLunarCalendar";
import { HomeNewsUpdates } from "@/components/HomeNewsUpdates";
import { HomeSidebarCultures } from "@/components/HomeSidebarCultures";
import {
  getDefaultCalendarSections,
  parseCalendarSections,
  parseMoonEntries,
} from "@/lib/calendar-sections";
import {
  fetchPublishedCropGuides,
  fetchPublishedSitePage,
  sortPublishedGuides,
} from "@/lib/content-api";
import {
  fetchPublishedCultureOptions,
  resolveDefaultCultureOptions,
} from "@/lib/culture-options";
import { JOURNAL_FEATURED, JOURNAL_NEWS } from "@/lib/journal-content";
import { HOME_KNOWLEDGE_CHAPTERS } from "@/lib/site-content";
import { parseHomeSections, resolveCultureChipsSection } from "@/lib/site-sections";

export default async function HomePage() {
  let sections = parseHomeSections(null);

  try {
    const page = await fetchPublishedSitePage("home");

    sections = parseHomeSections(page?.sections);
  } catch {
    /* fallback to defaults */
  }

  const cultureChips = resolveCultureChipsSection(sections.cultureChips);

  let latestGuides = sortPublishedGuides([]);

  try {
    latestGuides = sortPublishedGuides(await fetchPublishedCropGuides());
  } catch {
    /* empty latest block */
  }

  let cultureOptions = resolveDefaultCultureOptions(
    [],
    cultureChips.cultureTagKeys,
  );

  try {
    const catalog = await fetchPublishedCultureOptions();
    cultureOptions = resolveDefaultCultureOptions(
      catalog.options,
      cultureChips.cultureTagKeys,
    );
  } catch {
    /* keep DEFAULT_CULTURES merge without API enrichment */
  }

  let moonEntries = parseMoonEntries(
    getDefaultCalendarSections().modes.moon.data,
  );

  try {
    const calendarPage = await fetchPublishedSitePage("calendar");
    moonEntries = parseMoonEntries(
      parseCalendarSections(calendarPage?.sections).modes.moon.data,
    );
  } catch {
    /* defaults until CMS seed / publish */
  }

  return (
    <div className="home-sections">
      <HomeHero
        title={sections.hero.title}
        subtitle={sections.hero.subtitle}
        ctaLabel={sections.hero.ctaLabel ?? "Смотреть гайды"}
        ctaHref={sections.hero.ctaHref ?? "/guides"}
      />

      <section className="mx-auto max-w-container-max scroll-mt-28 px-gutter py-10 sm:py-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10">
          <div className="space-y-6 sm:space-y-10">
            <div id="news-updates" className="scroll-mt-28">
              <HomeNewsUpdates featured={JOURNAL_FEATURED} articles={JOURNAL_NEWS} />
            </div>

            <div id="guides" className="scroll-mt-28">
              <HomeLatest guides={latestGuides} limit={6} />
            </div>

            <HomeLunarCalendar entries={moonEntries} />
          </div>

          <HomeSidebarCultures cultures={cultureOptions} />
        </div>
      </section>

      <HomeKnowledge chapters={HOME_KNOWLEDGE_CHAPTERS} />

      <HomeDiaryCta />
    </div>
  );
}
