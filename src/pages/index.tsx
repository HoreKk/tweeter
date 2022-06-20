import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Flex, Grid, GridItem, Textarea, Button } from '@chakra-ui/react';
import { BoxBase } from '~/components/chakra/BoxBase';
import { Tweet } from '~/components/Tweet';
import { AvatarUser } from '~/components/User';

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
        <BoxBase headingtext="Tweet Something">
          <Flex>
            <AvatarUser session={session} status={status} />
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
        {tweetsQuery.data?.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </GridItem>
      <GridItem colSpan={3}>
        <BoxBase headingtext="Trends for you" />
        <BoxBase headingtext="Who to follow" />
      </GridItem>
    </Grid>
  );
};

export default IndexPage;
