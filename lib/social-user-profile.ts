import { siteEnv } from "./env";
import {
  fetchUserProfile,
  type SocialAuthorProfileDto,
  type UserProfileDto,
} from "./user-api";

type GraphqlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

async function socialGraphql<TData>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<TData | null> {
  if (!siteEnv.socialGraphqlUrl?.trim()) return null;
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

/**
 * Site stitch (ADR-0024): user-service profile + social stats.
 * Not via backend_nest.
 */
export async function fetchSocialAuthorProfile(
  userId: string,
): Promise<SocialAuthorProfileDto | null> {
  const id = userId?.trim();
  if (!id || id === "anonymous") return null;

  const [profile, statsData] = await Promise.all([
    fetchUserProfile(id),
    socialGraphql<{
      socialAuthorStats: { userId: string; commentCount: number; likeCount: number };
    }>(
      `query SocialAuthorStats($userId: ID!) {
        socialAuthorStats(userId: $userId) {
          userId
          commentCount
          likeCount
        }
      }`,
      { userId: id },
    ),
  ]);

  const stats = statsData?.socialAuthorStats;
  return {
    userId: id,
    profile: profile as UserProfileDto | null,
    commentCount: stats?.commentCount ?? 0,
    likeCount: stats?.likeCount ?? 0,
  };
}