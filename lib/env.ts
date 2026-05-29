const graphqlUrl =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3001/graphql";

const appBasePath = process.env.NEXT_PUBLIC_APP_BASE_PATH ?? "/app";

export const siteEnv = {
  graphqlUrl,
  appBasePath,
  revalidateSeconds: Number(process.env.NEXT_PUBLIC_REVALIDATE_SECONDS ?? "3600"),
};
