import { typeDefs } from './types.js';
import { queryDefs } from './query.js';
import { mutationDefs } from './mutations.js';

// Add new schema files here — index.ts never needs to change
export const allTypeDefs = [typeDefs, queryDefs, mutationDefs];
