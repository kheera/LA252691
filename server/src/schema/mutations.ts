export const mutationDefs = `#graphql
  type Mutation {
    triggerDeployment(serviceId: ID!, version: String!): Deployment
    acknowledgeOutage(serviceId: ID!): Service
  }
`;
