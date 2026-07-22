import Link from "next/link";

import { MaterialIcon } from "@/components/MaterialIcon";
import type { CommunityStat, JournalFeedEntry } from "@/lib/journal-content";

const ZONE_STYLES: Record<
  JournalFeedEntry["zoneAccent"],
  { border: string; badge: string; badgeBg: string }
> = {
  mint: {
    border: "border-l-primary-fixed-dim",
    badge: "text-primary-fixed-dim",
    badgeBg: "bg-primary-fixed-dim/10",
  },
  emerald: {
    border: "border-l-secondary",
    badge: "text-secondary",
    badgeBg: "bg-secondary/10",
  },
  neutral: {
    border: "border-l-outline-variant",
    badge: "text-on-surface-variant",
    badgeBg: "bg-surface-container-high",
  },
};

type JournalFeedSidebarProps = {
  feed: JournalFeedEntry[];
  communityStats: CommunityStat[];
};

export function JournalFeedSidebar({ feed, communityStats }: JournalFeedSidebarProps) {
  return (
    <aside className="space-y-12 lg:col-span-4">
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-headline text-on-surface">Лента циклов</h2>
        <span className="flex items-center gap-1 text-primary-fixed-dim">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-fixed-dim opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-fixed-dim" />
          </span>
          <span className="font-label text-label uppercase">Live</span>
        </span>
      </div>

      <div className="space-y-6">
        {feed.map(entry => {
          const style = ZONE_STYLES[entry.zoneAccent];
          return (
            <article
              key={entry.id}
              className={`glass-panel relative overflow-hidden rounded-xl border-l-4 p-6 ${style.border}`}
            >
              <div className="mb-3 flex items-start justify-between">
                <span
                  className={`rounded px-2 py-0.5 font-label text-label ${style.badge} ${style.badgeBg}`}
                >
                  {entry.zone}
                </span>
                <span className="font-label text-[10px] text-on-surface-variant">{entry.timeAgo}</span>
              </div>
              <h5 className="mb-1 font-bold text-on-surface">{entry.title}</h5>
              <p className="line-clamp-2 text-on-surface-variant">{entry.excerpt}</p>
              {entry.verifiedBy?.length ? (
                <div className="mt-4 flex items-center gap-2 border-t border-outline-variant/30 pt-4">
                  <div className="flex -space-x-2">
                    {entry.verifiedBy.map(initials => (
                      <div
                        key={initials}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-background bg-surface-container-high text-[10px]"
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-on-surface-variant">
                    Подтверждено {entry.verifiedBy.length} экспертами
                  </span>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <Link
        href="/reports"
        className="flex w-full items-center justify-center gap-2 rounded-xl py-6 font-bold text-on-surface glass-panel transition-colors hover:bg-surface-container-high"
      >
        Вся лента
        <MaterialIcon name="expand_more" />
      </Link>

      <div className="rounded-xl border border-outline-variant/30 bg-gradient-to-br from-secondary-container/30 to-background p-6">
        <h6 className="mb-3 font-bold text-primary-fixed-dim">Пульс сообщества</h6>
        <div className="space-y-3">
          {communityStats.map(stat => (
            <div key={stat.text} className="flex items-center gap-2">
              <MaterialIcon name={stat.icon} className="text-secondary" filled />
              <span className="font-label text-label text-on-surface">{stat.text}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
