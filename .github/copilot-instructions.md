# Copilot Instructions — LA252691

## Project Overview

Full-stack application with a GraphQL API backend and a frontend client, orchestrated via Docker Compose.

```
client/          # Frontend — React 19, Vite, Apollo Client, Mantine
server/          # Node.js / Apollo Server 4 / TypeScript / Express
docker-compose.yml
```

## Tech Stack

| Layer      | Technology                                      |
|------------|------------------------------------------------|
| Server     | Node.js, TypeScript, Apollo Server 5, Express 5 |
| GraphQL    | `@apollo/server`, `graphql`                    |
| Linting    | ESLint + Airbnb base config + TypeScript        |
| Infra      | Docker Compose                                  |
| Client     | React 19, TypeScript, Vite, Apollo Client       |
| UI         | Mantine v8 (`@mantine/core`, `@mantine/hooks`, `@mantine/charts`, `@mantine/notifications`) |

## Build & Run

```bash
# Server
cd server && yarn install && yarn build && yarn start

# Client
cd client && yarn install && yarn dev

# Dev mode (server)
cd server && yarn dev

# Docker
docker compose up --build
```

## Conventions

### TypeScript
- Strict mode enabled (`"strict": true` in tsconfig)
- Prefer interfaces over type aliases for object shapes
- Use named exports; avoid default exports

### GraphQL
- Schema-first approach preferred
- Resolvers in `server/src/resolvers/`
- Type definitions in `server/src/schema/`
- Client queries/mutations in `client/src/graphql/`

### UI / Theming
- Wrap the app in `<MantineProvider>` from `@mantine/core` at the root
- Use Mantine components for all UI; avoid mixing in other component libraries
- Use `@mantine/notifications` `<Notifications />` alongside `MantineProvider` for toasts
- Import Mantine CSS in `main.tsx`: `import '@mantine/core/styles.css'`
- Use `@mantine/charts` + `recharts` for metric visualisations
- Use `@tabler/icons-react` for icons
- Light/dark mode via `colorScheme` on `MantineProvider` or `useComputedColorScheme` hook

### Linting
- ESLint with `airbnb-base` + `airbnb-typescript/base`
- Parser: `@typescript-eslint/parser` with `parserOptions.project`
- Run `yarn lint` before committing

### Project Structure (server)

```
server/
├── src/
│   ├── index.ts          # Entry point — Apollo + Express setup
│   ├── schema/           # GraphQL type definitions
│   ├── resolvers/        # GraphQL resolvers
│   ├── models/           # Data models / types
│   └── utils/            # Shared utilities
├── tsconfig.json
├── .eslintrc.json
├── package.json
├── yarn.lock
└── Dockerfile
```

### Project Structure (client)

```
client/
├── src/
│   ├── main.tsx          # Entry point — AppProvider + ApolloProvider + Router
│   ├── App.tsx
│   ├── components/       # Shared UI components
│   ├── pages/            # Route-level page components
│   ├── graphql/          # Apollo queries, mutations, fragments
│   └── types/            # Shared TypeScript types
├── tsconfig.json
├── vite.config.ts
├── .eslintrc.json
├── package.json
├── yarn.lock
└── Dockerfile
```

## Key Packages (server)

### Runtime
- `@apollo/server` — Apollo Server 4
- `graphql` — GraphQL reference implementation
- `express` — HTTP framework
- `cors` — CORS middleware

### Dev
- `typescript`, `ts-node`, `nodemon`
- `eslint`, `eslint-config-airbnb-base`, `eslint-config-airbnb-typescript`
- `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`
- `eslint-plugin-import`
- `@types/node`, `@types/express`, `@types/cors`

## Key Packages (client)

### Runtime
- `react`, `react-dom` — React 19
- `@apollo/client` — Apollo Client 4
- `graphql` — GraphQL peer dependency
- `@mantine/core` — Mantine v8 UI components
- `@mantine/hooks` — Mantine utility hooks
- `@mantine/charts` — Chart components (wraps recharts)
- `@mantine/notifications` — Toast/notification system
- `recharts` — peer dep for `@mantine/charts`
- `@tabler/icons-react` — icon set

### Dev
- `vite`, `@vitejs/plugin-react`
- `typescript`
- `eslint`, `eslint-config-airbnb`, `eslint-config-airbnb-typescript`
- `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`
- `eslint-plugin-import`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`

## Pitfalls

- Apollo Server 5 uses `expressMiddleware()` from `@apollo/server/express4` — **not** `applyMiddleware()` (that was v3).
- `eslint-config-airbnb-typescript` requires `parserOptions.project` pointing to `tsconfig.json`.
- When adding new GraphQL types, always add both the schema definition AND the resolver.
- Wrap the React app with `<MantineProvider>` outermost, then `<ApolloProvider>` inside it in `main.tsx`.
- Mantine requires its CSS to be imported before any component usage: `import '@mantine/core/styles.css'` in `main.tsx`.
- `postcss.config.cjs` is required at the client root with `postcss-preset-mantine` for Mantine's PostCSS features.
