import assert from 'node:assert';
import { testApolloServer, testPrismaClient, testRedisClient } from '../../../constants/testServerClients';
import { ReturnStatus, StatusDataErrorStringResolvers } from '../../../generated/resolvers-types';
import { internalErrorMap } from '../../../constants/errorMaps/internalErrorMap';
import { internalSuccessMap } from '../../../constants/errorMaps/internalSuccessMap';
import { TESTING_DUMMY_USER_ID, TESTING_DUMMY_USER_LINK_ID } from '../../../constants/global';

const getupdateLinkMutationParams = (isForUnauthenticatedUser: boolean, isForInvalidLink: boolean = false) => {
  const updateLinkMutationParams = [
    {
      query: `mutation Mutation($linkId: String!, $details: UserLinkUpdateInput!) {
        updateLink(linkId: $linkId, details: $details) {
          data
          error
          status
        }
      }`,
      variables: {
        linkId: isForInvalidLink ? '' : TESTING_DUMMY_USER_LINK_ID,
        details: {
          email: 'test@gmail.com',
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

  return updateLinkMutationParams;
};

afterAll(async () => {
  testRedisClient.disconnect();
  console.log('redis stopped');
  await testPrismaClient.$disconnect();
  console.log('prisma stopped');
  await testApolloServer.stop();
  console.log('server stopped');
});

it('update link for unauthenticated user', async () => {
  const updateLinkMutationParams = getupdateLinkMutationParams(true);

  const response = await testApolloServer.executeOperation<{
    updateLink: StatusDataErrorStringResolvers;
  }>(updateLinkMutationParams[0], updateLinkMutationParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.updateLink.status).toBe(ReturnStatus.Error);
  expect(response.body.singleResult.data?.updateLink.error).toBe(internalErrorMap['auth/unauthenticated']);
});

it('update link for invalid link Id', async () => {
  const updateLinkMutationParams = getupdateLinkMutationParams(false, true);

  const response = await testApolloServer.executeOperation<{
    updateLink: StatusDataErrorStringResolvers;
  }>(updateLinkMutationParams[0], updateLinkMutationParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.updateLink.status).toBe(ReturnStatus.Error);
  expect(response.body.singleResult.data?.updateLink.error).toBe(internalErrorMap['userLink/failUpdate']);
});

it('update link for authenticated user', async () => {
  const updateLinkMutationParams = getupdateLinkMutationParams(false);

  const response = await testApolloServer.executeOperation<{
    updateLink: StatusDataErrorStringResolvers;
  }>(updateLinkMutationParams[0], updateLinkMutationParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.updateLink.status).toBe(ReturnStatus.Success);
  expect(response.body.singleResult.data?.updateLink.data).toBe(internalSuccessMap['userLink/successUpdate']);
});
