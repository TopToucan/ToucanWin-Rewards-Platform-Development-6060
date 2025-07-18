import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUsers, FiTrendingUp, FiBarChart2, FiActivity } = FiIcons;

const MotionBox = motion(Box);

const MetricCard = ({ icon, title, value, change }) => (
  <Box bg="white" p={6} rounded="lg" shadow="md">
    <Stat>
      <HStack spacing={3} mb={2}>
        <SafeIcon icon={icon} className="text-2xl text-teal-500" />
        <StatLabel fontSize="sm" color="gray.500">{title}</StatLabel>
      </HStack>
      <StatNumber fontSize="3xl" color="gray.800">{value}</StatNumber>
      <StatHelpText>
        <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
        {Math.abs(change)}%
      </StatHelpText>
    </Stat>
  </Box>
);

const Analytics = () => {
  const metrics = [
    { icon: FiUsers, title: "Total Participants", value: "12.5K", change: 12 },
    { icon: FiTrendingUp, title: "Engagement Rate", value: "68%", change: 5 },
    { icon: FiBarChart2, title: "Active Campaigns", value: "24", change: -3 },
    { icon: FiActivity, title: "Completion Rate", value: "87%", change: 8 }
  ];

  const monthlyData = [
    { name: 'January', value: 4000, percentage: 40 },
    { name: 'February', value: 5000, percentage: 50 },
    { name: 'March', value: 4800, percentage: 48 },
    { name: 'April', value: 6000, percentage: 60 },
    { name: 'May', value: 5500, percentage: 55 },
    { name: 'June', value: 7000, percentage: 70 }
  ];

  const distributionData = [
    { name: 'Active', value: 45, color: 'teal' },
    { name: 'Completed', value: 30, color: 'green' },
    { name: 'Upcoming', value: 25, color: 'blue' }
  ];

  return (
    <Container maxW="container.xl" p={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl" color="teal.600">Campaign Analytics</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {metrics.map((metric, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <MetricCard {...metric} />
            </MotionBox>
          ))}
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Box bg="white" p={6} rounded="lg" shadow="md">
            <Heading size="md" mb={6}>Monthly Participation</Heading>
            <VStack spacing={4} align="stretch">
              {monthlyData.map((item, index) => (
                <Box key={index}>
                  <HStack justify="space-between" mb={1}>
                    <Text fontSize="sm" fontWeight="medium">{item.name}</Text>
                    <Badge colorScheme="teal" variant="subtle">
                      {item.value.toLocaleString()}
                    </Badge>
                  </HStack>
                  <Progress 
                    value={item.percentage} 
                    size="md" 
                    colorScheme="teal" 
                    borderRadius="md"
                    bg="gray.100"
                  />
                </Box>
              ))}
            </VStack>
          </Box>

          <Box bg="white" p={6} rounded="lg" shadow="md">
            <Heading size="md" mb={6}>Campaign Status</Heading>
            <VStack spacing={4} align="stretch">
              {distributionData.map((item, index) => (
                <Box key={index}>
                  <HStack justify="space-between" mb={1}>
                    <HStack>
                      <Box 
                        w="12px" 
                        h="12px" 
                        borderRadius="sm" 
                        bg={`${item.color}.500`} 
                      />
                      <Text fontSize="sm" fontWeight="medium">{item.name}</Text>
                    </HStack>
                    <Badge colorScheme={item.color} variant="subtle">
                      {item.value}%
                    </Badge>
                  </HStack>
                  <Progress 
                    value={item.value} 
                    size="md" 
                    colorScheme={item.color} 
                    borderRadius="md"
                    bg="gray.100"
                  />
                </Box>
              ))}
            </VStack>
          </Box>
        </SimpleGrid>

        <Box bg="white" p={6} rounded="lg" shadow="md">
          <Heading size="md" mb={6}>Performance Summary</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <VStack>
              <Text fontSize="3xl" fontWeight="bold" color="teal.600">156K</Text>
              <Text fontSize="sm" color="gray.500" textAlign="center">Total Points Earned</Text>
            </VStack>
            <VStack>
              <Text fontSize="3xl" fontWeight="bold" color="green.600">92%</Text>
              <Text fontSize="sm" color="gray.500" textAlign="center">User Satisfaction</Text>
            </VStack>
            <VStack>
              <Text fontSize="3xl" fontWeight="bold" color="blue.600">47min</Text>
              <Text fontSize="sm" color="gray.500" textAlign="center">Avg Session Time</Text>
            </VStack>
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
};

export default Analytics;