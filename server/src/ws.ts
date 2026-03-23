import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { Server } from 'http';
import { allTypeDefs } from './schema/index.js';
import { resolvers } from './resolvers/resolvers.js';

export const schema = makeExecutableSchema({ typeDefs: allTypeDefs, resolvers });

export function attachWsServer(httpServer: Server): void {
  const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql/ws' });
  useServer({ schema }, wsServer);
}
