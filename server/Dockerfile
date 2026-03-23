# ── Stage 1: install all dependencies ────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ── Stage 2: compile TypeScript ───────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# ── Stage 3: production runtime (prod deps only) ──────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Install only production dependencies for a smaller image
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY --from=builder /app/dist ./dist
# Copy fixture data directly from build context — avoids stale builder cache
COPY data ./data
EXPOSE 4000
CMD ["node", "dist/index.js"]
