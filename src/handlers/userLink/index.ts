import { mutationTypeDefs, mutations } from '../../handlers/userLink/mutations.js';
import { queryTypeDefs, queries } from '../../handlers/userLink/queries.js';
import { types } from '../../handlers/userLink/gql-types.js';

const typeDefs = [queryTypeDefs, mutationTypeDefs, types];

export { queries, mutations, typeDefs };
