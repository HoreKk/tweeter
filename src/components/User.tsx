import { SkeletonCircle, Avatar } from '@chakra-ui/react';
import { DefaultSession } from 'next-auth';
import type { User } from '@prisma/client';

type DefaultLayoutProps = {
  session: DefaultSession | User | null;
  status?: 'authenticated' | 'loading';
};

export const AvatarUser = ({ session, status }: DefaultLayoutProps) => {
  return (
    <SkeletonCircle
      borderRadius="xl"
      fadeDuration={2}
      size="12"
      isLoaded={status ? status !== 'loading' : true}
    >
      <Avatar
        size="md"
        name={session?.user ? session?.user?.name ?? '' : session?.name}
        borderRadius="lg"
        src={session?.user ? session?.user?.image ?? '' : session?.image}
      />
    </SkeletonCircle>
  );
};
