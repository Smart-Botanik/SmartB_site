import { siteEnv } from "./env";
import type {
  CommentDto,
  CommentStatus,
  EngagementBundle,
  EngagementStatsDto,
} from "./engagement";
import {
  getHardcodedEngagement,
  getHardcodedEngagementByDiscussionId,
  type DiscussionSubjectType,
} from "./engagement";

type GraphqlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

type RemoteComment = {
  id: string;
  discussionId: string;
  authorId: string;
  authorDisplayName?: string | null;
  body: string;
  parentId?: string | null;
  status: CommentStatus;
  createdAt: string;
};

type RemoteStats = {
  discussionId: string;
  likeCount: number;
  commentCount: number;
  likedByMe?: boolean | null;
};

function socialConfigured(): boolean {
  return Boolean(siteEnv.socialGraphqlUrl?.trim());
}

async function socialGraphql<TData>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<TData | null> {
  if (!socialConfigured()) return null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const key = siteEnv.socialInternalKey?.trim();
  if (key) {
    headers["X-Social-Internal-Key"] = key;
  }

  try {
    const response = await fetch(siteEnv.socialGraphqlUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      next: { revalidate: siteEnv.revalidateSeconds },
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as GraphqlResponse<TData>;
    if (payload.errors?.length || !payload.data) return null;
    return payload.data;
  } catch {
    return null;
  }
}

function mapComment(row: RemoteComment): CommentDto {
  return {
    id: row.id,
    discussionId: row.discussionId,
    author: {
      id: row.authorId,
      displayName: row.authorDisplayName?.trim() || "Участник",
    },
    body: row.body,
    parentId: row.parentId ?? null,
    status: row.status,
    createdAt:
      typeof row.createdAt === "string"
        ? row.createdAt
        : new Date(row.createdAt).toISOString(),
  };
}

function mapStats(row: RemoteStats): EngagementStatsDto {
  return {
    discussionId: row.discussionId,
    likeCount: row.likeCount,
    commentCount: row.commentCount,
    likedByMe: row.likedByMe ?? undefined,
  };
}

/** Live engagement from social-service; null if unavailable. */
export async function fetchEngagementBundle(
  discussionId: string,
): Promise<EngagementBundle | null> {
  const id = discussionId?.trim();
  if (!id) return null;

  const data = await socialGraphql<{
    engagementStats: RemoteStats | null;
    comments: RemoteComment[];
  }>(
    `query EngagementBundle($discussionId: ID!) {
      engagementStats(discussionId: $discussionId) {
        discussionId
        likeCount
        commentCount
        likedByMe
      }
      comments(discussionId: $discussionId, limit: 50) {
        id
        discussionId
        authorId
        authorDisplayName
        body
        parentId
        status
        createdAt
      }
    }`,
    { discussionId: id },
  );

  if (!data?.engagementStats) return null;

  return {
    stats: mapStats(data.engagementStats),
    comments: (data.comments ?? []).map(mapComment),
  };
}

/** Batch stats only (list cards); comments stay empty until detail fetch. */
export async function fetchEngagementStatsBatch(
  discussionIds: string[],
): Promise<Map<string, EngagementStatsDto>> {
  const unique = [...new Set(discussionIds.map(id => id.trim()).filter(Boolean))];
  const result = new Map<string, EngagementStatsDto>();
  if (unique.length === 0) return result;

  const data = await socialGraphql<{
    engagementStatsBatch: RemoteStats[];
  }>(
    `query EngagementStatsBatch($discussionIds: [ID!]!) {
      engagementStatsBatch(discussionIds: $discussionIds) {
        discussionId
        likeCount
        commentCount
        likedByMe
      }
    }`,
    { discussionIds: unique },
  );

  for (const row of data?.engagementStatsBatch ?? []) {
    result.set(row.discussionId, mapStats(row));
  }
  return result;
}

export type ResolveEngagementInput = {
  discussionId?: string | null;
  subjectType?: DiscussionSubjectType;
  subjectId?: string;
};

/**
 * Prefer live social-service; fall back to deterministic mocks.
 * Use when `discussionId` is missing → mock from subjectType/subjectId.
 */
export async function resolveEngagement(
  input: ResolveEngagementInput,
): Promise<EngagementBundle> {
  const discussionId = input.discussionId?.trim();
  if (discussionId) {
    const live = await fetchEngagementBundle(discussionId);
    if (live) return live;
    return getHardcodedEngagementByDiscussionId(discussionId);
  }
  if (input.subjectType && input.subjectId) {
    return getHardcodedEngagement(input.subjectType, input.subjectId);
  }
  return getHardcodedEngagementByDiscussionId("disc.mock.unknown");
}
