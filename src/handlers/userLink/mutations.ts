import gql from 'graphql-tag';

import { MutationResolvers, ReturnStatus } from '../../generated/resolvers-types.js';
import { internalErrorMap } from '../../constants/errorMaps/internalErrorMap.js';
import { JOIcreateUserLinkSchema, JOIUpdateUserLinkSchema } from '../../joi_schemas/userLinkJOISchemas.js';
import { internalSuccessMap } from '../../constants/errorMaps/internalSuccessMap.js';

const mutations: MutationResolvers = {
  createLink: async (_, { details }, { prisma, userId }) => {
    try {
      await JOIcreateUserLinkSchema.validateAsync(details);

      // Check if user is authorized
      if (!userId) {
        return {
          status: ReturnStatus.Error,
          error: internalErrorMap['auth/unauthenticated'],
        };
      }

      // If authorized, create user link
      const userLink = await prisma.userLink.create({
        data: {
          userId: userId,
          firstName: details.firstName,
          lastName: details.lastName,
          email: details.email,
          facebookURL: details.facebookURL,
          instagramURL: details.instagramURL,
          twitterURL: details.twitterURL,
          linkedInURL: details.linkedInURL,
          websiteURL: details.websiteURL,
          phoneURL: details.phoneURL,
        },
      });

      // If link not created return failed to create link  error
      if (!userLink) {
        return {
          status: ReturnStatus.Error,
          error: internalErrorMap['userLink/failCreate'],
        };
      }

      // If link created return successs message
      return {
        status: ReturnStatus.Success,
        data: internalSuccessMap['userLink/successCreate'],
      };
    } catch (validationError) {
      if (validationError instanceof Error) {
        return {
          status: ReturnStatus.Error,
          error: validationError.message,
        };
      }

      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['server/failComplete'],
      };
    }
  },

  deleteLink: async (_, { linkId }, { prisma, userId }) => {
    // Check if user is authorized
    if (!userId) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['auth/unauthenticated'],
      };
    }

    // Find link to delete
    const findLink = await prisma.userLink.findFirst({
      where: {
        id: linkId,
        isDeleted: false,
      },
    });

    // If link not found return link not deleted error
    if (!findLink) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['userLink/alreadyDeleted'],
      };
    }

    // Add delete flag
    const delLink = await prisma.userLink.update({
      where: {
        id: linkId,
        isDeleted: false,
      },

      data: {
        isDeleted: true,
      },
    });

    // If link not deleted return link not deleted error
    if (!delLink) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['userLink/alreadyDeleted'],
      };
    }

    // Else return success message
    return {
      status: ReturnStatus.Success,
      data: internalSuccessMap['userLink/successDelete'],
    };
  },

  updateLink: async (_, { linkId, details }, { prisma, userId }) => {
    try {
      await JOIUpdateUserLinkSchema.validateAsync(details);

      // Check if user is authorized
      if (!userId) {
        return {
          status: ReturnStatus.Error,
          error: internalErrorMap['auth/unauthenticated'],
        };
      }

      // Find link to update
      const findLink = await prisma.userLink.findFirst({
        where: {
          id: linkId,
          isDeleted: false,
        },
      });

      // If link not found return failed to update error
      if (!findLink) {
        return {
          status: ReturnStatus.Error,
          error: internalErrorMap['userLink/failUpdate'],
        };
      }

      const updateLink = await prisma.userLink.update({
        where: {
          id: linkId,
        },
        data: {
          firstName: details.firstName || undefined,
          lastName: details.lastName || undefined,
          email: details.email || undefined,
          facebookURL: details.facebookURL || undefined,
          instagramURL: details.instagramURL || undefined,
          twitterURL: details.twitterURL || undefined,
          linkedInURL: details.linkedInURL || undefined,
          websiteURL: details.websiteURL || undefined,
          phoneURL: details.phoneURL || undefined,
        },
      });

      // If link failed to update
      if (!updateLink) {
        return {
          status: ReturnStatus.Error,
          error: internalErrorMap['userLink/failUpdate'],
        };
      }

      // Else return success message
      return {
        status: ReturnStatus.Success,
        data: internalSuccessMap['userLink/successUpdate'],
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          status: ReturnStatus.Error,
          error: error.message,
        };
      }

      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['server/failComplete'],
      };
    }
  },
};

const mutationTypeDefs = gql`
  extend type Mutation {
    createLink(details: UserLinkCreateInput!): StatusDataErrorString!
    deleteLink(linkId: String!): StatusDataErrorString!
    updateLink(linkId: String!, details: UserLinkUpdateInput!): StatusDataErrorString!
  }
`;

export { mutations, mutationTypeDefs };
