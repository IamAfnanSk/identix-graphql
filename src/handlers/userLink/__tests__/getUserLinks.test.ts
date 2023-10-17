import assert from 'node:assert';
import { testApolloServer, testPrismaClient, testRedisClient } from '../../../constants/testServerClients';
import { ReturnStatus, StatusDataErrorUserLinks } from '../../../generated/resolvers-types';
import { internalErrorMap } from '../../../constants/errorMaps/internalErrorMap';

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
        userId: isForUnauthenticatedUser ? null : '28a0a72b-aa7d-4fc5-9436-e1f95d83149a',
      },
    },
  ];

  return userLinksQueryParams;
};

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
        id: 'b8f0be11-d33c-413b-acca-4d830c84a449',
      }),
    ]),
  );
});