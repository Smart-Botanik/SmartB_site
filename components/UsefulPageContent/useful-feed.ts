import type { CropGuide, MediaGalleryItem } from "@/lib/content-api";
import {
  CROP_KIND_LABELS,
  getGuidePreviewImage,
} from "@/lib/content-api";
import type { EngagementBundle } from "@/lib/engagement";
import { guideArticleHref } from "@/lib/guide-view-paths";

/** Post kinds in the unified «Полезное» feed. */
export type UsefulPostType = "video" | "image" | "guide";

/** Sidebar / chip filter ids. */
export type UsefulFeedFilter = "all" | "guide" | "image" | "video";

export type UsefulFeedPost = {
  id: string;
  type: UsefulPostType;
  title: string;
  body?: string | null;
  mediaSrc?: string | null;
  poster?: string | null;
  alt?: string | null;
  href?: string | null;
  authorName: string;
  metaLabel: string;
  badge?: string | null;
  isDemo?: boolean;
  /** Opaque social discussion id when known (guides after publish mint). */
  discussionId?: string | null;
  /** Prefetched engagement (live or mock); filled on server. */
  engagement?: EngagementBundle;
  sortAt: number;
};

export type UsefulFeedItem = {
  id: string;
  kind: "VIDEO" | "IMAGE";
  src: string;
  poster?: string | null;
  caption?: string | null;
  alt?: string | null;
  isDemo?: boolean;
};

export function galleryItemsToFeed(
  items: MediaGalleryItem[],
  kind: "VIDEO" | "IMAGE",
): UsefulFeedItem[] {
  return items
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter(item => {
      const mediaKind = item.media?.kind;
      if (mediaKind) return mediaKind === kind;
      if (kind === "VIDEO") {
        return Boolean(item.media?.mime?.startsWith("video/"));
      }
      return !item.media?.mime?.startsWith("video/");
    })
    .map(item => ({
      id: item.id,
      kind,
      src: item.media?.url ?? "",
      poster: item.poster?.url,
      caption: item.caption,
      alt: item.alt,
    }))
    .filter(item => Boolean(item.src));
}

function captionTitle(caption: string | null | undefined, fallback: string): string {
  const text = caption?.trim();
  if (!text) return fallback;
  const firstLine = text.split(/\n/)[0]?.trim() ?? fallback;
  return firstLine.length > 96 ? `${firstLine.slice(0, 93)}…` : firstLine;
}

function gallerySortAt(sortOrder: number, index: number): number {
  // Newer gallery items tend to have higher sortOrder; bias videos slightly for interleave.
  return Date.now() - sortOrder * 60_000 - index * 1_000;
}

export function mediaItemsToPosts(
  items: UsefulFeedItem[],
  type: "video" | "image",
): UsefulFeedPost[] {
  return items.map((item, index) => {
    const title = captionTitle(
      item.caption,
      type === "video" ? "Таймлапс" : "Фото из сообщества",
    );
    return {
      id: `${type}.${item.id}`,
      type,
      title,
      body: item.caption?.trim() || null,
      mediaSrc: item.src || null,
      poster: item.poster,
      alt: item.alt,
      authorName: type === "video" ? "Видеолента" : "Фотолента",
      metaLabel:
        type === "video"
          ? item.isDemo
            ? "Демо · Таймлапс"
            : "Таймлапс"
          : item.isDemo
            ? "Демо · Фото"
            : "Фото",
      badge: type === "video" ? "Таймлапс" : null,
      isDemo: item.isDemo,
      discussionId: null,
      sortAt: gallerySortAt(index, index),
    };
  });
}

export function guidesToPosts(guides: CropGuide[]): UsefulFeedPost[] {
  return guides.map((guide, index) => {
    const preview = getGuidePreviewImage(guide);
    const published = guide.publishedAt ? Date.parse(guide.publishedAt) : NaN;
    const culture = CROP_KIND_LABELS[guide.cropKind];
    return {
      id: `guide.${guide.id}`,
      type: "guide" as const,
      title: guide.title,
      body: guide.excerpt?.trim() || null,
      mediaSrc: preview.url,
      alt: preview.alt,
      href: guideArticleHref(guide.slug),
      authorName: "Гайд",
      metaLabel: Number.isFinite(published)
        ? `${formatRelativeRu(published)} · ${culture}`
        : `Гайды и советы · ${culture}`,
      badge: "Гайд",
      discussionId: guide.discussionId ?? null,
      sortAt: Number.isFinite(published)
        ? published
        : Date.now() - (guide.sortOrder ?? index) * 86_400_000,
    };
  });
}

