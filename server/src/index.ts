import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import express from 'express';
import cors from 'cors';

const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello from Apollo Server!',
  },
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

await server.start();

app.use(cors());
app.use(express.json());
app.use('/graphql', expressMiddleware(server));

app.listen(4000, () => {
  console.log('Server ready at http://localhost:4000/graphql');
});
