/**
 * This file contains the root router of your tRPC-backend
 */
import { createRouter } from '../createRouter';
import { tweetRouter } from './tweet';
import { commentRouter } from './comment';
import superjson from 'superjson';

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  /**
   * Add data transformers
   * @link https://trpc.io/docs/data-transformers
   */
  .transformer(superjson)
  /**
   * Optionally do custom error (type safe!) formatting
   * @link https://trpc.io/docs/error-formatting
   */
  // .formatError(({ shape, error }) => { })
  /**
   * Add a health check endpoint to be called with `/api/trpc/healthz`
   */
  .query('healthz', {
    async resolve() {
      return 'yay!';
    },
  })
  /**
   * Merge `tweetRouter` under `tweet.`
   */
  .merge('tweet.', tweetRouter)
  /**
   * Merge `commentRouter` under `comment.`
   */
  .merge('comment.', commentRouter);

export type AppRouter = typeof appRouter;
