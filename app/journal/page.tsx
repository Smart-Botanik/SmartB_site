import type { Metadata } from "next";

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
      <div className="mb-12">
        <h1 className="mb-2 font-display text-display text-on-surface md:text-[56px] md:leading-tight">
          {intro.title}
        </h1>
        <p className="max-w-2xl font-body text-on-surface-variant">{intro.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <JournalNewsSection featured={news.featured} articles={news.articles} />
        <JournalFeedSidebar feed={JOURNAL_FEED} communityStats={JOURNAL_COMMUNITY_STATS} />
      </div>
    </div>
  );
}
