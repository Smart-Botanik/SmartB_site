"use client";

import { useState } from "react";

import { MaterialIcon } from "@/components/MaterialIcon";
import {
  formatEngagementCount,
  type EngagementStatsDto,
} from "@/lib/engagement";

type EngagementBarProps = {
  stats: EngagementStatsDto;
  /** Compact for cards; full for article / gallery. */
  size?: "compact" | "full";
  className?: string;
  onCommentClick?: () => void;
};

/**
 * Like + comment counters. Like toggles locally until BK-ENGAGE-1 API exists.
 */
export function EngagementBar({
  stats,
  size = "compact",
  className = "",
  onCommentClick,
}: EngagementBarProps) {
  const [liked, setLiked] = useState(Boolean(stats.likedByMe));
  const [likeCount, setLikeCount] = useState(stats.likeCount);

  function toggleLike() {
    setLiked(prev => {
      const next = !prev;
      setLikeCount(count => Math.max(0, count + (next ? 1 : -1)));
      return next;
    });
  }

  const isFull = size === "full";

  return (
    <div
      className={`engagement-bar engagement-bar--${size} ${className}`.trim()}
      data-liked={liked ? "true" : "false"}
    >
      <button
        type="button"
        className="engagement-bar-btn"
        aria-pressed={liked}
        aria-label={liked ? "Убрать лайк" : "Лайк"}
        onClick={event => {
          event.preventDefault();
          event.stopPropagation();
          toggleLike();
        }}
      >
        <MaterialIcon name="favorite" filled={liked} className="text-[18px]" />
        <span>{formatEngagementCount(likeCount)}</span>
      </button>
      <button
        type="button"
        className="engagement-bar-btn"
        aria-label={`Комментарии: ${stats.commentCount}`}
        onClick={event => {
          event.preventDefault();
          event.stopPropagation();
          onCommentClick?.();
        }}
      >
        <MaterialIcon name="chat_bubble" className="text-[18px]" />
        <span>{formatEngagementCount(stats.commentCount)}</span>
        {isFull ? <span className="engagement-bar-hint">коммент.</span> : null}
      </button>
    </div>
  );
}
