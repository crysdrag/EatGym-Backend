# ============================================================
#  EatGym API – multi-stage Dockerfile
# ============================================================

# ---------- stage 1: install production dependencies ----------
FROM node:20-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --shamefully-hoist

# ---------- stage 2: runtime ----------
FROM node:20-alpine AS runtime

# Security: run as non-root user
RUN addgroup -S eatgym && adduser -S eatgym -G eatgym

WORKDIR /app

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code and SQL migrations
COPY package.json ./
COPY src/ ./src/
COPY sql/ ./sql/

# Switch to non-root user
USER eatgym

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]
