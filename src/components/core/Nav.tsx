import { NavLink } from './NavLink';

import {
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  MenuDivider,
  Avatar,
  HStack,
  Text,
  Icon,
  Link,
  Box,
  Skeleton,
  SkeletonCircle,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { TriangleDownIcon, SettingsIcon } from '@chakra-ui/icons';
import { FaUserCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

export const Nav = () => {
  const mainLinks = [
    { href: '/', label: 'Home', widthText: '45px' },
    { href: '/explore', label: 'Explore', widthText: '58px' },
    { href: '/bookmarks', label: 'Bookmarks', widthText: '87px' },
  ];

  const menuLinks = [
    { href: '/profile', label: 'Profile', icon: FaUserCircle },
    { href: '/settings', label: 'Settings', icon: SettingsIcon },
    { href: '/logout', label: 'Logout', icon: FiLogOut },
  ];

  const { data: session, status } = useSession();

  return (
    <Flex
      bg="white"
      justify="space-between"
      align="center"
      px={10}
      py={3.5}
      position="relative"
      w="full"
    >
      <NextLink href="/" passHref>
        <Link pr={14}>
          <Image src="/tweeter.svg" />
        </Link>
      </NextLink>
      <Flex gap={16}>
        {mainLinks.map(({ href, label, widthText }) => (
          <NavLink key={href} href={href} widthText={widthText} exact>
            {label}
          </NavLink>
        ))}
      </Flex>
      <Menu offset={[0, 25]}>
        <MenuButton
          as={Button}
          colorScheme="white"
          color="black"
          px={0}
          rightIcon={
            <TriangleDownIcon
              boxSize="3"
              mt="2px"
              ml={2}
              display={{ base: 'none', md: 'block' }}
            />
          }
        >
          <HStack>
            <SkeletonCircle
              borderRadius="lg"
              fadeDuration={2}
              isLoaded={status !== 'loading'}
            >
              <Avatar
                mr={{ base: 0, md: 1 }}
                size="sm"
                name={session?.user?.name ?? ''}
                borderRadius="lg"
                src={session?.user?.image ?? ''}
              />
            </SkeletonCircle>
            <Skeleton isLoaded={status !== 'loading'} fadeDuration={2}>
              <Text minW={18} display={{ base: 'none', md: 'block' }}>
                {session?.user?.name ?? ''}
              </Text>
            </Skeleton>
          </HStack>
        </MenuButton>
        <MenuList px={2} py={3} rounded="xl">
          {menuLinks.map(({ href, label, icon }) => (
            <Box key={href}>
              {href === '/logout' ? <MenuDivider /> : null}
              <MenuItem
                rounded="lg"
                px={4}
                py={2.5}
                mb={1}
                color={href === '/logout' ? 'red' : ''}
              >
                <NextLink href={href} passHref>
                  <Link as={HStack} _hover={{ textDecoration: 'none' }}>
                    <Icon as={icon} boxSize={5} mr={1} />
                    <Text>{label}</Text>
                  </Link>
                </NextLink>
              </MenuItem>
            </Box>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
};
