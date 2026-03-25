import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { schema, attachWsServer } from './ws.js';
import { createContext } from './context.js';
import { startMetricTicker } from './metricTicker.js';

const PORT = parseInt(process.env.PORT ?? '4000', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
const DISABLE_INTROSPECTION = process.env.DISABLE_INTROSPECTION !== 'false';

const app = express();
const server = new ApolloServer({ schema, introspection: !DISABLE_INTROSPECTION });

await server.start();

// Security headers on every response
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use('/graphql', expressMiddleware(server, { context: async () => createContext() }));

const httpServer = createServer(app);
attachWsServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}/graphql`);
  console.log(`WebSocket ready at ws://localhost:${PORT}/graphql/ws`);
  console.log(`Introspection: ${DISABLE_INTROSPECTION ? 'disabled' : 'enabled'}`);
});

startMetricTicker();
