import Link from "next/link";

import { HomeCultureChips } from "@/components/HomeCultureChips";
import { HomeGrowReports } from "@/components/HomeGrowReports";
import { HomeHero } from "@/components/HomeHero";
import { HomeKnowledge } from "@/components/HomeKnowledge";
import { HomeTelegramBlock } from "@/components/HomeTelegramBlock";
import { MaterialIcon } from "@/components/MaterialIcon";
import { fetchPublishedSitePage } from "@/lib/content-api";
import { siteEnv } from "@/lib/env";
import {
  HOME_GROW_REPORTS,
  HOME_KNOWLEDGE_CHAPTERS,
} from "@/lib/site-content";
import {
  parseHomeSections,
  resolveCultureChipsSection,
  resolveTelegramBlockSection,
  type CtaSection,
} from "@/lib/site-sections";

export const revalidate = 3600;

function renderCtaBlock(section: CtaSection) {
  return (
    <section className="mx-auto max-w-container-max px-gutter py-16">
      <div className="glass-effect rounded-2xl p-8 text-center md:p-12">
        {section.title ? (
          <h2 className="mb-3 font-headline text-headline text-white">{section.title}</h2>
        ) : null}
        {section.text ? (
          <p className="mx-auto mb-6 max-w-2xl text-on-surface-variant">{section.text}</p>
        ) : null}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={siteEnv.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-container px-8 py-3 font-bold text-on-primary-container"
          >
            <MaterialIcon name="send" />
            {section.ctaLabel ?? "Telegram-канал"}
          </a>
          {section.ctaHref ? (
            <Link
              href={section.ctaHref}
              className="inline-flex items-center gap-2 rounded-xl border border-outline-variant px-8 py-3 font-bold text-primary-fixed-dim"
            >
              {section.ctaLabel ?? "Подробнее"}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  let sections = parseHomeSections(null);

  try {
    const page = await fetchPublishedSitePage("home");
    sections = parseHomeSections(page?.sections);
  } catch {
    /* fallback to defaults */
  }

  const cultureChips = resolveCultureChipsSection(sections.cultureChips);
  const telegramBlock = resolveTelegramBlockSection(
    sections.telegramBlock,
    siteEnv.telegramUrl,
  );

  return (
    <div className="home-sections">
      <HomeHero
        title={sections.hero.title}
        subtitle={sections.hero.subtitle}
        ctaLabel={sections.hero.ctaLabel ?? "Смотреть гайды"}
        ctaHref={sections.hero.ctaHref ?? "/guides"}
      />
      <HomeTelegramBlock {...telegramBlock} />
      <HomeCultureChips
        title={cultureChips.title}
        subtitle={cultureChips.subtitle}
        cropKinds={cultureChips.cropKinds}
      />
      <HomeGrowReports reports={HOME_GROW_REPORTS} />
      <HomeKnowledge chapters={HOME_KNOWLEDGE_CHAPTERS} />
      {sections.ctaBlock ? renderCtaBlock(sections.ctaBlock) : null}
    </div>
  );
}
