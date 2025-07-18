import React, { Suspense } from 'react';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const LoadingFallback = ({ message = "Loading..." }) => (
  <MotionBox
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    minH="50vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bg="gray.50"
  >
    <VStack spacing={4}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="teal.500"
        size="xl"
      />
      <Text color="gray.600" fontSize="lg">
        {message}
      </Text>
    </VStack>
  </MotionBox>
);

const LazyRoute = ({ children, fallback, ...props }) => (
  <Suspense fallback={fallback || <LoadingFallback {...props} />}>
    {children}
  </Suspense>
);

export default LazyRoute;