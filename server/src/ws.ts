import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { Server } from 'http';
import { allTypeDefs } from './schema/index.js';
import { resolvers } from './resolvers/resolvers.js';
import { validateWsApiKey } from './utils/apiKeyAuth.js';

export const schema = makeExecutableSchema({ typeDefs: allTypeDefs, resolvers });

export function attachWsServer(httpServer: Server): void {
  const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql/ws' });

  useServer({
    schema,
    onConnect: (ctx) => {
      const params = ctx.connectionParams as Record<string, unknown> | undefined;
      // validateWsApiKey logs the attempt (service name, timestamp, present/incorrect)
      // and returns false to close the socket with 4403 on failure.
      return validateWsApiKey(params);
    },
  }, wsServer);
}
