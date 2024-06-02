import gql from 'graphql-tag';

import { QueryResolvers, ReturnStatus } from '../../generated/resolvers-types.js';
import { dateToEpochTimestamp } from '../../utils/dateToEpochTimestamp.js';
import { internalErrorMap } from '../../constants/errorMaps/internalErrorMap.js';

const queries: QueryResolvers = {
  getUserLinks: async (_, {}, { prisma, userId }) => {
    // Check if user is authorized
    if (!userId) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['auth/unauthenticated'],
      };
    }

    // Get links associated to user
    const userLinks = await prisma.userLink.findMany({
      where: {
        userId,
        isDeleted: false,
      },
    });

    // Return not fetched error if user link not fetched
    if (!userLinks) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['userLink/failFetched'],
      };
    }

    // Return links if user links fetched
    return {
      status: ReturnStatus.Success,
      data: userLinks.map((userLink) => {
        return {
          ...userLink,
          createdAt: dateToEpochTimestamp(userLink.createdAt),
          updatedAt: dateToEpochTimestamp(userLink.updatedAt),
        };
      }),
    };
  },

  getUserLink: async (_, { linkId }, { prisma, userId }) => {
    // Check if user is authorized
    if (!userId) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['auth/unauthenticated'],
      };
    }

    // Search for user link
    const userLink = await prisma.userLink.findFirst({
      where: {
        id: linkId,
        isDeleted: false,
      },
    });

    // If user link not fetched return not fetched error
    if (!userLink) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['userLink/failFetched'],
      };
    }

    // return link if link fetched
    return {
      status: ReturnStatus.Success,
      data: {
        ...userLink,
        createdAt: dateToEpochTimestamp(userLink.createdAt),
        updatedAt: dateToEpochTimestamp(userLink.updatedAt),
      },
    };
  },
};

const queryTypeDefs = gql`
  extend type Query {
    getUserLinks: StatusDataErrorUserLinks!
    getUserLink(linkId: String!): StatusDataErrorUserLink!
  }
`;

export { queries, queryTypeDefs };
