import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { offlineRetryLink } from './offlineRetryLink';

const httpUri = import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:4000/graphql';
const wsUri = import.meta.env.VITE_WS_URL ?? 'ws://localhost:4000/graphql/ws';

const apiKey = import.meta.env.VITE_API_KEY as string | undefined;

const httpLink = new HttpLink({
  uri: httpUri,
  headers: apiKey ? { 'x-api-key': apiKey } : {},
});

// Create the graphql websocket client
export const wsClient = createClient({
  url: wsUri,
  retryAttempts: Infinity,
  shouldRetry: () => true, // retry on both clean and abnormal closes (e.g. server restart)
  // Sent once in the graphql-ws connection_init message — checked by onConnect on the server.
  connectionParams: apiKey ? { authorization: `Bearer ${apiKey}` } : undefined,
});

const wsLink = new GraphQLWsLink(wsClient);

const splitLink = ApolloLink.split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  // Retry link wraps httpLink: swallows network errors, shows a toast, and
  // retries with back-off. Subscriptions have their own reconnect via graphql-ws.
  offlineRetryLink.concat(httpLink),
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  // cache-and-network: serve cached data immediately AND fire a background
  // network request. This ensures offlineRetryLink is triggered even when the
  // cache is warm, so we can detect a server outage while showing cached pages.
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
  },
});
