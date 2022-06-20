/**
 * Integration test example for the `post` router
 */
import { createContextInner } from '../context';
import { appRouter } from './_app';
import { inferMutationInput } from '~/utils/trpc';

test('add and get post', async () => {
  const ctx = await createContextInner({});
  const caller = appRouter.createCaller(ctx);

  const input: inferMutationInput<'tweet.add'> = {
    content: 'hello test',
    authorId: '1',
  };
  const tweet = await caller.mutation('tweet.add', input);
  const byId = await caller.query('tweet.byId', {
    id: tweet.id,
  });

  expect(byId).toMatchObject(input);
});
