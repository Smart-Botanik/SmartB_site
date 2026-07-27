"use client";

import { useMemo, useState } from "react";

import { MaterialIcon } from "@/components/MaterialIcon";

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
