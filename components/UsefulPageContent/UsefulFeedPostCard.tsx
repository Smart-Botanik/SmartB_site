"use client";

import Link from "next/link";

import { EngagementBar } from "@/components/EngagementBar";
import { ItemMediaGallery } from "@/components/ItemMediaGallery";
import { MaterialIcon } from "@/components/MaterialIcon";
import {
  getHardcodedEngagement,
  getHardcodedEngagementByDiscussionId,
  type EngagementBundle,
} from "@/lib/engagement";

import {
  isExternalHref,
  type UsefulFeedPost,
} from "./useful-feed";

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
    post.id.replace(/^(video|image|source)\./, ""),
  );
}

function PostCta({ post }: { post: UsefulFeedPost }) {
  if (!post.href) return null;

  const external = post.type === "source" || isExternalHref(post.href);
  const label = post.type === "source" ? "Открыть источник" : "Читать гайд";
  const className = "useful-feed-card-guide-link";

  if (external) {
    return (
      <a
        href={post.href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
        <MaterialIcon name="open_in_new" className="text-[16px]" />
      </a>
    );
  }

  return (
    <Link href={post.href} className={className}>
      {label}
      <MaterialIcon name="arrow_forward" className="text-[16px]" />
    </Link>
  );
}

/**
 * Useful feed Post card: header · media · body · socials (likes only).
 * Comments / composer — out of scope until SITE-USEFUL-3 / BK-ENGAGE-1.
 */
export function UsefulFeedPostCard({ post }: UsefulFeedPostCardProps) {
  const engagement = engagementForPost(post);
  const initial = post.authorName.slice(0, 1).toUpperCase();
  const metaBits = [
    post.metaLabel,
    post.sourceHost ? post.sourceHost : null,
    post.isDemo ? "демо" : null,
  ].filter(Boolean);

  return (
    <article className="useful-feed-card">
      <header className="useful-feed-card-header">
        <div className="useful-feed-card-author">
          <div
            className={`useful-feed-card-avatar${post.type === "source" ? " useful-feed-card-avatar--source" : ""}`}
            aria-hidden
          >
            {post.type === "source" ? (
              <MaterialIcon name="link" className="text-[20px]" />
            ) : (
              initial
            )}
          </div>
          <div>
            <p className="useful-feed-card-author-name">{post.authorName}</p>
            <p className="useful-feed-card-meta">{metaBits.join(" · ")}</p>
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
              <span>Видео</span>
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
            <MaterialIcon
              name={post.type === "source" ? "link" : "image"}
              className="text-[40px]"
            />
          </div>
        )}

        {post.type === "video" ? (
          <span className="useful-feed-card-live">Видео</span>
        ) : null}
        {post.type === "source" && post.sourceHost ? (
          <span className="useful-feed-card-source-chip">{post.sourceHost}</span>
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
            showComments={false}
          />
          <PostCta post={post} />
        </div>

        {/* Comments / composer — future (SITE-USEFUL-3 / BK-ENGAGE-1)
        <CommentsList … />
        <div className="useful-feed-card-composer">…</div>
        */}
      </div>
    </article>
  );
}
