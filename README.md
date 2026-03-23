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

### PubSub scalability note

The current `PubSub` implementation (`graphql-subscriptions`) is **in-process only** — it uses a plain Node.js `EventEmitter` under the hood. This is fine for a single-process server (local dev, a single Docker container), but will silently break in a horizontally-scaled deployment: events published on instance A will never reach subscribers connected to instance B.

If the server is ever scaled to multiple instances, swap `PubSub` for a broker-backed implementation, for example:

| Package | Broker |
|---------|--------|
| `graphql-redis-subscriptions` | Redis Pub/Sub |
| `graphql-postgres-subscriptions` | PostgreSQL `LISTEN`/`NOTIFY` |
| A custom `AsyncIterator` over a message queue | RabbitMQ, Kafka, etc. |

No other subscription code needs to change — the resolver `subscribe` functions and client code are unaffected; only the `PubSub` instance in `server/src/pubsub.ts` is swapped out.

