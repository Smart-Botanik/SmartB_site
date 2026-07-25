import { siteEnv } from "./env";

type GraphqlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export type UserProfileDto = {
  id: string;
  email: string;
  displayName: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarMediaId?: string | null;
};

export type SocialAuthorProfileDto = {
  userId: string;
  profile: UserProfileDto | null;
  commentCount: number;
  likeCount: number;
};

function userConfigured(): boolean {
  return Boolean(siteEnv.userGraphqlUrl?.trim());
}

async function userGraphql<TData>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<TData | null> {
  if (!userConfigured()) return null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const key = siteEnv.userInternalKey?.trim();
  if (key) {
    headers["X-User-Internal-Key"] = key;
  }

  try {
    const response = await fetch(siteEnv.userGraphqlUrl, {
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

export async function fetchUserProfile(
  id: string,
): Promise<UserProfileDto | null> {
  const userId = id?.trim();
  if (!userId) return null;
  const data = await userGraphql<{ userProfile: UserProfileDto | null }>(
    `query UserProfile($id: ID!) {
      userProfile(id: $id) {
        id
        email
        displayName
        firstName
        lastName
        avatarMediaId
      }
    }`,
    { id: userId },
  );
  return data?.userProfile ?? null;
}

/** Batch display names for comment authors (ADR-0024 site stitch). */
export async function fetchDisplayNamesByUserIds(
  userIds: string[],
): Promise<Map<string, string>> {
  const unique = [
    ...new Set(userIds.map((id) => id.trim()).filter(Boolean)),
  ].filter((id) => id !== "anonymous");
  const result = new Map<string, string>();
  await Promise.all(
    unique.map(async (id) => {
      const profile = await fetchUserProfile(id);
      if (profile?.displayName) {
        result.set(id, profile.displayName);
      }
    }),
  );
  return result;
}
