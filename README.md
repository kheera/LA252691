# LA252691

Full-stack application with a GraphQL API and a React frontend, orchestrated via Docker Compose.

## Stack

| Layer  | Technology |
|--------|-----------|
| Server | Node.js, TypeScript, Apollo Server 4, Express |
| Client | React 19, TypeScript, Vite, Apollo Client |
| UI     | react-windows-ui (Windows 11 components + theming) |
| Infra  | Docker Compose |

## Quick Start

```bash
# Server
cd server && yarn install && yarn dev

# Client
cd client && yarn install && yarn dev

# Both via Docker
docker compose up --build
```

## Project Structure

```
client/    # React 19 + Vite + Apollo Client + react-windows-ui
server/    # Apollo Server 4 + Express + TypeScript
```

See [.github/copilot-instructions.md](.github/copilot-instructions.md) for full conventions and architecture details.

## Real-time Subscriptions

The server uses GraphQL subscriptions over WebSocket (`graphql-ws` protocol) for live updates — service health pings and deployment-settled events. See [SUBSCRIPTIONS_PLAN.md](SUBSCRIPTIONS_PLAN.md) for the full implementation plan.

### WebSocket Authentication

The `metricUpdated` (and all) subscriptions are protected by an API key that is verified **once at connection establishment**, not per-message.

**How it works:**

1. The client sends a `connection_init` message containing `{ authorization: "Bearer <key>" }` as `connectionParams` — this is the standard `graphql-ws` handshake message, sent before any subscription can start.
2. The server's `onConnect` hook (in `server/src/ws.ts`) validates the key against the `API_KEY` environment variable. If the key is missing or wrong, `graphql-ws` closes the socket immediately with **4403 Forbidden** — no subscription data is ever emitted to that client.

**Setup:**

```bash
# server/.env  (or root .env for Docker Compose)
API_KEY=your-secret-key

# client/.env
VITE_WS_API_KEY=your-secret-key
```

Both files are gitignored. See `.env.example` and `client/.env.example` for all required variables.

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

**1. Replace the shared API key with per-user short-lived JWTs**

The current `VITE_WS_API_KEY` is a build-time Vite variable, meaning it is compiled into the JavaScript bundle and is visible to anyone who downloads the client. It is a shared secret — if it leaks, all connections are compromised and the only remediation is rotating the key everywhere.

The fix: integrate an identity provider (Auth0, Entra ID, Cognito, etc.). After the user logs in, the IdP issues a signed JWT with a short expiry (e.g. 15 minutes). The client passes that JWT in `connectionParams.authorization`. The server's `onConnect` hook verifies the JWT signature, checks the expiry, and inspects claims (e.g. role, tenant). No secret lives in the bundle; compromise of one token affects only that user session; tokens expire automatically.

**2. Add rate limiting at the HTTP and WebSocket layers**

Currently there is no limit on how many requests a single IP can make. A malicious caller could flood the GraphQL endpoint with expensive queries (e.g. deeply nested selections) or open thousands of WebSocket connections to exhaust server memory.

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


