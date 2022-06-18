import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';

const ExplorePage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  // const postsQuery = trpc.useQuery(['post.all']);
  // const addPost = trpc.useMutation('post.add', {
  //   async onSuccess() {
  //     // refetches posts after a post is added
  //     await utils.invalidateQueries(['post.all']);
  //   },
  // });

  // useEffect(() => {
  //   for (const { id } of postsQuery.data ?? []) {
  //     utils.prefetchQuery(['post.byId', { id }]);
  //   }
  // }, [postsQuery.data, utils]);

  return (
    <>
      <h1>Explore</h1>
    </>
  );
};

export default ExplorePage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('post.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
