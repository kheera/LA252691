# LA252691

Full-stack application with a GraphQL API and a React frontend, orchestrated via Docker Compose.

## Stack

| Layer  | Technology |
|--------|-----------|
| Server | Node.js, TypeScript, Apollo Server 4, Express |
| Client | React 19, TypeScript, Vite, Apollo Client |
| UI     | react-windows-ui (Windows 11 components + theming) |
| Infra  | Docker Compose |


## Docker setup

### Prerequisites

| Tool | Minimum version | Notes |
|------|----------------|-------|
| **Docker Engine** | 23 | Bundled in Docker Desktop 4.x+. |
| **Docker Compose** | 2.20 | v2 plugin (`docker compose`, not `docker-compose`). Comes with Docker Desktop 4.x or via the `docker-compose-plugin` package on Linux. |

### Setup & start

```bash
# 1. Copy and fill in the environment file
cp .env.example .env
# If desired edit .env — set API_KEY, VITE_WS_API_KEY, but the defaults will work

# 2. Build and start both services
docker compose up --build
```

The client will be served at `http://localhost:3000` and the API at `http://localhost:4000/graphql`.

## Local development (no Docker)

- Local dev is offered for development because it's an improved experience with better fast reloads when files change

### Prerequisites

| Tool | Minimum version | Notes |
|------|----------------|-------|
| **Node.js** | 20.6 | Required for `node --env-file` support used in the `server` dev script. |
| **Yarn** | 1.22 (Classic) | Lockfiles are Yarn 1 format. |

> **Tip:** Use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) to manage Node versions.


### Setup & start

```bash
# 1. Copy and fill in the environment file
cp .env.example .env
# Edit .env — set API_KEY, VITE_WS_API_KEY, etc.

# 2. Start the server
cd server && yarn install && yarn dev

# 3. In a second terminal, start the client
cd client && yarn install && yarn dev
```

The client will be available at `http://localhost:3000` and the GraphQL API at `http://localhost:4000/graphql`.

---

## Project Structure

```
client/    # React 19 + Vite + Apollo Client + react-windows-ui
server/    # Apollo Server 4 + Express + TypeScript
```

---

## Features

### Appearance — colour themes & light/dark mode

The dashboard ships with **9 built-in colour themes** and full light/dark mode support, all user-configurable at runtime with no page reload required.

Click the palette icon (🎨) in the top-right header to open the Appearance panel:

| Theme | Character |
|-------|-----------|
| **Ocean** | Cool blue — the default |
| **Forest** | Fresh green |
| **Slate** | Muted blue-grey |
| **Crimson** | Bold red |
| **Gold** | Warm amber |
| **Amethyst** | Deep violet |
| **Steel** | Neutral navy-blue |
| **Copper** | Warm burnt-orange |

Each theme applies a coordinated colour palette across the entire UI — buttons, badges, charts, the hero sidebar gradient, and the dark-mode surface colours all update together. The **Light / Dark** toggle in the same panel switches the colour scheme independently of the chosen theme.

Your selection is saved to `localStorage` and restored automatically on the next visit — no account or server-side preference storage required.

---

### WebSocket status indicator

A **WS** indicator sits permanently in the top-right header so you always know the state of the real-time connection:

| Indicator | Meaning |
|-----------|---------|
| 🟢 Teal `WS` | WebSocket connected and live — metric updates are streaming |
| 🔴 Red `WS` (wifi-off icon) | WebSocket disconnected or errored — live updates paused |
| ⚫ Dimmed `WS` (wifi-off icon) | WebSocket inactive — you are not on a service detail page |

The indicator is only **active** (showing teal/red) on the `/service/:id` detail page, where a live subscription is actually open. On all other pages it shows as dimmed to make clear that no connection is open and no attempt is being made. The status reflects the raw WebSocket connection events in real time — it reacts instantly to a server restart or network drop without waiting for an Apollo query to timeout.

---

### Resilient offline mode — cached data and automatic retry

The dashboard behaves gracefully when the server is unreachable:

- **Cached data stays visible.** If you have already visited a page during the current session, Apollo's in-memory cache serves the last-known data immediately while the network request retries in the background. You see real content, not an empty screen.
- **Skeletons on a cold start.** If the cache is empty (fresh page load / browser refresh), skeleton placeholders fill the layout while retrying — the page structure is always intact.
- **Orange banner.** A full-width "Server offline — displaying cached data if available. Retrying in the background…" strip appears below the header as soon as the first network failure is detected, and disappears the moment the server responds.
- **Toast notification with spinner.** A persistent notification also appears in the corner, updating to "Reconnected" with a green flash once connectivity is restored.
- **Exponential back-off.** Retries happen at 1 s → 2 s → 4 s → 8 s → 15 s intervals (capped), so a slow or bouncing server isn't hammered.

