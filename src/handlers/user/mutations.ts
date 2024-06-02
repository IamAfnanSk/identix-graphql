import gql from 'graphql-tag';
import bcrypt from 'bcrypt';
import { SendTemplatedEmailRequest } from '@aws-sdk/client-ses';

import { MutationResolvers, ReturnStatus } from '../../generated/resolvers-types.js';
import { internalErrorMap } from '../../constants/errorMaps/internalErrorMap.js';
import { JOIcreateUserSchema, JOIrequestPasswordResetSchema } from '../../joi_schemas/userJOISchemas.js';
import { checkPasswordResetSecret, getPasswordResetSecret } from '../../utils/getPasswordResetSecret.js';
import { getDecodedJWT } from '../../utils/getDecodedJWT.js';
import {
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_COOKIE_EXPIRES_IN,
  JWT_REFRESH_SECRET_KEY,
  SES_SENDERS_EMAIL_ADDRESS,
} from '../../constants/global.js';
import { SES_CLIENT } from '../../constants/sesClient.js';
import { internalSuccessMap } from '../../constants/errorMaps/internalSuccessMap.js';
import { isJWTTokenBlackListed, setJWTTokenBlackListed } from '../../utils/isJWTTokenBlackListed.js';
import { signJWTToken } from '../../utils/signJWTToken.js';

