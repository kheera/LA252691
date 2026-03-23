export const subscriptionDefs = `#graphql
  type Subscription {
    metricUpdated: ServiceMetricUpdate!
    deploymentSettled: Deployment!
  }

  type ServiceMetricUpdate {
    serviceId: ID!
    status: String!
    uptime: Float
    timestamp: String!
  }
`;