export function buildUsefulFeedPosts(input: {
  videos: UsefulFeedItem[];
  photos: UsefulFeedItem[];
  guides: CropGuide[];
}): UsefulFeedPost[] {
  const videos =
    input.videos.length > 0
      ? input.videos
      : demoVideoItems();
  const photos =
    input.photos.length > 0
      ? input.photos
      : demoPhotoItems();
  const guidePosts =
    input.guides.length > 0
      ? guidesToPosts(input.guides)
      : demoGuidePosts();

  return [
    ...mediaItemsToPosts(videos, "video"),
    ...mediaItemsToPosts(photos, "image"),
    ...guidePosts,
  ].sort((a, b) => b.sortAt - a.sortAt);
}

export function filterUsefulFeedPosts(
  posts: UsefulFeedPost[],
  filter: UsefulFeedFilter,
): UsefulFeedPost[] {
  if (filter === "all") return posts;
  return posts.filter(post => post.type === filter);
}

export const USEFUL_FEED_FILTERS: {
  id: UsefulFeedFilter;
  label: string;
  icon: string;
  shortLabel: string;
}[] = [
  {
    id: "all",
    label: "Все посты",
    shortLabel: "Все",
    icon: "grid_view",
  },
  {
    id: "guide",
    label: "Гайды и советы",
    shortLabel: "Гайды",
    icon: "menu_book",
  },
  {
    id: "image",
    label: "Фото",
    shortLabel: "Фото",
    icon: "photo_library",
  },
  {
    id: "video",
    label: "Таймлапс",
    shortLabel: "Таймлапс",
    icon: "timelapse",
  },
];

function formatRelativeRu(ms: number): string {
  const deltaSec = Math.round((Date.now() - ms) / 1000);
  if (deltaSec < 60) return "только что";
  const mins = Math.round(deltaSec / 60);
  if (mins < 60) return `${mins} мин. назад`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours} ч. назад`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} дн. назад`;
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
    }).format(new Date(ms));
  } catch {
    return "ранее";
  }
}

function demoVideoItems(): UsefulFeedItem[] {
  return [
    {
      id: "demo.video.1",
      kind: "VIDEO",
      src: "",
      caption: "14 дней базилика: питательный раствор против воды из-под крана",
      isDemo: true,
    },
    {
      id: "demo.video.2",
      kind: "VIDEO",
      src: "",
      caption: "Рассада томатов — пикировка без стресса",
      isDemo: true,
    },
  ];
}

function demoPhotoItems(): UsefulFeedItem[] {
  return [
    {
      id: "demo.photo.1",
      kind: "IMAGE",
      src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80",
      caption: "Грядка после дождя — влажность держится лучше, чем ожидалось",
      alt: "Грядка",
      isDemo: true,
    },
    {
      id: "demo.photo.2",
      kind: "IMAGE",
      src: "https://images.unsplash.com/photo-1466692476866-aef1dfb1e735?w=900&q=80",
      caption: "Рассада на подоконнике: простой сетап под досветку",
      alt: "Рассада",
      isDemo: true,
    },
  ];
}

function demoGuidePosts(): UsefulFeedPost[] {
  return [
    {
      id: "demo.guide.1",
      type: "guide",
      title: "Гидропоника с нуля: что реально важно в первую неделю",
      body: "Короткий разбор pH, EC и света — без лишней теории, только то, что спасает урожай.",
      mediaSrc:
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=900&q=80",
      alt: "Растения",
      href: "/guides",
      authorName: "Гайд",
      metaLabel: "Демо · Гайды и советы",
      badge: "Гайд",
      isDemo: true,
      sortAt: Date.now() - 3_600_000,
    },
  ];
}
