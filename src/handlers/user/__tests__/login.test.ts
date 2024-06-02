import assert from 'node:assert';
import { testApolloServer, testPrismaClient, testRedisClient } from '../../../constants/testServerClients';
import { ReturnStatus, StatusDataErrorStringResolvers } from '../../../generated/resolvers-types';
import { internalErrorMap } from '../../../constants/errorMaps/internalErrorMap';
import { TESTING_DUMMY_PASSWORD } from '../../../constants/global';

const getLoginQueryParams = (isForNewUser: boolean) => {
  const loginQueryParams = [
    {
      query: `query Login($details: UserLoginInput!) {
        login(details: $details) {
          data
          error
          status
        }
      }`,
      variables: {
        details: {
          email: isForNewUser ? 'newuser@gmail.com' : 'existing@gmail.com',
          password: TESTING_DUMMY_PASSWORD,
        },
      },
    },
    {
      contextValue: {
        prisma: testPrismaClient,
        redis: testRedisClient,
        userId: null,
      },
    },
  ];

  return loginQueryParams;
};

afterAll(async () => {
  testRedisClient.disconnect();
  console.log('redis stopped');
  await testPrismaClient.$disconnect();
  console.log('prisma stopped');
  await testApolloServer.stop();
  console.log('server stopped');
});

it('login new user', async () => {
  const loginQueryParams = getLoginQueryParams(true);

  const response = await testApolloServer.executeOperation<{
    login: StatusDataErrorStringResolvers;
  }>(loginQueryParams[0], loginQueryParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.login.status).toBe(ReturnStatus.Error);
  expect(response.body.singleResult.data?.login.error).toBe(internalErrorMap['user/inValidUserLoginCredentials']);
});

it('login existing user', async () => {
  const loginQueryParams = getLoginQueryParams(false);

  const response = await testApolloServer.executeOperation<{
    login: StatusDataErrorStringResolvers;
  }>(loginQueryParams[0], loginQueryParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.login.status).toBe(ReturnStatus.Success);
  expect(response.body.singleResult.data?.login.data).not.toBeNull();
});
