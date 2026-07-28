"use client";

import { useMemo, useState } from "react";

import { MaterialIcon } from "@/components/MaterialIcon";

import Image from "next/image";

import { UsefulFeedPostCard } from "./UsefulFeedPostCard";
import {
  USEFUL_FEED_FILTERS,
  countUsefulFeedByType,
  filterUsefulFeedPosts,
  type UsefulFeedFilter,
  type UsefulFeedPost,
} from "./useful-feed";

type UsefulFeedClientProps = {
  posts: UsefulFeedPost[];
};

export function UsefulFeedClient({ posts }: UsefulFeedClientProps) {
  const [filter, setFilter] = useState<UsefulFeedFilter>("all");

  const counts = useMemo(() => countUsefulFeedByType(posts), [posts]);

  const visible = useMemo(
    () => filterUsefulFeedPosts(posts, filter),
    [filter, posts],
  );

  return (
    <div className="useful-feed-layout">
      <aside className="useful-feed-sidebar" aria-label="Фильтры ленты">
        <p className="useful-feed-sidebar-kicker">Лента</p>
        <nav className="useful-feed-sidebar-nav">
          {USEFUL_FEED_FILTERS.map(item => {
            const active = filter === item.id;
            const count = counts[item.id];
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                className={`useful-feed-filter${active ? " is-active" : ""}`}
                onClick={() => setFilter(item.id)}
              >
                <MaterialIcon name={item.icon} className="text-[22px]" />
                <span className="useful-feed-filter-label">{item.label}</span>
                <span className="useful-feed-filter-count" aria-label={`${count}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
        <p className="useful-feed-sidebar-hint">
          Видео, фото, гайды и внешние источники в одной ленте. Фильтр слева —
          по типу материала.
        </p>
      </aside>

      <div className="useful-feed-main">
        {/* Unified section header aligned with feed width */}
        <div className="header-useful section-header glass-effect relative mb-8 overflow-hidden rounded-2xl border border-outline-variant/10 px-5 py-6 dark:border-outline-variant/15 sm:px-6 sm:py-6">
          {/* Background Image Container */}
          <div className="header-useful-bg section-header-bg absolute inset-0 z-0 pointer-events-none select-none">
            <Image
              src="/knowledge-base-header.svg"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover object-[center_60%] opacity-65 dark:opacity-45 saturate-[1.15] dark:saturate-100 dark:brightness-95 transition-all duration-300"
            />
            {/* Readability gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/45 to-transparent dark:from-background/95 dark:via-background/65 dark:to-background/25" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent dark:from-background/90 dark:via-background/40 dark:to-transparent" />
          </div>

          {/* Header content */}
          <div className="relative z-10 flex items-start gap-4 sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-high p-2.5 border border-outline-variant/15 shadow-sm sm:h-14 sm:w-14">
              <Image
                src="/icons/useful.svg"
                alt=""
                width={36}
                height={36}
                className="h-7 w-7 sm:h-9 sm:w-9 object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="font-headline text-xl font-bold text-on-surface sm:text-2xl">
                Интересное
              </h1>
              <p className="mt-1 text-xs text-on-surface-variant opacity-90 leading-relaxed max-w-xl">
                Одна лента: видео, фото, гайды и внешние источники. Слева — фильтр по типу, чтобы быстрее находить полезное.
              </p>
            </div>
          </div>
        </div>

        <div className="useful-feed-mobile-filters" aria-label="Фильтры">
          {USEFUL_FEED_FILTERS.map(item => {
            const active = filter === item.id;
            const count = counts[item.id];
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                className={`useful-feed-chip${active ? " is-active" : ""}`}
                onClick={() => setFilter(item.id)}
              >
                {item.shortLabel}
                <span className="useful-feed-chip-count">{count}</span>
              </button>
            );
          })}
        </div>

        {visible.length > 0 ? (
          <div className="useful-feed-list">
            {visible.map(post => (
              <UsefulFeedPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="useful-feed-empty">
            Пока нет материалов в этом фильтре (0). Загляните во «Все посты» или
            добавьте контент в галереи, гайды и источники «Полезное».
          </p>
        )}
      </div>
    </div>
  );
}
