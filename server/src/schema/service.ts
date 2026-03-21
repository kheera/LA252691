export const serviceTypeDefs = `#graphql
  type Service {
    id: ID!
    status: 'HEALTHY' | 'DEGRADED' | 'DOWN' # (nullable, default health status doesn't make sense)
    uptime: Float # percentage with one decimal point (nullable, may not yet be deployed)
    lastDeployedAt: String # ISO 8601 timestamp (nullable, may not yet be deployed)
    healthTrend: String # @todo Not yet sure what this will be
    deployments: [Deployment!]!
  }
`;
