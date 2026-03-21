// this might need some work still
export const metricTypeDefs = `#graphql
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
