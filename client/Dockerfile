# ── Stage 1: install all dependencies ────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ── Stage 2: Vite build ───────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# VITE_GRAPHQL_URL is a build-time arg: Vite inlines VITE_* vars into the bundle.
# Default keeps the image buildable without compose (e.g. plain docker build).
ARG VITE_GRAPHQL_URL=http://localhost:4000/graphql
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL

# VITE_WS_URL is a build-time arg: Vite inlines VITE_* vars into the bundle.
# Default keeps the image buildable without compose (e.g. plain docker build).
ARG VITE_WS_URL=ws://localhost:4000/graphql/ws
ENV VITE_WS_URL=$VITE_WS_URL

# VITE_API_KEY is a build-time arg: Vite inlines VITE_* vars into the bundle.
# No default — omitting it means requests will be rejected by the server.
ARG VITE_API_KEY
ENV VITE_API_KEY=$VITE_API_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# ── Stage 3: nginx static file server ────────────────────────────────────────
FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