---

### Deploy modal — guided semver version picker

Clicking **Deploy** on a service detail page opens a modal that calculates the next version number for you, reducing the chance of typos or version collisions.

**How it works:**

1. The modal reads the service's latest deployed version (e.g. `v2.4.1`).
2. A **Bump type** segmented control lets you choose:
   - **Patch** — bug fix, backwards compatible (e.g. `v2.4.1 → v2.4.2`)
   - **Minor** — new feature, backwards compatible (e.g. `v2.4.1 → v2.5.0`)
   - **Major** — breaking change (e.g. `v2.4.1 → v3.0.0`)
3. A **Beta release** checkbox appends a `-beta1` suffix to the result (e.g. `v2.5.0-beta1`). If the current version is already a beta (e.g. `v2.5.0-beta1`), the modal switches automatically to beta-continuation mode: checking "Beta release" increments the beta counter (`-beta2`, `-beta3`, …) and unchecking graduates it to the stable release (`v2.5.0`) — the bump-type selector is hidden since the base version is already fixed.
4. The calculated version is shown in an **editable text field** — all the auto-calculation is a starting point, not a constraint.

Bump-type descriptions are shown inline (e.g. *"New features — backwards compatible. e.g. v2.4.1 → v2.5.0"*) so users don't have to remember semver conventions.

#### Version collision guard

`triggerDeployment` enforces one narrow server-side rule: if a deployment for the **exact same version string** is already in `ROLLING_BACK` status for that service, the mutation is rejected with a `VERSION_COLLISION` GraphQL error — no duplicate record is created.

> **Important — this is intentionally narrow.** A *different* version can still be deployed to the same service while a rollback is in progress. The rule only prevents blindly re-queuing the specific version that is currently rolling back. Teams are expected to deploy a new/fixed version forward instead of retrying the broken one during a live rollback.

---

### Simulated deployment failure rates

To make the demo realistic, the server simulates real-world deployment risk when processing a `triggerDeployment` mutation:

| Version type | Failure rate |
|---|---|
| Stable release (e.g. `v2.5.0`) | **20%** |
| Beta release (e.g. `v2.5.0-beta1`) | **75%** |

The version string is inspected server-side (`/-beta\d*$/i` regex) to determine which rate applies. This reflects the reality that pre-release builds are inherently less stable. A failed deployment records `status: FAILED` in the deployment history and the result is surfaced via a toast notification triggered by the `deploymentSettled` WebSocket subscription — so even if you navigate away after triggering, you'll still be notified when it settles.

---

## Real-time Subscriptions

The server uses GraphQL subscriptions over WebSocket (`graphql-ws` protocol) for live updates — service health pings and deployment-settled events.

### WebSocket Authentication

The `metricUpdated` (and all) subscriptions are protected by an API key that is verified **once at connection establishment**, not per-message.

**How it works:**

1. The client sends a `connection_init` message containing `{ authorization: "Bearer <key>" }` as `connectionParams` — this is the standard `graphql-ws` handshake message, sent before any subscription can start.
2. The server's `onConnect` hook (in `server/src/ws.ts`) validates the key against the `API_KEY` environment variable. If the key is missing or wrong, `graphql-ws` closes the socket immediately with **4403 Forbidden** — no subscription data is ever emitted to that client.

**Setup:**

All variables live in a single `.env` file at the repo root (used by both the server and the Vite client build). Copy `.env.example` to `.env` and set `API_KEY` and `VITE_WS_API_KEY` to the same value. The file is gitignored — see `.env.example` for all required variables.

**Security limitation — key stored in the client bundle:**

The `VITE_WS_API_KEY` value is a Vite build-time variable, which means it is compiled into the JavaScript bundle that any user can download and inspect. This means the shared API key provides **transport-layer authentication only** (prevents random internet scanners connecting) but does **not** provide true user-level security.

In a production system this would be replaced with credential-backed token issuance:

1. User authenticates (e.g. via OAuth / your identity provider) and receives a short-lived JWT.
2. The JWT is passed in `connectionParams.authorization` instead of the static API key.
3. The server's `onConnect` verifies and decodes the JWT (signature, expiry, audience), so each WebSocket connection is tied to a specific authenticated user and their permissions.

This approach means there is no secret baked into the client bundle — the user's own credential grants access, and it expires automatically.

### PubSub scalability note

The current `PubSub` implementation (`graphql-subscriptions`) is **in-process only** — it uses a plain Node.js `EventEmitter` under the hood. This is fine for a single-process server (local dev, a single Docker container), but will silently break in a horizontally-scaled deployment: events published on instance A will never reach subscribers connected to instance B.

