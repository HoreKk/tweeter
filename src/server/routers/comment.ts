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
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  content: true,
  authorId: true,
  author: true,
  tweetId: true,
  tweet: true,
  createdAt: true,
  updatedAt: true,
});

export const commentRouter = createRouter()
  // create
  .mutation('add', {
    input: z.object({
      id: z.string().uuid().optional(),
      content: z.string().min(1).max(100),
      authorId: z.string(),
      tweetId: z.string(),
    }),
    async resolve({ input }) {
      const comment = await prisma.comment.create({
        data: input,
        select: defaultCommentSelect,
      });
      return comment;
    },
  })
  // read
  .query('all', {
    async resolve() {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return prisma.comment.findMany({
        select: defaultCommentSelect,
        orderBy: {
          createdAt: 'desc',
        },
      });
    },
  })
  .query('byTweetId', {
    input: z.object({
      tweetId: z.string(),
    }),
    async resolve({ input }) {
      const { tweetId } = input;
      const comments = await prisma.comment.findMany({
        where: { tweetId: tweetId },
        select: defaultCommentSelect,
      });
      if (!comments) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No comments with tweetId '${tweetId}'`,
        });
      }
      return comments;
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
        select: defaultCommentSelect,
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
