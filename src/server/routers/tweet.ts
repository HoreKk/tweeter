/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';

/**
 * Default selector for Tweet.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultTweetSelect = Prisma.validator<Prisma.TweetSelect>()({
  id: true,
  content: true,
  authorId: true,
  author: true,
  comments: { include: { author: true }, orderBy: { createdAt: 'desc' } },
  users: true,
  createdAt: true,
  updatedAt: true,
});

export const tweetRouter = createRouter()
  // create
  .mutation('add', {
    input: z.object({
      id: z.string().uuid().optional(),
      content: z.string().min(1).max(100),
      authorId: z.string(),
    }),
    async resolve({ input }) {
      const tweet = await prisma.tweet.create({
        data: input,
        select: defaultTweetSelect,
      });
      return tweet;
    },
  })
  // read
  .query('all', {
    async resolve() {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return prisma.tweet.findMany({
        select: defaultTweetSelect,
        orderBy: {
          createdAt: 'desc',
        },
      });
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const tweet = await prisma.tweet.findUnique({
        where: { id },
        select: defaultTweetSelect,
      });
      if (!tweet) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No tweet with id '${id}'`,
        });
      }
      return tweet;
    },
  })
  // update
  .mutation('edit', {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        content: z.string().min(1).max(100).optional(),
      }),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      const tweet = await prisma.tweet.update({
        where: { id },
        data,
        select: defaultTweetSelect,
      });
      return tweet;
    },
  })
  // delete
  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.tweet.delete({ where: { id } });
      return {
        id,
      };
    },
  });
