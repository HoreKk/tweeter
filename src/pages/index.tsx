import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import {
  Box,
  Divider,
  Heading,
  Flex,
  SkeletonCircle,
  Avatar,
  Grid,
  GridItem,
  Textarea,
  Button,
} from '@chakra-ui/react';

const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();

  const { data: session, status } = useSession({ required: true });
  const tweetsQuery = trpc.useQuery(['tweet.all']);
  const addPost = trpc.useMutation('tweet.add', {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(['tweet.all']);
    },
  });

  const [newTweet, setNewTweet] = useState('');

  const handleNewTweet = async () => {
    const input = {
      content: newTweet,
      authorId: session.user.id,
    };

    await addPost.mutateAsync(input);

    setNewTweet('');
  };

  // useEffect(() => {
  //   for (const { id } of postsQuery.data ?? []) {
  //     utils.prefetchQuery(['post.byId', { id }]);
  //   }
  // }, [postsQuery.data, utils]);

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={5}>
      <GridItem colSpan={9}>
        <Box
          boxShadow="base"
          bg="white"
          borderRadius="xl"
          px={4}
          py={3}
          my={5}
          w="full"
        >
          <Heading size="xs">Tweet Something</Heading>
          <Divider mt={2} mb={3} />
          <Flex>
            <SkeletonCircle
              borderRadius="xl"
              fadeDuration={2}
              size="12"
              isLoaded={status !== 'loading'}
            >
              <Avatar
                size="md"
                name={session?.user?.name ?? ''}
                borderRadius="lg"
                src={session?.user?.image ?? ''}
              />
            </SkeletonCircle>
            <Flex direction="column" w="full">
              <Textarea
                border="none"
                size="lg"
                _focus={{ boxShadow: 'none' }}
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
                placeholder="What’s happening?"
                resize="none"
              />
              <Flex justify="end" mt={3}>
                <Button colorScheme="blue" px={6} onClick={handleNewTweet}>
                  Tweet
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Box>
        {tweetsQuery.data?.map((item) => (
          <article key={item.id}>
            <h3>{item.content}</h3>
          </article>
        ))}
      </GridItem>
      <GridItem colSpan={3}>
        <Box bg="white" borderRadius="lg" px={4} py={2} w="full">
          <Heading size="xs">Tweet Something</Heading>
          <Divider my={2} />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default IndexPage;

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
