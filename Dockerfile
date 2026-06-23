# syntax=docker/dockerfile:1

# ---- Build the SPA and the server bundle ----
FROM node:22-trixie-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Production dependencies only ----
FROM node:22-trixie-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ---- Slim runtime ----
FROM node:22-trixie-slim AS runtime
ENV NODE_ENV=production \
    PORT=3000 \
    TZ=UTC \
    STATE_DIR=/app/data
WORKDIR /app

# gosu lets the entrypoint fix the state-volume ownership as root, then drop to
# the non-root app user.
RUN apt-get update \
  && apt-get install -y --no-install-recommends gosu \
  && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json docker-entrypoint.sh ./

# Persisted state (last-working category) lives here; mount it as a volume.
RUN mkdir -p /app/data && chown -R node:node /app && chmod +x /app/docker-entrypoint.sh

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Starts as root to chown the state volume, then drops to the node user.
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "dist/server/index.cjs"]