If the server is ever scaled to multiple instances, swap `PubSub` for a broker-backed implementation, for example:

| Package | Broker |
|---------|--------|
| `graphql-redis-subscriptions` | Redis Pub/Sub |
| `graphql-postgres-subscriptions` | PostgreSQL `LISTEN`/`NOTIFY` |
| A custom `AsyncIterator` over a message queue | RabbitMQ, Kafka, etc. |

No other subscription code needs to change — the resolver `subscribe` functions and client code are unaffected; only the `PubSub` instance in `server/src/pubsub.ts` is swapped out.

---

## Security Considerations

### What this prototype does, and why

| Control | Where | Rationale |
|---|---|---|
| **CORS restricted to a single origin** | `server/src/index.ts` | Only the known client origin can make cross-origin HTTP requests to the GraphQL endpoint. Blocks CSRF-style requests from arbitrary sites. |
| **`X-Content-Type-Options: nosniff`** | `server/src/index.ts` | Prevents browsers from MIME-sniffing responses away from the declared `Content-Type`, closing a class of content-injection attacks. |
| **`X-Frame-Options: DENY`** | `server/src/index.ts` | Prevents the app from being embedded in an `<iframe>`, blocking clickjacking attacks. |
| **GraphQL introspection disabled in production** | `server/src/index.ts` via `DISABLE_INTROSPECTION` env var | Introspection exposes the full schema to any caller. Disabling it removes a reconnaissance surface — attackers cannot enumerate types, fields, and mutations without prior knowledge. |
| **WebSocket API key in `connectionParams` verified in `onConnect`** | `server/src/ws.ts` | The key is checked once at the protocol handshake layer, before any subscription data flows. A missing or wrong key causes `graphql-ws` to close the socket with **4403 Forbidden** immediately. This blocks unauthenticated clients from receiving any real-time data. |
| **Secrets in environment variables, never in source** | `.env` (gitignored) | `API_KEY`, `CORS_ORIGIN`, etc. are injected at runtime via `.env` files that are explicitly gitignored. The `.env.example` files document the shape without containing real values. |
| **`withFilter` on `metricUpdated`** | `server/src/resolvers/resolvers.ts` | Subscribers only receive events for the `serviceId` they explicitly subscribed to. A connected client cannot observe metrics for services it did not request — enforced server-side, not by the client filtering after receipt. |

### The next three controls for production

**1. Supplement the shared API key with per-user short-lived JWTs**

The current `VITE_WS_API_KEY` is a build-time Vite variable, meaning it is compiled into the JavaScript bundle and is visible to anyone who downloads the client. It is a shared secret — if it leaks, all connections are compromised and the only remediation is rotating the key everywhere.

The fix: keep the shared key as a first filter, but also require a per-user credential. Integrate an identity provider (Auth0, Entra ID, Cognito, etc.). After the user logs in, the IdP issues a signed JWT with a short expiry (e.g. 15 minutes). The client passes that JWT in `connectionParams.authorization` alongside (or replacing) the static key. The server's `onConnect` hook verifies the JWT signature, checks the expiry, and inspects claims (e.g. role, tenant). No secret needs to be baked into the bundle; compromise of one token affects only that user session; tokens expire automatically.

**2. Add rate limiting at the HTTP and WebSocket layers**

Concrete implementation:
- Add `express-rate-limit` on the `/graphql` HTTP route (e.g. 100 requests per minute per IP).
- In `useServer`'s `onConnect`, track active connections per IP in a `Map` and reject connections beyond a threshold (e.g. 5 concurrent WS connections per IP).
- Add GraphQL query depth and complexity limits via `graphql-depth-limit` and `graphql-validation-complexity` to prevent deeply nested query abuse.

**3. Add field-level authorisation in resolvers (not just connection-level)**

The current auth gate is binary — you either have a valid WS connection or you don't. Once connected, a client can subscribe to `metricUpdated` for _any_ `serviceId` if it constructs the message by hand (the `withFilter` only filters delivery; it does not refuse the subscription).

The fix: in the `subscribe` function of each resolver, check the caller's identity (available via `context`, which is populated from `onConnect`'s return value) against the resource being requested. For example, a service-scoped role check:

```ts
subscribe: withFilter(
  (_, args, context) => {
    if (!context.user?.canAccessService(args.serviceId)) throw new GraphQLError('Forbidden', { extensions: { code: 'FORBIDDEN' } });
    return pubsub.asyncIterableIterator(EVENTS.METRIC_UPDATED);
  },
  ...
)
```

This enforces authorisation at the data layer — even a valid authenticated user cannot receive data for a resource they do not have permission to access.


