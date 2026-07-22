"use client";

import { useMemo, useState } from "react";

import { MaterialIcon } from "@/components/MaterialIcon";

import { UsefulFeedPostCard } from "./UsefulFeedPostCard";
import {
  USEFUL_FEED_FILTERS,
  filterUsefulFeedPosts,
  type UsefulFeedFilter,
  type UsefulFeedPost,
} from "./useful-feed";

type UsefulFeedClientProps = {
  posts: UsefulFeedPost[];
};

export function UsefulFeedClient({ posts }: UsefulFeedClientProps) {
  const [filter, setFilter] = useState<UsefulFeedFilter>("all");

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
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                className={`useful-feed-filter${active ? " is-active" : ""}`}
                onClick={() => setFilter(item.id)}
              >
                <MaterialIcon name={item.icon} className="text-[22px]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <p className="useful-feed-sidebar-hint">
          Видео, фото и гайды в одной ленте. Фильтр слева — по типу материала.
        </p>
      </aside>

      <div className="useful-feed-main">
        <div className="useful-feed-mobile-filters" aria-label="Фильтры">
          {USEFUL_FEED_FILTERS.map(item => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                className={`useful-feed-chip${active ? " is-active" : ""}`}
                onClick={() => setFilter(item.id)}
              >
                {item.shortLabel}
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
            Пока нет материалов в этом фильтре. Загляните во «Все посты» или
            добавьте контент в галереи и гайды «Полезное».
          </p>
        )}
      </div>
    </div>
  );
}
