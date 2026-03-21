export const deploymentTypeDefs = `#graphql
  type Deployment {
    id: ID!
    serviceId: ID!
    version: String!
    deployedBy: String!
    timestamp: String!
    status: 'SUCCESS' | 'FAILED' | 'ROLLING_BACK'
    durationSeconds: Int!
  }
`;
