import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

export const EVENTS = {
  METRIC_UPDATED: 'SERVICE_METRIC_UPDATED',
  DEPLOYMENT_SETTLED: 'DEPLOYMENT_SETTLED',
} as const;
