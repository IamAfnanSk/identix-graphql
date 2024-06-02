import gql from 'graphql-tag';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { Resolvers } from '../generated/resolvers-types.js';
import { types as commonTypeDefs } from '../handlers/gql-types.js';
import {
  queries as userQueries,
  mutations as userMutations,
  typeDefs as userTypeDefs,
} from '../handlers/user/index.js';
import {
  queries as userLinkQueries,
  mutations as userLinkMutations,
  typeDefs as useLirnkTypeDefs,
} from '../handlers/userLink/index.js';

const resolvers: Resolvers = {
  Query: {
    ...userQueries,
    ...userLinkQueries,
  },
  Mutation: {
    ...userMutations,
    ...userLinkMutations,
  },
};

const rootMutationAndQuery = gql`
  type Mutation {
    _empty_mutation: String
  }

  type Query {
    _empty_query: String
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [rootMutationAndQuery, commonTypeDefs, ...userTypeDefs, ...useLirnkTypeDefs],
  resolvers,
});

export { schema };
