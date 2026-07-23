import Image from "next/image";
import Link from "next/link";

import { MaterialIcon } from "@/components/MaterialIcon";
import type { JournalNewsArticle } from "@/lib/journal-content";

type HomeNewsUpdatesProps = {
  featured: JournalNewsArticle;
  articles: JournalNewsArticle[];
};

export function HomeNewsUpdates({ featured, articles }: HomeNewsUpdatesProps) {
  const items = [featured, ...articles].slice(0, 4);

  return (
    <div className="glass-effect rounded-2xl border border-outline-variant/10 p-3.5 dark:border-outline-variant/15 sm:p-5">
      <div className="mb-2.5 flex items-center justify-between gap-2 sm:mb-4">
        <h2 className="font-headline text-lg text-on-surface sm:text-headline-mobile">
          Новости и обновления
        </h2>
        <Link
          href="/journal"
          className="font-label text-[10px] uppercase tracking-wide text-primary-container hover:underline"
        >
          Все
        </Link>
      </div>
      <p className="mb-3 text-xs text-on-surface-variant opacity-80 sm:mb-4 sm:text-sm">
        Анонсы платформы, эксперименты сообщества и свежие материалы из журнала.
      </p>

      <ul className="space-y-3 sm:space-y-4">
        {items.map((article, index) => {
          const isFeatured = index === 0;

          return (
            <li key={article.id}>
              <Link
                href={article.href}
                className="group flex gap-3 rounded-xl border border-outline-variant/15 bg-surface-container-low p-3 transition-all hover:border-primary-container/30 hover:bg-surface-container dark:border-outline-variant/10 dark:hover:border-primary-container/25 sm:gap-4 sm:p-4"
              >
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-container-highest sm:h-24 sm:w-28">
                  <Image
                    src={article.imageUrl}
                    alt={article.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 96px, 112px"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {isFeatured && article.badge ? (
                      <span className="rounded-full bg-primary-container/15 px-2.5 py-0.5 font-label text-[10px] uppercase tracking-wide text-primary-container">
                        {article.badge}
                      </span>
                    ) : (
                      <span className="rounded-full bg-primary-container/15 px-2.5 py-0.5 font-label text-[10px] uppercase tracking-wide text-primary-container">
                        {article.category}
                      </span>
                    )}
                    <span className="font-label text-[10px] text-outline">{article.date}</span>
                  </div>
                  <h3 className="font-headline text-base leading-snug text-on-surface transition-colors group-hover:text-primary-container sm:text-lg sm:leading-7">
                    {article.title}
                  </h3>
                  {article.excerpt ? (
                    <p className="line-clamp-2 text-xs text-on-surface-variant sm:text-sm">
                      {article.excerpt}
                    </p>
                  ) : null}
                </div>
                <MaterialIcon
                  name="arrow_forward"
                  className="hidden shrink-0 self-center text-primary-fixed-dim opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 sm:block"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
