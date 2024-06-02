import assert from 'node:assert';
import { testApolloServer, testPrismaClient, testRedisClient } from '../../../constants/testServerClients';
import { ReturnStatus, StatusDataErrorUserLinks } from '../../../generated/resolvers-types';
import { internalErrorMap } from '../../../constants/errorMaps/internalErrorMap';
import { TESTING_DUMMY_USER_ID, TESTING_DUMMY_USER_LINK_ID } from '../../../constants/global';

const getUserLinksQuery = (isForUnauthenticatedUser: boolean) => {
  const userLinksQueryParams = [
    {
      query: `query GetUserLinks {
        getUserLinks {
          data {
            id
          }
          error
          status
        }
      }`,
    },
    {
      contextValue: {
        prisma: testPrismaClient,
        redis: testRedisClient,
        userId: isForUnauthenticatedUser ? null : TESTING_DUMMY_USER_ID,
      },
    },
  ];

  return userLinksQueryParams;
};

afterAll(async () => {
  testRedisClient.disconnect();
  console.log('redis stopped');
  await testPrismaClient.$disconnect();
  console.log('prisma stopped');
  await testApolloServer.stop();
  console.log('server stopped');
});

it('display links for unauthenticated user', async () => {
  const userLinksQueryParams = getUserLinksQuery(true);

  const response = await testApolloServer.executeOperation<{
    getUserLinks: StatusDataErrorUserLinks;
  }>(userLinksQueryParams[0], userLinksQueryParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.getUserLinks.status).toBe(ReturnStatus.Error);
  expect(response.body.singleResult.data?.getUserLinks.error).toBe(internalErrorMap['auth/unauthenticated']);
});

it('display links for authenticated user', async () => {
  const userLinksQueryParams = getUserLinksQuery(false);

  const response = await testApolloServer.executeOperation<{
    getUserLinks: StatusDataErrorUserLinks;
  }>(userLinksQueryParams[0], userLinksQueryParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.getUserLinks.status).toBe(ReturnStatus.Success);
  expect(response.body.singleResult.data?.getUserLinks.data).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: TESTING_DUMMY_USER_LINK_ID,
      }),
    ]),
  );
});
