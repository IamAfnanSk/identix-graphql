// Before all: create a test user to delete
// afterall: force delete the test user

import assert from 'node:assert';
import { testApolloServer, testPrismaClient, testRedisClient } from '../../../constants/testServerClients';
import { ReturnStatus, StatusDataErrorStringResolvers } from '../../../generated/resolvers-types';
import { internalErrorMap } from '../../../constants/errorMaps/internalErrorMap';
import { internalSuccessMap } from '../../../constants/errorMaps/internalSuccessMap';
import { TESTING_DUMMY_PASSWORD } from '../../../constants/global';

const getDeleteUserMutationParams = (isForUnauthenticatedUser: boolean) => {
  const deleteUserMutationParams = [
    {
      query: `mutation DeleteUser {
        deleteUser {
          status
          error
          data
        }
      }`,
    },
    {
      contextValue: {
        prisma: testPrismaClient,
        redis: testRedisClient,
        userId: isForUnauthenticatedUser ? null : '4280e3fc-7737-4f1d-bd3b-331d138f230r',
      },
    },
  ];

  return deleteUserMutationParams;
};

beforeAll(async () => {
  await testPrismaClient.user.create({
    data: {
      id: '4280e3fc-7737-4f1d-bd3b-331d138f230r',
      email: 'test@gmail.com',
      password: TESTING_DUMMY_PASSWORD,
    },
  });
});

afterAll(async () => {
  // Force delete the link
  await testPrismaClient.user.delete({
    where: {
      id: '4280e3fc-7737-4f1d-bd3b-331d138f230r',
    },
  });
  testRedisClient.disconnect();
  console.log('redis stopped');
  await testPrismaClient.$disconnect();
  console.log('prisma stopped');
  await testApolloServer.stop();
  console.log('server stopped');
});

it('delete user for non existing user', async () => {
  const deleteUserMutationParams = getDeleteUserMutationParams(true);

  const response = await testApolloServer.executeOperation<{
    deleteUser: StatusDataErrorStringResolvers;
  }>(deleteUserMutationParams[0], deleteUserMutationParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.deleteUser.status).toBe(ReturnStatus.Error);
  expect(response.body.singleResult.data?.deleteUser.error).toBe(internalErrorMap['auth/unauthenticated']);
});

it('delete user for existing user', async () => {
  const deleteUserMutationParams = getDeleteUserMutationParams(false);

  const response = await testApolloServer.executeOperation<{
    deleteUser: StatusDataErrorStringResolvers;
  }>(deleteUserMutationParams[0], deleteUserMutationParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.deleteUser.status).toBe(ReturnStatus.Success);
  expect(response.body.singleResult.data?.deleteUser.data).toBe(internalSuccessMap['user/successDelete']);
});
