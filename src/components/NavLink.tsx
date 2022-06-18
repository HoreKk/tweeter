import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { Box, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

type DefaultLayoutProps = {
  children: ReactNode;
  href: string;
  widthText: string;
  exact?: boolean;
  className?: string;
};

export const NavLink = ({
  children,
  href,
  exact,
  widthText,
  ...props
}: DefaultLayoutProps) => {
  const { pathname } = useRouter();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  if (isActive) {
    props.className += ' active';
  }

  return (
    <NextLink href={href} passHref>
      <Link
        fontWeight="bold"
        color={isActive ? 'blue.500' : ''}
        _hover={{ textDecoration: 'none' }}
        {...props}
      >
        {children}
        {isActive && (
          <Box
            position="absolute"
            w={widthText}
            bottom={0}
            h={1}
            borderTopRadius="md"
            bg="blue.500"
          />
        )}
      </Link>
    </NextLink>
  );
};
