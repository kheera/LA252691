import { ApolloServer } from '@apollo/server';
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

async function startServer(): Promise<void> {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  app.use(express.json());

  // add hello world route
  app.get('/hello', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(4000, () => {
    console.log('Server ready at http://localhost:4000/graphql');
  });
}

startServer();
