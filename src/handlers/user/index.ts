import { mutationTypeDefs, mutations } from '../../handlers/user/mutations.js';
import { queryTypeDefs, queries } from '../../handlers/user/queries.js';
import { types } from '../../handlers/user/gql-types.js';

const typeDefs = [queryTypeDefs, mutationTypeDefs, types];

export { queries, mutations, typeDefs };
