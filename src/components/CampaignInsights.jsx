import React from 'react';
import { Box, Container, Heading, SimpleGrid, Text, VStack, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUsers, FiTrendingUp, FiAward, FiBarChart2 } = FiIcons;

const MotionBox = motion(Box);

const InsightCard = ({ icon, title, value, subtext }) => (
  <Box bg="white" p={6} rounded="lg" shadow="md">
    <VStack spacing={3} align="start">
      <SafeIcon icon={icon} className="text-2xl text-teal-500" />
      <Text color="gray.500" fontSize="sm">{title}</Text>
      <HStack spacing={2} align="baseline">
        <Text fontSize="3xl" fontWeight="bold" color="gray.800">
          {value}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {subtext}
        </Text>
      </HStack>
    </VStack>
  </Box>
);

const CampaignInsights = () => {
  const insights = [
    {
      icon: FiUsers,
      title: "Active Participants",
      value: "2,847",
      subtext: "+12% this month"
    },
    {
      icon: FiTrendingUp,
      title: "Points Earned",
      value: "156K",
      subtext: "total points"
    },
    {
      icon: FiAward,
      title: "Completion Rate",
      value: "87%",
      subtext: "avg. completion"
    },
    {
      icon: FiBarChart2,
      title: "Active Campaigns",
      value: "12",
      subtext: "running now"
    }
  ];

  return (
    <Container maxW="container.xl" p={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl" color="teal.600">Campaign Insights</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {insights.map((insight, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <InsightCard {...insight} />
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default CampaignInsights;