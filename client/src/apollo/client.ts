import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

const httpUri = import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:4000/graphql';
const wsUri = import.meta.env.VITE_WS_URL ?? 'ws://localhost:4000/graphql/ws';

const httpLink = new HttpLink({ uri: httpUri });

export const wsClient = createClient({
  url: wsUri,
  retryAttempts: Infinity,
  shouldRetry: () => true, // retry on both clean and abnormal closes (e.g. server restart)
});

const wsLink = new GraphQLWsLink(wsClient);

const splitLink = ApolloLink.split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
