export const typeDefs = `#graphql
  type Service {
    id: ID!
    status: String # nullable: HEALTHY | DEGRADED | DOWN
    uptime: Float # percentage with one decimal point (nullable, may not yet be deployed)
    lastDeployedAt: String # ISO 8601 timestamp (nullable, may not yet be deployed)
    healthTrend: String # @todo Not yet sure what this will be
    deployments: [Deployment!]!
  }

  type Deployment {
    id: ID!
    serviceId: ID!
    version: String!
    deployedBy: String!
    timestamp: String!
    status: String # SUCCESS | FAILED | ROLLING_BACK
    durationSeconds: Int!
  }

  # @todo may need further work
  type Metric {
    id: ID!
    timestamp: String!
    createdAt: String! # alias for timestamp
    cpuPercent: Float
    memoryMb: Float
    requestsPerSecond: Float
    errorRate: Float
  }
`;
