export const queryDefs = `#graphql
  type Query {
    services: [Service!]!
    service(id: ID!): Service
    deployments(serviceId: ID!, status: String, limit: Int): [Deployment!]!
    metrics(serviceId: ID!, last: Int): [Metric!]!
  }
`;
