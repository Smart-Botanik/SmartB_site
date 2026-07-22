"use client";

import Link from "next/link";
import { useState } from "react";

import { CommentsList } from "@/components/CommentsList";
import { EngagementBar } from "@/components/EngagementBar";
import { ItemMediaGallery } from "@/components/ItemMediaGallery";
import { MaterialIcon } from "@/components/MaterialIcon";
import {
  getHardcodedEngagement,
  getHardcodedEngagementByDiscussionId,
  type EngagementBundle,
} from "@/lib/engagement";

import type { UsefulFeedPost } from "./useful-feed";

type UsefulFeedPostCardProps = {
  post: UsefulFeedPost;
};

function engagementForPost(post: UsefulFeedPost): EngagementBundle {
  if (post.engagement) return post.engagement;
  if (post.discussionId) {
    return getHardcodedEngagementByDiscussionId(post.discussionId);
  }
  if (post.type === "guide") {
    return getHardcodedEngagement("GUIDE", post.id.replace(/^guide\./, ""));
  }
  return getHardcodedEngagement(
    "MEDIA_GALLERY_ITEM",
    post.id.replace(/^(video|image)\./, ""),
  );
}

export function UsefulFeedPostCard({ post }: UsefulFeedPostCardProps) {
  const engagement = engagementForPost(post);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const initial = post.authorName.slice(0, 1).toUpperCase();

  return (
    <article className="useful-feed-card">
      <header className="useful-feed-card-header">
        <div className="useful-feed-card-author">
          <div className="useful-feed-card-avatar" aria-hidden>
            {initial}
          </div>
          <div>
            <p className="useful-feed-card-author-name">{post.authorName}</p>
            <p className="useful-feed-card-meta">
              {post.metaLabel}
              {post.isDemo ? " · демо" : ""}
            </p>
          </div>
        </div>
        {post.badge ? (
          <span
            className={`useful-feed-card-badge useful-feed-card-badge--${post.type}`}
          >
            {post.badge}
          </span>
        ) : null}
      </header>

      <div
        className={`useful-feed-card-media useful-feed-card-media--${post.type}`}
      >
        {post.type === "video" ? (
          post.mediaSrc ? (
            <video
              className="useful-feed-card-media-el"
              src={post.mediaSrc}
              poster={post.poster || undefined}
              controls
              playsInline
              preload="metadata"
            />
          ) : (
            <div className="useful-feed-card-video-placeholder" aria-hidden>
              <MaterialIcon name="play_arrow" filled className="text-[48px]" />
              <span>Таймлапс</span>
            </div>
          )
        ) : post.mediaSrc ? (
          <ItemMediaGallery
            src={post.mediaSrc}
            alt={post.alt?.trim() || post.title}
            className="h-full min-h-[220px] w-full border-0"
            imageClassName="useful-feed-card-media-el"
          />
        ) : (
          <div className="useful-feed-card-video-placeholder" aria-hidden>
            <MaterialIcon name="image" className="text-[40px]" />
          </div>
        )}

        {post.type === "video" ? (
          <span className="useful-feed-card-live">Таймлапс</span>
        ) : null}
      </div>

      <div className="useful-feed-card-body">
        <h2 className="useful-feed-card-title">{post.title}</h2>
        {post.body && post.body !== post.title ? (
          <p className="useful-feed-card-text">{post.body}</p>
        ) : null}

        <div className="useful-feed-card-actions">
          <EngagementBar
            stats={engagement.stats}
            size="full"
            onCommentClick={() => setCommentsOpen(open => !open)}
          />
          {post.href ? (
            <Link href={post.href} className="useful-feed-card-guide-link">
              Читать гайд
              <MaterialIcon name="arrow_forward" className="text-[16px]" />
            </Link>
          ) : null}
        </div>

        {commentsOpen ? (
          <CommentsList
            comments={engagement.comments}
            showComposer
            className="useful-feed-card-comments"
          />
        ) : (
          <div className="useful-feed-card-composer" aria-hidden>
            <div className="useful-feed-card-composer-avatar">{initial}</div>
            <div className="useful-feed-card-composer-field">
              Добавить комментарий…
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
