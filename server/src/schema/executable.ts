import { makeExecutableSchema } from '@graphql-tools/schema';
import { allTypeDefs } from './index.js';
import { resolvers } from '../resolvers/resolvers.js';

export const schema = makeExecutableSchema({ typeDefs: allTypeDefs, resolvers });
