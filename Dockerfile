# Public site (Next.js) — build context: monorepo root
# Home-PC default: Node server (SITE_STATIC_EXPORT=0) so CMS changes are live.
# Static export: pass SITE_STATIC_EXPORT=1 and rebuild after content changes.
FROM node:22-alpine AS contracts
ENV NPM_CONFIG_REGISTRY=https://registry.npmjs.org/
WORKDIR /app
COPY packages/contracts/package.json packages/contracts/
COPY packages/contracts/tsconfig.json packages/contracts/
COPY packages/contracts/scripts packages/contracts/scripts/
COPY packages/contracts/schema packages/contracts/schema/
COPY packages/contracts/src packages/contracts/src/
WORKDIR /app/packages/contracts
RUN npm install --no-audit --no-fund --ignore-scripts \
  && npm run build

FROM node:22-alpine AS content-markdown
ENV NPM_CONFIG_REGISTRY=https://registry.npmjs.org/
WORKDIR /app
COPY packages/content-markdown/package.json packages/content-markdown/
COPY packages/content-markdown/tsconfig.json packages/content-markdown/
COPY packages/content-markdown/tsconfig.cjs.json packages/content-markdown/
COPY packages/content-markdown/scripts packages/content-markdown/scripts/
COPY packages/content-markdown/src packages/content-markdown/src/
WORKDIR /app/packages/content-markdown
RUN npm install --no-audit --no-fund --ignore-scripts \
  && npm run build

FROM node:22-alpine AS build
ENV NPM_CONFIG_REGISTRY=https://registry.npmjs.org/
WORKDIR /app
COPY --from=contracts /app/packages/contracts /app/packages/contracts
COPY --from=content-markdown /app/packages/content-markdown /app/packages/content-markdown
COPY site/package.json /app/site/
WORKDIR /app/site
RUN npm install --no-audit --no-fund
COPY site/ /app/site/
RUN rm -f package-lock.json

# Browser / same-origin GraphQL (nginx or direct :3030). Build-time fetches use this too
# when the stack is already up; for first image build prefer a reachable URL or rebuild after up.
ARG NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3001/graphql
ARG NEXT_PUBLIC_APP_BASE_PATH=/app
ARG NEXT_PUBLIC_TELEGRAM_URL=https://t.me/smartbotanik
ARG NEXT_PUBLIC_REVALIDATE_SECONDS=60
ARG SITE_STATIC_EXPORT=0
ENV NEXT_PUBLIC_GRAPHQL_URL=$NEXT_PUBLIC_GRAPHQL_URL \
    NEXT_PUBLIC_APP_BASE_PATH=$NEXT_PUBLIC_APP_BASE_PATH \
    NEXT_PUBLIC_TELEGRAM_URL=$NEXT_PUBLIC_TELEGRAM_URL \
    NEXT_PUBLIC_REVALIDATE_SECONDS=$NEXT_PUBLIC_REVALIDATE_SECONDS \
    SITE_STATIC_EXPORT=$SITE_STATIC_EXPORT

# Ensure `out/` exists for COPY when using Node mode (no static export)
RUN mkdir -p out && npm run build

FROM node:22-alpine AS runner
WORKDIR /app/site
ENV NODE_ENV=production
ENV PORT=3030
ENV SITE_STATIC_EXPORT=0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /app/packages/contracts /app/packages/contracts
COPY --from=build /app/packages/content-markdown /app/packages/content-markdown
COPY --from=build /app/site ./
USER app
EXPOSE 3030
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:3030/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["npx", "next", "start", "--port", "3030"]
