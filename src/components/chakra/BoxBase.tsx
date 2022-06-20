import { Box, Heading, useStyleConfig, Divider } from '@chakra-ui/react';
import type { ComponentStyleConfig } from '@chakra-ui/react';

export function BoxBase(props: {
  children?: React.ReactNode;
  headingText?: string;
}) {
  const styles = useStyleConfig('BoxBaseComponent');

  // Pass the computed styles into the `__css` prop
  return (
    <Box __css={styles}>
      {props.headingText && (
        <>
          <Heading size="xs">{props.headingText}</Heading>
          <Divider mt={2} mb={3} />
        </>
      )}
      {props.children}
    </Box>
  );
}

export const BoxBaseComponent: ComponentStyleConfig = {
  baseStyle: {
    boxShadow: 'base',
    borderRadius: 'xl',
    paddingX: 4,
    paddingY: 3,
    width: 'full',
    bg: 'white',
    marginY: 5,
  },
};
