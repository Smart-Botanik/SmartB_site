import type { CropGuide, MediaGalleryItem } from "@/lib/content-api";
import {
  CROP_KIND_LABELS,
  getGuidePreviewImage,
} from "@/lib/content-api";
import type { EngagementBundle } from "@/lib/engagement";
import { guideArticleHref } from "@/lib/guide-view-paths";

/**
 * Post kinds in the unified «Полезное» feed.
 * Canonical labels (admin / docs): GUIDE | IMAGE | VIDEO | SOURCE.
 * UI filter ids stay lowercase for CSS / state.
 */
export type UsefulPostType = "video" | "image" | "guide" | "source";

/** Sidebar / chip filter ids (`all` + UsefulPostType). */
export type UsefulFeedFilter = "all" | "guide" | "image" | "video" | "source";

/** Uppercase type labels for docs / admin parity. */
export const USEFUL_POST_TYPE_LABELS = {
  guide: "GUIDE",
  image: "IMAGE",
  video: "VIDEO",
  source: "SOURCE",
} as const satisfies Record<UsefulPostType, string>;

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
  /** Display host for external source posts (e.g. fao.org). */
  sourceHost?: string | null;
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
      type === "video" ? "Видео" : "Фото из сообщества",
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
            ? "Демо · Видео"
            : "Видео"
          : item.isDemo
            ? "Демо · Фото"
            : "Фото",
      badge: type === "video" ? "Видео" : null,
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
  if (filter === "guide") {
    return posts.filter(post => post.type === "guide" || post.type === "source");
  }
  return posts.filter(post => post.type === filter);
}

/** Counts per filter for sidebar / chips (loaded feed only — no API). */
export function countUsefulFeedByType(
  posts: UsefulFeedPost[],
): Record<UsefulFeedFilter, number> {
  const counts: Record<UsefulFeedFilter, number> = {
    all: posts.length,
    guide: 0,
    image: 0,
    video: 0,
    source: 0,
  };
  for (const post of posts) {
    if (post.type === "guide" || post.type === "source") {
      counts.guide += 1;
    } else {
      counts[post.type] += 1;
    }
  }
  return counts;
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
    shortLabel: "Все посты",
    icon: "grid_view",
  },
  {
    id: "video",
    label: "Видео",
    shortLabel: "Видео",
    icon: "play_circle",
  },
  {
    id: "image",
    label: "Фото",
    shortLabel: "Фото",
    icon: "photo_library",
  },
  {
    id: "guide",
    label: "Гайды",
    shortLabel: "Гайды",
    icon: "menu_book",
  },
];

export function isExternalHref(href: string | null | undefined): boolean {
  if (!href) return false;
  return /^https?:\/\//i.test(href);
}

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

/**
 * Local placeholder feed for `/useful` until CMS sources + galleries are filled.
 * Flip to `false` to restore live galleries / interesting guides.
 */
export const USEFUL_FEED_USE_PLACEHOLDERS = true;

export function buildPlaceholderUsefulFeedPosts(): UsefulFeedPost[] {
  const now = Date.now();
  const posts: UsefulFeedPost[] = [
    {
      id: "demo.source.1",
      type: "source",
      title: "FAO: практики устойчивого овощеводства",
      body: "Краткий обзор агротехник для небольших хозяйств — полив, севооборот и защита без лишней химии.",
      mediaSrc:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=80",
      alt: "Овощная грядка",
      href: "https://www.fao.org/",
      authorName: "FAO",
      metaLabel: "Источник · справочник",
      badge: "Источник",
      isDemo: true,
      sourceHost: "fao.org",
      sortAt: now - 30 * 60_000,
    },
    {
      id: "demo.video.1",
      type: "video",
      title: "14 дней базилика: раствор против воды из-под крана",
      body: "Сравнение двух подходов в одном таймлапсе — видно разницу уже на второй неделе.",
      mediaSrc: null,
      authorName: "Видеолента",
      metaLabel: "Демо · Видео",
      badge: "Видео",
      isDemo: true,
      sortAt: now - 2 * 60 * 60_000,
    },
    {
      id: "demo.image.1",
      type: "image",
      title: "Грядка после дождя — влажность держится лучше, чем ожидалось",
      body: "Заметка из сообщества: мульча + лёгкий уклон спасли от застоя воды.",
      mediaSrc:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80",
      alt: "Грядка после дождя",
      authorName: "Фотолента",
      metaLabel: "Демо · Фото",
      isDemo: true,
      sortAt: now - 5 * 60 * 60_000,
    },
    {
      id: "demo.source.2",
      type: "source",
      title: "RHS: календарь посева для холодного климата",
      body: "Таблицы сроков и советы по закаливанию рассады — удобно сверять с нашим лунным календарём.",
      mediaSrc:
        "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=900&q=80",
      alt: "Семена и грунт",
      href: "https://www.rhs.org.uk/",
      authorName: "RHS",
      metaLabel: "Источник · календарь",
      badge: "Источник",
      isDemo: true,
      sourceHost: "rhs.org.uk",
      sortAt: now - 8 * 60 * 60_000,
    },
    {
      id: "demo.guide.1",
      type: "guide",
      title: "Гидропоника с нуля: что реально важно в первую неделю",
      body: "Короткий разбор pH, EC и света — без лишней теории, только то, что спасает урожай.",
      mediaSrc:
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=900&q=80",
      alt: "Растения на гидропонике",
      href: "/guides",
      authorName: "Гайд",
      metaLabel: "Демо · Гайды и советы",
      badge: "Гайд",
      isDemo: true,
      sortAt: now - 12 * 60 * 60_000,
    },
    {
      id: "demo.video.2",
      type: "video",
      title: "Рассада томатов — пикировка без стресса",
      body: "Таймлапс пикировки: подготовка лунок, глубина и первый полив.",
      mediaSrc: null,
      authorName: "Видеолента",
      metaLabel: "Демо · Видео",
      badge: "Видео",
      isDemo: true,
      sortAt: now - 18 * 60 * 60_000,
    },
    {
      id: "demo.image.2",
      type: "image",
      title: "Рассада на подоконнике: простой сетап под досветку",
      body: "Полка, два светильника и отражатель из фольги — бюджетный вариант на старт сезона.",
      mediaSrc:
        "https://images.unsplash.com/photo-1466692476866-aef1dfb1e735?w=900&q=80",
      alt: "Рассада на подоконнике",
      authorName: "Фотолента",
      metaLabel: "Демо · Фото",
      isDemo: true,
      sortAt: now - 26 * 60 * 60_000,
    },
    {
      id: "demo.source.3",
      type: "source",
      title: "Cornell Extension: болезни томатов — диагностика по листьям",
      body: "Фото-гид по пятнистостям и хлорозу: что лечить, а что удалять сразу.",
      mediaSrc:
        "https://images.unsplash.com/photo-1592849600221-8e50efd6e8d4?w=900&q=80",
      alt: "Томаты на ветке",
      href: "https://cals.cornell.edu/",
      authorName: "Cornell CALS",
      metaLabel: "Источник · диагностика",
      badge: "Источник",
      isDemo: true,
      sourceHost: "cals.cornell.edu",
      sortAt: now - 36 * 60 * 60_000,
    },
  ];
  return posts.sort((a, b) => b.sortAt - a.sortAt);
}
