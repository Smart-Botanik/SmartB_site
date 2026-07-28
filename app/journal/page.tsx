import type { Metadata } from "next";
import Image from "next/image";

import { JournalFeedSidebar } from "@/components/JournalFeedSidebar";
import { JournalNewsSection } from "@/components/JournalNewsSection";
import { fetchPublishedSitePage } from "@/lib/content-api";
import { JOURNAL_COMMUNITY_STATS, JOURNAL_FEED } from "@/lib/journal-content";
import { resolveJournalNewsFeed } from "@/lib/journal-feed";
import {
  getDefaultJournalSections,
  parseJournalSections,
} from "@/lib/journal-sections";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await fetchPublishedSitePage("journal");
    const intro = parseJournalSections(page?.sections).intro;

    return {
      title: page?.seoTitle ?? `${intro.title} — СмартБотаник`,
      description:
        page?.seoDescription ??
        "Новости выращивания, обновления платформы и живая лента циклов из сообщества СмартБотаник.",
    };
  } catch {
    return {
      title: "Журнал — СмартБотаник",
      description:
        "Новости выращивания, обновления платформы и живая лента циклов из сообщества СмартБотаник.",
    };
  }
}

export default async function JournalPage() {
  let intro = getDefaultJournalSections().intro;

  try {
    const page = await fetchPublishedSitePage("journal");
    intro = parseJournalSections(page?.sections).intro;
  } catch {
    /* defaults until CMS seed / publish */
  }

  const news = await resolveJournalNewsFeed();

  return (
    <div className="mx-auto max-w-container-max px-gutter pb-20 pt-12">
      <div className="header-journal section-header glass-effect relative mb-12 overflow-hidden rounded-2xl border border-outline-variant/10 px-6 py-8 dark:border-outline-variant/15 sm:px-8 sm:py-10">
        {/* Background Image Container */}
        <div className="header-journal-bg section-header-bg absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/knowledge-base-header.svg"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover object-[center_60%] opacity-90 dark:opacity-75 saturate-[1.2] dark:saturate-110 dark:brightness-100 transition-all duration-300"
          />
          {/* Readability gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/30 to-transparent dark:from-background/85 dark:via-background/45 dark:to-background/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/65 via-background/20 to-transparent dark:from-background/80 dark:via-background/30 dark:to-transparent" />
        </div>

        {/* Header content */}
        <div className="relative z-10 flex items-start gap-4 sm:gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-container-high p-4 border border-outline-variant/15 shadow-sm sm:h-20 sm:w-20 sm:p-5">
            <Image
              src="/icons/reports.svg"
              alt=""
              width={48}
              height={48}
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-display text-3xl font-bold text-on-surface md:text-[44px] md:leading-tight">
              {intro.title}
            </h1>
            <p className="mt-2 font-body text-sm text-on-surface-variant opacity-90 leading-relaxed max-w-2xl">
              {intro.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <JournalNewsSection featured={news.featured} articles={news.articles} />
        <JournalFeedSidebar feed={JOURNAL_FEED} communityStats={JOURNAL_COMMUNITY_STATS} />
      </div>
    </div>
  );
}
