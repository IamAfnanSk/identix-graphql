import assert from 'node:assert';
import { testApolloServer, testPrismaClient, testRedisClient } from '../../../constants/testServerClients';
import { ReturnStatus, StatusDataErrorStringResolvers } from '../../../generated/resolvers-types';
import { internalErrorMap } from '../../../constants/errorMaps/internalErrorMap';
import { internalSuccessMap } from '../../../constants/errorMaps/internalSuccessMap';
import { TESTING_DUMMY_USER_ID } from '../../../constants/global';

const getCreateLinkMutationParams = (isForUnauthenticatedUser: boolean) => {
  const createLinkMutationParams = [
    {
      query: `mutation CreateLink($details: UserLinkCreateInput!) {
        createLink(details: $details) {
            data
            error
            status
          }
        }`,
      variables: {
        details: {
          email: 'testdelete@gmail.com',
          firstName: 'test12345',
          lastName: 'test',
        },
      },
    },
    {
      contextValue: {
        prisma: testPrismaClient,
        redis: testRedisClient,
        userId: isForUnauthenticatedUser ? null : TESTING_DUMMY_USER_ID,
      },
    },
  ];

  return createLinkMutationParams;
};

afterAll(async () => {
  await testPrismaClient.userLink.deleteMany({
    // Since delete needs a unique field
    where: {
      email: 'testdelete@gmail.com',
    },
  });

  testRedisClient.disconnect();
  console.log('redis stopped');
  await testPrismaClient.$disconnect();
  console.log('prisma stopped');
  await testApolloServer.stop();
  console.log('server stopped');
});

it('create link for unauthenticted user', async () => {
  const createLinkMutationParams = getCreateLinkMutationParams(true);

  const response = await testApolloServer.executeOperation<{
    createLink: StatusDataErrorStringResolvers;
  }>(createLinkMutationParams[0], createLinkMutationParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.createLink.status).toBe(ReturnStatus.Error);
  expect(response.body.singleResult.data?.createLink.error).toBe(internalErrorMap['auth/unauthenticated']);
});

it('create link for authenticated user', async () => {
  const createLinkMutationParams = getCreateLinkMutationParams(false);

  const response = await testApolloServer.executeOperation<{
    createLink: StatusDataErrorStringResolvers;
  }>(createLinkMutationParams[0], createLinkMutationParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.createLink.status).toBe(ReturnStatus.Success);
  expect(response.body.singleResult.data?.createLink.data).toBe(internalSuccessMap['userLink/successCreate']);
});
