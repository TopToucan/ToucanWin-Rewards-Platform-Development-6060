import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Text, VStack, HStack, Avatar, Button, Flex, Spacer, SimpleGrid, useColorModeValue, Divider, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LazyImage from './LazyImage';
import { ReviewController } from '../controllers/ReviewController';

const { FiStar, FiThumbsUp, FiMessageSquare } = FiIcons;

const MotionBox = motion(Box);

const StarRating = ({ rating }) => (
  <HStack spacing={1}>
    {[...Array(5)].map((_, index) => (
      <SafeIcon
        key={index}
        icon={FiStar}
        className={index < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ))}
  </HStack>
);

const ReviewCard = ({ review }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [hasVoted, setHasVoted] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.700');

  const handleHelpful = () => {
    if (!hasVoted) {
      ReviewController.addHelpful(review.id);
      setHelpfulCount(prev => prev + 1);
      setHasVoted(true);
    }
  };

  return (
    <MotionBox
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg={cardBg}
      p={6}
      rounded="lg"
      shadow="md"
      w="full"
      borderTop="4px solid"
      borderTopColor={review.rating >= 5 ? "green.400" : review.rating >= 4 ? "teal.400" : "yellow.400"}
    >
      <VStack align="stretch" spacing={4}>
        <HStack spacing={4}>
          <Avatar
            size="md"
            src={review.avatar}
            name={review.userName}
            bg="teal.500"
            border="2px solid"
            borderColor="teal.200"
          />
          <Box>
            <Text fontWeight="bold" fontSize="lg">{review.userName}</Text>
            <Text fontSize="sm" color="gray.500">{review.date}</Text>
          </Box>
          <Spacer />
          <StarRating rating={review.rating} />
        </HStack>

        <Box>
          <Text fontWeight="bold" fontSize="lg" mb={2} color="teal.700">
            {review.title}
          </Text>
          <Text color="gray.600">
            "{review.content}"
          </Text>
        </Box>

        <Divider />

        <Flex align="center">
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<SafeIcon icon={FiThumbsUp} />}
            onClick={handleHelpful}
            isDisabled={hasVoted}
            color={hasVoted ? "teal.500" : "gray.500"}
          >
            Helpful ({helpfulCount})
          </Button>
          <Spacer />
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<SafeIcon icon={FiMessageSquare} />}
          >
            Reply
          </Button>
        </Flex>
      </VStack>
    </MotionBox>
  );
};

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const reviewData = ReviewController.getReviews();
    // Add more reviews for visual appeal
    const extendedReviews = [
      ...reviewData,
      {
        id: 4,
        userId: 4,
        userName: "David Kim",
        rating: 4,
        title: "Very Satisfied",
        content: "The rewards program is excellent, and I've already earned enough points for several rewards. The app is intuitive and easy to use.",
        date: "2024-03-12",
        helpful: 12
      },
      {
        id: 5,
        userId: 5,
        userName: "Lisa Thompson",
        rating: 5,
        title: "Best Rewards Program",
        content: "I've tried many rewards programs, and this is by far the best. The points accumulate quickly, and there are many ways to earn them.",
        date: "2024-03-10",
        helpful: 18
      }
    ];
    setReviews(extendedReviews);
  }, []);

  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <Box>
      {/* Hero Section */}
      <Box bgGradient="linear(to-r,teal.600,teal.400)" color="white" py={10} mb={10}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
            <VStack align="start" spacing={4}>
              <Heading size="xl">User Reviews</Heading>
              <Text fontSize="lg" opacity={0.9}>
                See what our community has to say about ToucanWin Rewards.
              </Text>
            </VStack>
            <Flex direction="column" align={{ base: "center", md: "flex-end" }} justify="center">
              <Box
                bg="white"
                color="teal.600"
                p={6}
                borderRadius="lg"
                shadow="md"
                textAlign="center"
                width="180px"
              >
                <Text fontSize="5xl" fontWeight="bold" lineHeight="1">
                  {averageRating}
                </Text>
                <StarRating rating={Math.round(averageRating)} />
                <Text mt={2} color="gray.600">
                  {reviews.length} reviews
                </Text>
              </Box>
            </Flex>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Reviews List */}
      <Container maxW="container.xl" pb={16}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </SimpleGrid>
        <Box mt={10} textAlign="center">
          <Button
            size="lg"
            colorScheme="teal"
            leftIcon={<SafeIcon icon={FiMessageSquare} />}
          >
            Write a Review
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Reviews;