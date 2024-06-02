import gql from 'graphql-tag';
import bcrypt from 'bcrypt';

import { QueryResolvers, ReturnStatus } from '../../generated/resolvers-types.js';
import { internalErrorMap } from '../../constants/errorMaps/internalErrorMap.js';
import { signJWTToken } from '../../utils/signJWTToken.js';
import { IS_TESTING, JWT_REFRESH_COOKIE_EXPIRES_IN, TESTING_DUMMY_USER_ID } from '../../constants/global.js';

const queries: QueryResolvers = {
  login: async (_, { details }, { prisma, res }) => {
    // Check if user exists
    const findUser = await prisma.user.findFirst({
      where: {
        email: details.email,
        isDeleted: false,
      },
    });

    // If user doesn't exist return user not found error
    if (!findUser) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/inValidUserLoginCredentials'],
      };
    }

    // Check password if user Exists
    const pwdCheck = await bcrypt.compare(details.password, findUser.password);

    // If password not matched return error
    if (!pwdCheck) {
      return {
        status: ReturnStatus.Error,
        data: internalErrorMap['user/inValidUserLoginCredentials'],
      };
    }

    // Create jwt token if user verified
    const accessJWTToken = signJWTToken('access', findUser.id);

    // Create refresh token
    const refreshJWTToken = signJWTToken('refresh', findUser.id);

    // Return refresh token in a cookie
    if (IS_TESTING && findUser.id === TESTING_DUMMY_USER_ID) {
      // Dont issue refresh token at the time of testing
      return {
        status: ReturnStatus.Success,
        data: accessJWTToken,
      };
    }
    res?.cookie('refreshToken', refreshJWTToken, {
      httpOnly: true,
      secure: true, //process.env.NODE_ENV === 'production', // set true at time of production
      maxAge: JWT_REFRESH_COOKIE_EXPIRES_IN,
      sameSite: 'none',
    });

    // Return success message

    return {
      status: ReturnStatus.Success,
      data: accessJWTToken,
    };
  },
};

const queryTypeDefs = gql`
  extend type Query {
    login(details: UserLoginInput!): StatusDataErrorString!
  }
`;

export { queries, queryTypeDefs };
