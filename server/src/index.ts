import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import express from 'express';
import cors from 'cors';
import { typeDefs } from './schema/types.js';
import { queryDefs } from './schema/query.js';
import { mutationDefs } from './schema/mutations.js';
import { resolvers } from './resolvers/resolvers.js';
import { createContext } from './context.js';

const app = express();
const server = new ApolloServer({ typeDefs: [typeDefs, queryDefs, mutationDefs], resolvers });

await server.start();

app.use(cors());
app.use(express.json());
app.use('/graphql', expressMiddleware(server, { context: async () => createContext() }));

app.listen(4000, () => {
  console.log('Server ready at http://localhost:4000/graphql');
});
