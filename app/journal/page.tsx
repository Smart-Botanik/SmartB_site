import type { Metadata } from "next";

import { JournalFeedSidebar } from "@/components/JournalFeedSidebar";
import { JournalNewsSection } from "@/components/JournalNewsSection";
import {
  JOURNAL_COMMUNITY_STATS,
  JOURNAL_FEATURED,
  JOURNAL_FEED,
  JOURNAL_NEWS,
} from "@/lib/journal-content";

export const metadata: Metadata = {
  title: "Журнал — SmartБотаник",
  description:
    "Новости выращивания, обновления платформы и живая лента циклов из сообщества SmartБотаник.",
};

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-container-max px-gutter pb-20 pt-12">
      <div className="mb-12">
        <h1 className="mb-2 font-display text-display text-on-surface md:text-[56px] md:leading-tight">
          Журнал выращивания
        </h1>
        <p className="max-w-2xl font-body text-on-surface-variant">
          Точная аналитика и живые заметки из циклов. Новости платформы, эксперименты сообщества
          и обновления из нашей сети гроверов.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <JournalNewsSection featured={JOURNAL_FEATURED} articles={JOURNAL_NEWS} />
        <JournalFeedSidebar feed={JOURNAL_FEED} communityStats={JOURNAL_COMMUNITY_STATS} />
      </div>
    </div>
  );
}
