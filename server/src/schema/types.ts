export const typeDefs = `#graphql
  enum ServiceStatus {
    HEALTHY
    DEGRADED
    DOWN
  }

  enum DeploymentStatus {
    PENDING
    SUCCESS
    FAILED
    ROLLING_BACK
  }

  type Service {
    id: ID!
    name: String!
    status: ServiceStatus # nullable: HEALTHY | DEGRADED | DOWN
    uptime: Float # percentage with one decimal point (nullable, may not yet be deployed)
    lastDeployedAt: String # ISO 8601 timestamp (nullable, may not yet be deployed)
    healthTrend: String # @todo Not yet sure what this will be
    deployments(last: Int): [Deployment!]!
    metrics(last: Int): [Metric!]!
  }

  type Deployment {
    id: ID!
    serviceId: ID!
    version: String!
    deployedBy: String!
    timestamp: String!
    status: DeploymentStatus
    durationSeconds: Int!
  }

  type Metric {
    serviceId: ID!
    timestamp: String!
    cpuPercent: Float!
    memoryMb: Float!
    requestsPerSecond: Float!
    errorRate: Float!
  }
`;
