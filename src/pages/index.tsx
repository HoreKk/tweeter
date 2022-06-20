import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import {
  Heading,
  Flex,
  SkeletonCircle,
  Avatar,
  Grid,
  GridItem,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { BoxBase } from '~/components/chakra/BoxBase';

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
    // refactor to get session by props
    if (status === 'authenticated' && newTweet && /[a-zA-Z]/.test(newTweet)) {
      const input = {
        content: newTweet,
        authorId: session.user.id,
      };

      await addPost.mutateAsync(input);
      setNewTweet('');
    }
  };

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={5}>
      <GridItem colSpan={9}>
        <BoxBase headingText="Tweet Something">
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
                placeholder="What’s happening?"
                resize="none"
                onChange={(e) => setNewTweet(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNewTweet()}
              />
              <Flex justify="end" mt={3}>
                <Button
                  colorScheme="blue"
                  type="submit"
                  px={6}
                  onClick={handleNewTweet}
                >
                  Tweet
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </BoxBase>
        {tweetsQuery.data?.map(({ id, content }) => (
          <BoxBase key={id}>
            <Heading>{content}</Heading>
          </BoxBase>
        ))}
      </GridItem>
      <GridItem colSpan={3}>
        <BoxBase headingText="Trends for you" />
        <BoxBase headingText="Who to follow" />
      </GridItem>
    </Grid>
  );
};

export default IndexPage;
