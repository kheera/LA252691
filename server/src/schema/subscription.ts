export const subscriptionDefs = `#graphql
  type Subscription {
    metricUpdated(serviceId: ID!): Metric!
    deploymentSettled: Deployment!
  }
`;
