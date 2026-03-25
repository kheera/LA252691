import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { Server } from 'http';
import { allTypeDefs } from './schema/index.js';
import { resolvers } from './resolvers/resolvers.js';

export const schema = makeExecutableSchema({ typeDefs: allTypeDefs, resolvers });

export function attachWsServer(httpServer: Server): void {
  const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql/ws' });

  // API key is required at connection establishment — checked once in onConnect,
  // before any subscription data is emitted. A missing or invalid key causes
  // graphql-ws to close the socket with 4403 Forbidden.
  const API_KEY = process.env.API_KEY;

  useServer({
    schema,
    onConnect: (ctx) => {
      const params = ctx.connectionParams as Record<string, unknown> | undefined;
      const provided = params?.authorization;

      if (!API_KEY || provided !== `Bearer ${API_KEY}`) {
        console.warn('[ws] rejected unauthenticated connection');
        return false; // graphql-ws closes with 4403
      }

      return true;
    },
  }, wsServer);
}
