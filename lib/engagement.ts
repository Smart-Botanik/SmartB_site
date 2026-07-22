/**
 * Site-local engagement shapes — mirror future `@growing/contracts` DTOs.
 * Backend wiring: see platform cards ARCH-ENGAGE-1 / BK-ENGAGE-1.
 * UI uses hardcoded mocks until GraphQL exists.
 */

export type EngagementTargetType =
  | "GUIDE"
  | "MEDIA_GALLERY_ITEM"
  | "MEDIA_ENTRY";

export type CommentStatus = "PENDING" | "PUBLISHED" | "HIDDEN";

export type EngagementAuthor = {
  id: string;
  displayName: string;
  avatarUrl?: string | null;
};

export type CommentDto = {
  id: string;
  targetType: EngagementTargetType;
  targetId: string;
  author: EngagementAuthor;
  body: string;
  parentId?: string | null;
  status: CommentStatus;
  createdAt: string;
};

export type LikeDto = {
  id: string;
  targetType: EngagementTargetType;
  targetId: string;
  userId: string;
  createdAt: string;
};

export type EngagementStatsDto = {
  targetType: EngagementTargetType;
  targetId: string;
  likeCount: number;
  commentCount: number;
  likedByMe?: boolean;
};

export type EngagementBundle = {
  stats: EngagementStatsDto;
  comments: CommentDto[];
};

const DEMO_AUTHORS: EngagementAuthor[] = [
  { id: "user.demo.anya", displayName: "Аня" },
  { id: "user.demo.igor", displayName: "Игорь" },
  { id: "user.demo.masha", displayName: "Маша" },
  { id: "user.demo.pavel", displayName: "Павел" },
  { id: "user.demo.lena", displayName: "Лена" },
];

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pickAuthor(seed: number): EngagementAuthor {
  return DEMO_AUTHORS[seed % DEMO_AUTHORS.length];
}

const COMMENT_POOL = [
  "Классный приём, попробую на следующей неделе!",
  "А какой грунт у вас в итоге остался?",
  "Спасибо за разбор — очень по делу.",
  "У меня похожий опыт, только полив реже.",
  "Можно ещё фото через две недели?",
  "Сохранил(а) в избранное 🌱",
  "Не ожидал(а), что так просто.",
  "А свет какой — LED или ДНаТ?",
];

/** Deterministic mock engagement for any target id (guides, gallery items). */
export function getHardcodedEngagement(
  targetType: EngagementTargetType,
  targetId: string,
): EngagementBundle {
  const seed = hashSeed(`${targetType}:${targetId}`);
  const likeCount = 3 + (seed % 97);
  const commentCount = 1 + (seed % 5);
  const likedByMe = seed % 3 === 0;

  const comments: CommentDto[] = Array.from({ length: commentCount }, (_, index) => {
    const localSeed = seed + index * 17;
    const author = pickAuthor(localSeed);
    const daysAgo = 1 + (localSeed % 14);
    const created = new Date();
    created.setDate(created.getDate() - daysAgo);
    return {
      id: `cmt.${targetType}.${targetId}.${index}`,
      targetType,
      targetId,
      author,
      body: COMMENT_POOL[localSeed % COMMENT_POOL.length],
      parentId: null,
      status: "PUBLISHED",
      createdAt: created.toISOString(),
    };
  });

  return {
    stats: {
      targetType,
      targetId,
      likeCount,
      commentCount: comments.length,
      likedByMe,
    },
    comments,
  };
}

export function formatEngagementCount(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(".0", "")}k`;
  }
  return String(value);
}

export function formatCommentDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}
