# LA252691

Service health dashboard — GraphQL API + React frontend, orchestrated via Docker Compose.

---

## Architecture

The server is a Node.js/TypeScript Apollo Server 5 instance exposed via Express 5. It resolves a schema-first GraphQL API backed by an in-memory JSON fixture store (`server/data/fixtures.json`), with DataLoader used to batch and cache resolver calls and prevent N+1 queries. Real-time metric pushes and deployment-settled events are delivered over a persistent WebSocket using `graphql-ws` with Apollo's in-process `PubSub`. The client is a React 19 / Vite SPA that uses Apollo Client for queries, mutations, and subscriptions, with Mantine v8 as the sole UI component library. Apollo's in-memory cache plus a custom retry link keeps the dashboard usable when the server is temporarily unreachable — cached data stays visible and requests retry with exponential back-off.

---

## Setup

### Docker (recommended)

Only Docker is required.

```bash
cp .env.example .env          # defaults work out of the box
docker compose up --build
```

| URL | |
|---|---|
| `http://localhost:3000` | Client |
| `http://localhost:4000/graphql` | GraphQL API |

### Local development

Node.js 20.6+ and Yarn 1.x are required. Preferred for active development — Vite's HMR gives instant in-browser updates on file save, without the Docker rebuild cycle.

```bash
cp .env.example .env

# Terminal 1 — server
cd server && yarn install && yarn dev

# Terminal 2 — client
cd client && yarn install && yarn dev
```

---

## Tests

```bash
cd server && yarn test
```

Uses Node's built-in `node:test` runner — no extra dependencies. Four tests covering two areas:

**DataLoader ordering contract** (`resolvers.test.ts`): Verifies the batch function returns results in the same order as input keys. A violation would silently cross-wire deployment lists between services (e.g. `loader.load('svc-a')` returning svc-b's data). Also verifies that concurrent `.load()` calls are coalesced into a single batch call, confirming the N+1 prevention works.

**`triggerDeployment` version validation** (`resolvers.test.ts`): The server validates the version string before any processing. Tests confirm valid semver strings are accepted (`v1.2.3`, `v2.0.0-beta1`) and injection attempts are rejected (`../../etc/passwd`, `latest`, `v1.2.3.4`, strings exceeding 50 chars).

---

## Security Considerations

### Controls in place

| Control | Where | What it prevents |
|---|---|---|
| CORS restricted to a single origin | `server/src/index.ts` | Blocks CSRF-style cross-origin requests |
| `X-Content-Type-Options: nosniff` | `server/src/index.ts` | Prevents MIME-type sniffing attacks |
| `X-Frame-Options: DENY` | `server/src/index.ts` | Blocks clickjacking via `<iframe>` |
| GraphQL introspection disabled in production | `server/src/index.ts` | Removes schema reconnaissance surface |
| WebSocket API key verified in `onConnect` | `server/src/ws.ts` | Unauthenticated clients get 4403 Forbidden before any data flows |
| Secrets in env vars, never in source | `.env` (gitignored) | No credentials in the repository |
| `withFilter` on `metricUpdated` | `server/src/resolvers/resolvers.ts` | Subscribers only receive data for their subscribed `serviceId` — enforced server-side |
| Version string validated server-side | `server/src/resolvers/resolvers.ts` | Rejects non-semver inputs (including path traversal attempts) before processing |
| `triggerDeployment` rate-limited (3 / service / 60 s) | `server/src/resolvers/resolvers.ts` | Limits deployment call abuse per service |

### Known limitations and production path

**Shared API key in the client bundle.** `VITE_API_KEY` is compiled into the JavaScript bundle — visible to anyone who downloads the client. It gates transport but provides no per-user security. Production fix: replace with short-lived JWTs from an identity provider (Auth0, Entra ID, etc.), passed in `connectionParams.authorization` and verified in `onConnect`.

**No field-level authorisation.** Once connected, a client can attempt to subscribe to any `serviceId`. `withFilter` limits delivery but does not refuse the subscription itself. Production fix: check caller identity against the requested resource inside the `subscribe` function.

**In-memory rate limiter.** The rate limit counter resets on restart and breaks under horizontal scaling. Production fix: replace with a Redis `INCR`/`EXPIRE` atomic counter keyed on `userId + serviceId`.

---

## Trade-offs

| Decision | What was accepted | Production replacement |
|---|---|---|
| **In-memory fixture store** (`fixtures.json`) | No database required; state persists across restarts but is not concurrent-safe | PostgreSQL / any RDBMS |
| **In-process `PubSub`** | No broker to configure; events on one process never reach subscribers on another | `graphql-redis-subscriptions` (Redis Pub/Sub) |
| **In-memory rate limiter** | Simple; resets on restart; breaks under horizontal scale | Redis `INCR`/`EXPIRE` keyed on `userId + serviceId` |
| **Shared static API key** | Simple to configure; demonstrates WS auth handshake pattern | Per-user JWT from an identity provider |
| **No persistent metric history** | Metrics are push-only; no time-series store required; chart starts empty on page load | InfluxDB / TimescaleDB; seed chart via `metrics(serviceId, last: N)` on mount |
| **`healthTrend` derived in-process** | Computed from consecutive ticker ticks; resets on server restart | Rolling window computed from DB-stored metrics |
| **Simulated service data** | `status`, `uptime`, and metrics are generated server-side by the ticker; no real services exist | Each real service would expose a `/health` endpoint (or equivalent); the dashboard server would poll or subscribe to those endpoints and derive `status`/`uptime` from the responses |



