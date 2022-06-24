import { BoxBase } from '~/components/chakra/BoxBase';
import { AvatarUser } from '~/components/User';
import { useSession } from 'next-auth/react';
import {
  Heading,
  Flex,
  Text,
  Skeleton,
  Divider,
  SimpleGrid,
  Center,
  Button,
  Icon,
  Input,
  Box,
} from '@chakra-ui/react';
import { Prisma } from '@prisma/client';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { HiOutlineHeart, HiOutlineBookmark, HiRefresh } from 'react-icons/hi';
import { FaCommentAlt } from 'react-icons/fa';
import { trpc } from '../utils/trpc';

type TweetFull = Prisma.TweetGetPayload<{
  include: {
    author: true;
    comments: { include: { author: true } };
    users: true;
  };
}>;

type DefaultLayoutProps = {
  tweet: TweetFull;
};

export const Tweet = ({ tweet }: DefaultLayoutProps) => {
  //const utils = trpc.useContext();
  const { data: session, status } = useSession({ required: true });
  const [isLoaded, setIsLoaded] = useState(false);

  const [newComment, setNewComment] = useState('');

  const addComment = trpc.useMutation('comment.add', {
    async onSuccess(comment) {
      // add new comment to the list at the beginning
      tweet.comments.unshift(comment);
    },
  });

  const handleNewComment = async () => {
    // refactor to get session by props
    if (
      status === 'authenticated' &&
      newComment &&
      /[a-zA-Z]/.test(newComment)
    ) {
      const input = {
        content: newComment,
        authorId: session.user.id,
        tweetId: tweet.id,
      };

      await addComment.mutateAsync(input);
      setNewComment('');
    }
  };

  const [tweetStats, setTweetStats] = useState<{
    likes: number;
    saved: number;
  }>({ likes: 0, saved: 0 });

  const tweetActions = [
    { label: 'Comment', icon: FaCommentAlt, boxSize: 4, color: 'gray.500' },
    { label: 'Retweeted', icon: HiRefresh, boxSize: 5, color: 'green.400' },
    { label: 'Liked', icon: HiOutlineHeart, boxSize: 5, color: 'red.400' },
    { label: 'Saved', icon: HiOutlineBookmark, boxSize: 5, color: 'blue.400' },
  ];

  useEffect(() => {
    const { users } = tweet;
    const nbLikes = users?.filter((item) => item.liked)?.length ?? 0;
    const nbSaved = users?.filter((item) => item.bookmarked)?.length ?? 0;
    setTweetStats({ likes: nbLikes, saved: nbSaved });
    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BoxBase _hover={{ bg: 'whiteAlpha.800' }}>
      <Skeleton isLoaded={isLoaded}>
        <Flex>
          <AvatarUser session={session} status={status} />
          <Flex direction="column" justify="end" w="full" ml={3}>
            <Heading as="h5" size="sm">
              {tweet.author.name}
            </Heading>
            <Text fontSize="sm" color="gray.400">
              {format(tweet.createdAt, "dd MMMM 'at' HH:mm")}
            </Text>
          </Flex>
        </Flex>
        <Text
          as="p"
          color="gray.600"
          mt={4}
          style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
        >
          {tweet.content}
        </Text>
        <Flex justify="end" mt={3}>
          <Text fontSize="sm" color="gray.400">
            {tweet?.comments?.length ?? 0} Comments
          </Text>
          <Text fontSize="sm" color="gray.400" ml={2}>
            {tweetStats.saved} Saved
          </Text>
        </Flex>
        <Divider mt={3} />
        <SimpleGrid columns={4} spacing={10}>
          {tweetActions.map(({ icon, boxSize, label, color }, index) => (
            <Center key={index} my={1}>
              <Button
                colorScheme="transparent"
                fontSize="sm"
                verticalAlign="center"
                color="gray.500"
                leftIcon={<Icon as={icon} boxSize={boxSize} />}
                _focus={{ color, fontWeight: 'bold' }}
              >
                <Text mt="2px">{label}</Text>
              </Button>
            </Center>
          ))}
        </SimpleGrid>
        <Divider />
        <Flex align="center" my={3}>
          <AvatarUser session={session} status={status} />
          <Input
            ml={4}
            bg="gray.100"
            h={12}
            _focus={{ boxShadow: 'none', borderColor: 'transparent' }}
            placeholder="Tweet your reply"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleNewComment()}
          />
        </Flex>
        {tweet.comments?.map((comment, index) => (
          <Box key={comment.id}>
            {index === 0 && <Divider />}
            <Flex key={comment.id} mt={index === 0 ? 4 : 6}>
              <AvatarUser session={comment.author} />
              <Flex direction="column" ml={3} w="full">
                <Box px={4} py={3} borderRadius="xl" bg="gray.100">
                  <Flex align="center">
                    <Heading as="h5" size="sm">
                      {tweet.author.name}
                    </Heading>
                    <Text fontSize="sm" color="gray.400" ml={3}>
                      {format(tweet.createdAt, "dd MMMM 'at' HH:mm")}
                    </Text>
                  </Flex>
                  <Text
                    as="p"
                    color="gray.600"
                    mt={1}
                    mb={2}
                    style={{
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {comment.content}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Box>
        ))}
      </Skeleton>
    </BoxBase>
  );
};
