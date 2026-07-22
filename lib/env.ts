const graphqlUrl =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3001/graphql";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  graphqlUrl.replace(/\/graphql\/?$/, "");

const appBasePath = process.env.NEXT_PUBLIC_APP_BASE_PATH ?? "/app";

const telegramUrl =
  process.env.NEXT_PUBLIC_TELEGRAM_URL ?? "https://t.me/smartbotanik";

/** Site → social-service directly (ADR-0020). Not backend_nest. */
const socialGraphqlUrl =
  process.env.SOCIAL_GRAPHQL_URL ??
  process.env.NEXT_PUBLIC_SOCIAL_GRAPHQL_URL ??
  "http://localhost:3014/graphql";

/** Server-only; do not expose to client bundle. */
const socialInternalKey =
  process.env.SOCIAL_SERVICE_INTERNAL_KEY ?? "dev-social-internal";

export const siteEnv = {
  graphqlUrl,
  apiBaseUrl,
  appBasePath,
  telegramUrl,
  socialGraphqlUrl,
  socialInternalKey,
  revalidateSeconds: Number(process.env.NEXT_PUBLIC_REVALIDATE_SECONDS ?? "3600"),
};
