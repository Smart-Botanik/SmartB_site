import { siteEnv } from "./env";

type GraphqlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export async function graphqlRequest<TData>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { revalidate?: number | false },
): Promise<TData> {
  const revalidate = options?.revalidate ?? siteEnv.revalidateSeconds;

  const response = await fetch(siteEnv.graphqlUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    ...(revalidate === false
      ? { cache: "no-store" as const }
      : { next: { revalidate } }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL HTTP ${response.status}`);
  }

  const payload = (await response.json()) as GraphqlResponse<TData>;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map(error => error.message).join("; "));
  }

  if (!payload.data) {
    throw new Error("GraphQL response missing data");
  }

  return payload.data;
}
