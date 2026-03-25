export const subscriptionDefs = `#graphql
  type Subscription {
    metricUpdated(serviceId: ID!): ServiceMetricUpdate!
    deploymentSettled: Deployment!
  }

  type ServiceMetricUpdate {
    id: ID!
    serviceId: ID!
    timestamp: String!
    cpuPercent: Float
    memoryMb: Float
    requestsPerSecond: Float
    errorRate: Float
  }
`;
