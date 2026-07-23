import Image from "next/image";
import Link from "next/link";

import { MaterialIcon } from "@/components/MaterialIcon";
import type { JournalNewsArticle } from "@/lib/journal-content";

type JournalNewsSectionProps = {
  featured: JournalNewsArticle;
  articles: JournalNewsArticle[];
};

export function JournalNewsSection({ featured, articles }: JournalNewsSectionProps) {
  return (
    <section className="space-y-12 lg:col-span-8">
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-headline text-primary-fixed-dim">Новости и обновления</h2>
        <div className="hidden gap-1 sm:flex">
          <button
            type="button"
            className="rounded-full border border-outline-variant p-2 hover:bg-surface-container-high"
            aria-label="Предыдущая новость"
          >
            <MaterialIcon name="chevron_left" />
          </button>
          <button
            type="button"
            className="rounded-full border border-outline-variant p-2 hover:bg-surface-container-high"
            aria-label="Следующая новость"
          >
            <MaterialIcon name="chevron_right" />
          </button>
        </div>
      </div>

      <Link
        href={featured.href}
        className="group relative flex aspect-[16/9] flex-col justify-end overflow-hidden rounded-xl glass-panel p-8"
      >
        <Image
          src={featured.imageUrl}
          alt={featured.imageAlt}
          fill
          className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative z-10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {featured.badge ? (
              <span className="rounded-full border border-primary-fixed-dim/30 bg-primary-fixed-dim/20 px-3 py-1 font-label text-label uppercase tracking-widest text-primary-fixed-dim">
                {featured.badge}
              </span>
            ) : null}
            <span className="font-label text-label text-on-surface-variant">{featured.date}</span>
          </div>
          <h3 className="mb-3 font-headline text-headline text-on-surface transition-colors group-hover:text-primary-fixed-dim lg:text-display">
            {featured.title}
          </h3>
          <p className="mb-6 line-clamp-2 max-w-xl text-on-surface-variant">{featured.excerpt}</p>
          <span className="flex items-center gap-2 font-bold text-primary-fixed-dim group-hover:underline">
            Читать
            <MaterialIcon name="arrow_forward" className="text-sm" />
          </span>
        </div>
      </Link>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {articles.map(article => (
          <Link
            key={article.id}
            href={article.href}
            className="glass-panel group rounded-xl p-6 transition-all hover:border-primary-fixed-dim/30"
          >
            <div className="mb-6 aspect-video overflow-hidden rounded-lg border border-outline-variant/30 dark:border-outline-variant/15">
              <Image
                src={article.imageUrl}
                alt={article.imageAlt}
                width={800}
                height={450}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span className="mb-1 block font-label text-label text-secondary">{article.category}</span>
            <h4 className="mb-3 font-headline text-headline-mobile text-on-surface">{article.title}</h4>
            <p className="mb-4 text-on-surface-variant">{article.excerpt}</p>
            <span className="flex items-center gap-1 font-bold text-primary-fixed-dim">
              Подробнее
              <MaterialIcon name="east" className="text-sm" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
