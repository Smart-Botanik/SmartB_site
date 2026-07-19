import { GuidesKnowledgeSections } from "@/components/GuidesKnowledgeSections";
import { HomeDiaryCta } from "@/components/HomeDiaryCta";
import { HomeHero } from "@/components/HomeHero";
import { HomeKnowledge } from "@/components/HomeKnowledge";
import { HomeLatest } from "@/components/HomeLatest";
import { HomeSidebarCultures } from "@/components/HomeSidebarCultures";
import {
  fetchPublishedCropGuides,
  fetchPublishedSitePage,
  sortPublishedGuides,
} from "@/lib/content-api";
import {
  fetchPublishedCultureOptions,
  resolveDefaultCultureOptions,
} from "@/lib/culture-options";
import { partitionGuidesByKnowledgeSection } from "@/lib/guide-sections";
import { HOME_KNOWLEDGE_CHAPTERS } from "@/lib/site-content";
import { parseHomeSections, resolveCultureChipsSection } from "@/lib/site-sections";

export const revalidate = 3600;

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
  let guidesBySection = partitionGuidesByKnowledgeSection([]);

  try {
    const guides = sortPublishedGuides(await fetchPublishedCropGuides());
    latestGuides = guides;
    guidesBySection = partitionGuidesByKnowledgeSection(guides);
  } catch {
    /* empty latest / useful blocks */
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

  return (
    <div className="home-sections">
      <HomeHero
        title={sections.hero.title}
        subtitle={sections.hero.subtitle}
        ctaLabel={sections.hero.ctaLabel ?? "Смотреть гайды"}
        ctaHref={sections.hero.ctaHref ?? "/guides"}
      />

      <section
        id="latest"
        className="mx-auto max-w-container-max scroll-mt-28 px-gutter py-16"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <HomeLatest guides={latestGuides} limit={6} />

          <HomeSidebarCultures cultures={cultureOptions} />
        </div>
      </section>

      <section className="mx-auto max-w-container-max scroll-mt-28 px-gutter pb-16">
        <GuidesKnowledgeSections
          guidesBySection={guidesBySection}
          sectionIds={["interesting"]}
        />
      </section>

      <HomeKnowledge chapters={HOME_KNOWLEDGE_CHAPTERS} />

      <HomeDiaryCta />
    </div>
  );
}
