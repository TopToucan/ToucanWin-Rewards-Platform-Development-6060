import React from 'react';
import { Box, Container, Heading, Text, Button, VStack, Alert, AlertIcon } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const ErrorFallback = ({ error }) => {
  return (
    <Container maxW="container.md" py={16}>
      <VStack spacing={8} align="stretch">
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Heading size="md">Oops! Something went wrong</Heading>
            <Text fontSize="sm">{error.message}</Text>
          </VStack>
        </Alert>
        
        <Box bg="white" p={8} borderRadius="xl" shadow="md">
          <VStack spacing={6}>
            <Text>We apologize for the inconvenience. Please try:</Text>
            <VStack align="start" spacing={2}>
              <Text>1. Refreshing the page</Text>
              <Text>2. Clearing your browser cache</Text>
              <Text>3. Checking your internet connection</Text>
            </VStack>
            <Button
              as={Link}
              to="/"
              colorScheme="teal"
              size="lg"
              w="full"
            >
              Return to Home
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default ErrorFallback;