const mutations: MutationResolvers = {
  register: async (_, { details }, { prisma }) => {
    try {
      await JOIcreateUserSchema.validateAsync(details);

      // Check if user already exists
      const findUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: details.email }, { username: { equals: details.username, not: null } }],
          isDeleted: false,
        },
      });

      // If user is found and input email or username and found email or username is same return email exist error
      if (findUser !== null) {
        if (findUser.email === details.email) {
          return {
            status: ReturnStatus.Error,
            error: internalErrorMap['user/emailAlreadyExists'],
          };
        } else if (findUser.username === details.username) {
          return {
            status: ReturnStatus.Error,
            error: internalErrorMap['user/usernameAlreadyExists'],
          };
        }
      }

      // Create a hashed password if new user
      const hashedPwd = await bcrypt.hash(details.password, 12);

      // Save user to database
      const user = await prisma.user.create({
        data: {
          email: details.email,
          password: hashedPwd,
          username: details.username,
          firstName: details.firstName,
          lastName: details.lastName,
        },
      });

      // If user not saved return fail to create error
      if (!user) {
        return {
          status: ReturnStatus.Error,
          error: internalErrorMap['user/failRegister'],
        };
      }

      // Return Success message if user registered
      return {
        status: ReturnStatus.Success,
        data: internalSuccessMap['user/successRegister'],
      };
    } catch (validationError) {
      // Handle validation errors
      if (validationError instanceof Error) {
        return {
          status: ReturnStatus.Error,
          error: validationError.message,
        };
      }
      // Handle other errors
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['server/failComplete'],
      };
    }
  },

  deleteUser: async (_, {}, { prisma, userId }) => {
    // Check if user is authenticated
    if (!userId) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['auth/unauthenticated'],
      };
    }

    // Delete user and his links
    const deleteLinks = prisma.userLink.updateMany({
      where: {
        userId,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
      },
    });

    const deleteUser = prisma.user.update({
      where: {
        id: userId,
        isDeleted: false,
      },

      data: {
        isDeleted: true,
      },
    });

    const transaction = await prisma.$transaction([deleteLinks, deleteUser]);

    // Check if everything is deleted
    if (!transaction) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/failDelete'],
      };
    }

    // Return success message
    return {
      status: ReturnStatus.Success,
      data: internalSuccessMap['user/successDelete'],
    };
  },

  requestPasswordReset: async (_, { details }, { prisma }) => {
    try {
      await JOIrequestPasswordResetSchema.validateAsync(details);

      // Search user with email in db
      const foundUser = await prisma.user.findFirst({
        where: {
          email: details.email,
          isDeleted: false,
        },
      });

      // If user not found return error
      if (!foundUser) {
        return {
          status: ReturnStatus.Error,
          error: internalErrorMap['user/notFound'],
        };
      }

      // If user found generate token
      const passwordResetSecret = await getPasswordResetSecret(foundUser);

      const resetToken = signJWTToken('email', foundUser.id, foundUser.email, passwordResetSecret);

      // // Send email to user
      const UserResetEmailParams: SendTemplatedEmailRequest = {
        Source: SES_SENDERS_EMAIL_ADDRESS,
        Destination: {
          ToAddresses: [foundUser.email],
        },
        Template: 'ResetPasswordTemplate',
        TemplateData: JSON.stringify({ username: foundUser.username, token: resetToken }),
      };

      const sent = SES_CLIENT.sendTemplatedEmail(UserResetEmailParams);

      // Return error if failed to sent email
      if (sent instanceof Error) {
        return {
          status: ReturnStatus.Error,
          error: internalErrorMap['server/failComplete'],
        };
      }

      // Return success message
      return {
        status: ReturnStatus.Success,
        data: internalSuccessMap['user/successPasswordResetRequest'],
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

  resetPassword: async (_, { details }, { prisma }) => {
    // Verify jwt token with secret
    const decodedJWT = getDecodedJWT(details.token, JWT_ACCESS_SECRET_KEY) || null;

    // If not verified return error
    if (!decodedJWT) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/failPasswordReset'],
      };
    }

    // Search user with email in db
    const foundUser = await prisma.user.findFirst({
      where: {
        id: decodedJWT.id,
      },
    });

    // If user not found return error
    if (!foundUser) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/notFound'],
      };
    }

    const isValidToken = await checkPasswordResetSecret(foundUser, decodedJWT.passwordResetSecret || '');

    if (!isValidToken) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/failPasswordReset'],
      };
    }

    const isOldPassowrd = await bcrypt.compare(details.password, foundUser.password);

    if (isOldPassowrd) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['auth/samePassword'],
      };
    }

    // If verified, hash the passsword and store new password in database
    const newPassword = await bcrypt.hash(details.password, 12);

    const updatePassword = await prisma.user.update({
      where: {
        id: decodedJWT.id,
      },
      data: {
        password: newPassword,
      },
    });

    // If new password not saved, return error
    if (!updatePassword) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['server/failComplete'],
      };
    }

    // Return success message
    return {
      status: ReturnStatus.Success,
      data: internalSuccessMap['user/successPasswordReset'],
    };
  },

  refreshAuthToken: async (_, __, { req, res }) => {
    const refreshToken: string = req?.cookies.refreshToken;
    if (!refreshToken) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['auth/unauthenticated'],
      };
    }

    // Verify refresh token
    const decodedJWT = getDecodedJWT(refreshToken, JWT_REFRESH_SECRET_KEY) || null;

    // If not verified return error
    if (!decodedJWT) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/invalidToken'],
      };
    }

    // Check if token is blacklisted
    const isBlackListed = await isJWTTokenBlackListed(decodedJWT.JWTAuthSecret || '');

    // If token is blacklisted return error
    if (isBlackListed) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/invalidToken'],
      };
    }

    // If token is not blacklisted return new access and refresh token
    const newAccessToken = signJWTToken('access', decodedJWT.id);
    const newRefreshToken = signJWTToken('refresh', decodedJWT.id);

    if (!newAccessToken || !newRefreshToken) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['server/failComplete'],
      };
    }

    // Blacklist the previous used refresh token
    const setTokenBlackListed = await setJWTTokenBlackListed(decodedJWT.JWTAuthSecret || '');
    if (!setTokenBlackListed) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['server/failComplete'],
      };
    }

    // Return refresh token in a cookie
    res?.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true, //process.env.NODE_ENV === 'production', // set true at time of production
      maxAge: JWT_REFRESH_COOKIE_EXPIRES_IN,
      sameSite: 'none',
    });

    return {
      status: ReturnStatus.Success,
      data: newAccessToken,
    };
  },

  logout: async (_, __, { req, res }) => {
    const refreshToken: string = req?.cookies.refreshToken;
    if (!refreshToken) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['auth/unauthenticated'],
      };
    }

    const decodedJWT = getDecodedJWT(refreshToken, JWT_REFRESH_SECRET_KEY) || null;

    // If not verified return error
    if (!decodedJWT) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/invalidToken'],
      };
    }

    // Check if token is blacklisted
    const isBlackListed = await isJWTTokenBlackListed(decodedJWT.JWTAuthSecret || '');

    // If token is blacklisted return error ( User logged out )
    if (isBlackListed) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/invalidToken'],
      };
    }

    // If token is not blacklisted, blacklist the token and clear cookie
    const setTokenBlackListed = await setJWTTokenBlackListed(refreshToken);
    if (!setTokenBlackListed) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['server/failComplete'],
      };
    }

    res?.clearCookie('refreshToken');
    return {
      status: ReturnStatus.Success,
      data: internalSuccessMap['user/successLogout'],
    };
  },
};

const mutationTypeDefs = gql`
  extend type Mutation {
    register(details: UserRegisterInput!): StatusDataErrorString!

    deleteUser: StatusDataErrorString!

    requestPasswordReset(details: UserRequestPasswordResetInput!): StatusDataErrorString!

    resetPassword(details: UserResetPasswordInput!): StatusDataErrorString!

    refreshAuthToken: StatusDataErrorString!

    logout: StatusDataErrorString!
  }
`;

export { mutations, mutationTypeDefs };
