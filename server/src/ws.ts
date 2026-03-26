import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import type { Server } from 'http';
import { schema } from './schema/executable.js';
import { validateWsApiKey } from './utils/apiKeyAuth.js';

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
