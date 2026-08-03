import { HomeDiaryCta } from "@/components/HomeDiaryCta";
import { HomeHero } from "@/components/HomeHero";
import { HomeKnowledge } from "@/components/HomeKnowledge";
import { HomeLatest } from "@/components/HomeLatest";
import { HomeLunarCalendar } from "@/components/HomeLunarCalendar";
import { HomeSidebarCultures } from "@/components/HomeSidebarCultures";
import { HOME_KNOWLEDGE_CHAPTERS } from "@/lib/site-content";
import {
  loadHomeSections,
  resolveCultureChipsSection,
} from "@/lib/site-sections";

export default async function HomePage() {
  const sections = await loadHomeSections();
  const cultureChips = resolveCultureChipsSection(sections.cultureChips);

  return (
    <div className="home-sections">
      <HomeHero
        subtitle={sections.hero.subtitle}
        ctaLabel={sections.hero.ctaLabel ?? "Смотреть гайды"}
        ctaHref={sections.hero.ctaHref ?? "/guides"}
      />

      <section className="mx-auto max-w-container-max scroll-mt-28 px-gutter py-10 sm:py-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10">
          <div className="space-y-6 sm:space-y-10">
            <div id="news-updates" className="scroll-mt-28">
              <HomeLatest limit={6} />
            </div>

            <HomeLunarCalendar />
          </div>

          <HomeSidebarCultures cultureTagKeys={cultureChips.cultureTagKeys} />
        </div>
      </section>

      <section className="mx-auto max-w-container-max scroll-mt-28 px-gutter pb-10 sm:pb-16">
        <HomeKnowledge chapters={HOME_KNOWLEDGE_CHAPTERS} />
      </section>

      <HomeDiaryCta />
    </div>
  );
}
