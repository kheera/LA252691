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

