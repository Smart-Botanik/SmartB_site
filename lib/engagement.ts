/**
 * Site engagement DTOs — mirror `@growing/contracts` / ADR-0020 (discussion-centric).
 * UI uses hardcoded mocks until live social-service GraphQL (site → :3014).
 * `backend_nest` is the Grow app BFF — not used for site comments (ADR-0020).
 */

export type DiscussionSubjectType =
  | "GUIDE"
  | "MEDIA_GALLERY_ITEM"
  | "MEDIA_ENTRY"
  | "POST";

export type CommentStatus = "PENDING" | "PUBLISHED" | "HIDDEN";

export type EngagementAuthor = {
  id: string;
  displayName: string;
  avatarUrl?: string | null;
};

export type CommentDto = {
  id: string;
  discussionId: string;
  author: EngagementAuthor;
  body: string;
  parentId?: string | null;
  status: CommentStatus;
  createdAt: string;
};

export type EngagementStatsDto = {
  discussionId: string;
  likeCount: number;
  commentCount: number;
  likedByMe?: boolean;
};

export type EngagementBundle = {
  stats: EngagementStatsDto;
  comments: CommentDto[];
};

/** @deprecated Prefer discussionId; kept for mock seed from subject keys. */
export type EngagementTargetType = DiscussionSubjectType;

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

/** Stable mock discussion id from subject (until guides expose real discussionId). */
export function mockDiscussionId(
  subjectType: DiscussionSubjectType,
  subjectId: string,
): string {
  return `disc.mock.${subjectType}.${subjectId}`;
}

/** Deterministic mock engagement keyed by discussionId (ADR-0020). */
export function getHardcodedEngagementByDiscussionId(
  discussionId: string,
): EngagementBundle {
  const seed = hashSeed(discussionId);
  const likeCount = 3 + (seed % 97);
  const commentCount = 1 + (seed % 5);
  const likedByMe = seed % 3 === 0;

  const comments: CommentDto[] = Array.from(
    { length: commentCount },
    (_, index) => {
      const localSeed = seed + index * 17;
      const author = pickAuthor(localSeed);
      const daysAgo = 1 + (localSeed % 14);
      const created = new Date();
      created.setDate(created.getDate() - daysAgo);
      return {
        id: `cmt.${discussionId}.${index}`,
        discussionId,
        author,
        body: COMMENT_POOL[localSeed % COMMENT_POOL.length],
        parentId: null,
        status: "PUBLISHED" as const,
        createdAt: created.toISOString(),
      };
    },
  );

  return {
    stats: {
      discussionId,
      likeCount,
      commentCount: comments.length,
      likedByMe,
    },
    comments,
  };
}

/**
 * Mock engagement from subject type/id (useful feed / guides without discussionId yet).
 * Prefer `getHardcodedEngagementByDiscussionId` when guide.discussionId is present.
 */
export function getHardcodedEngagement(
  subjectType: DiscussionSubjectType,
  subjectId: string,
): EngagementBundle {
  return getHardcodedEngagementByDiscussionId(
    mockDiscussionId(subjectType, subjectId),
  );
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
