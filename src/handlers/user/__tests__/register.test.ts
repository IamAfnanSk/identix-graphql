import assert from 'node:assert';
import { testApolloServer, testPrismaClient, testRedisClient } from '../../../constants/testServerClients';
import { ReturnStatus, StatusDataErrorStringResolvers } from '../../../generated/resolvers-types';
import { internalErrorMap } from '../../../constants/errorMaps/internalErrorMap';
import { internalSuccessMap } from '../../../constants/errorMaps/internalSuccessMap';

const getRegisterMutationParams = (isForNewUser: boolean) => {
  const registerMutationParams = [
    {
      query: `mutation Register($details: UserRegisterInput!) {
        register(details: $details) {
          data
          error
          status
        }
      }`,
      variables: {
        details: {
          email: isForNewUser ? 'newuser@gmail.com' : 'existing@gmail.com',
          password: 'test12345',
          username: isForNewUser ? 'newuser-delete' : 'existinguser',
        },
      },
    },
    {
      contextValue: {
        prisma: testPrismaClient,
        redis: testRedisClient,
        userId: isForNewUser ? null : '28a0a72b-aa7d-4fc5-9436-e1f95d83149a',
      },
    },
  ];

  return registerMutationParams;
};

afterAll(async () => {
  await testPrismaClient.user.deleteMany({
    // Since delete needs a unique field
    where: {
      email: 'newuser@gmail.com',
    },
  });
});

it('register new user', async () => {
  const registerMutationParams = getRegisterMutationParams(true);

  const response = await testApolloServer.executeOperation<{
    register: StatusDataErrorStringResolvers;
  }>(registerMutationParams[0], registerMutationParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.register.status).toBe(ReturnStatus.Success);
  expect(response.body.singleResult.data?.register.data).toBe(internalSuccessMap['user/successRegister']);
});

it('register existing user', async () => {
  const registerMutationParams = getRegisterMutationParams(false);

  const response = await testApolloServer.executeOperation<{
    register: StatusDataErrorStringResolvers;
  }>(registerMutationParams[0], registerMutationParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.register.status).toBe(ReturnStatus.Error);
  expect(response.body.singleResult.data?.register.error).toBe(internalErrorMap['user/emailAlreadyExists']);
});
