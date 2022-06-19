import { Nav } from './Nav';

import Head from 'next/head';
import { ReactNode } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Container, Box } from '@chakra-ui/react';

type DefaultLayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Head>
        <title>Tweeter</title>
        <link rel="icon" href="/tweeter-small.svg" />
      </Head>

      <Nav />

      <Box as="main" bg="blackAlpha.50">
        <Container maxW="5xl">{children}</Container>
      </Box>

      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  );
};
