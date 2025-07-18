import React from 'react';
import { Box, Container, Heading, SimpleGrid, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const { FiUsers, FiTrendingUp, FiBarChart2, FiActivity } = FiIcons;

const MotionBox = motion(Box);

const MetricCard = ({ icon, title, value, change }) => (
  <Box bg="white" p={6} rounded="lg" shadow="md">
    <VStack spacing={3} align="start">
      <SafeIcon icon={icon} className="text-2xl text-teal-500" />
      <Text color="gray.500" fontSize="sm">{title}</Text>
      <HStack spacing={2} align="baseline">
        <Text fontSize="3xl" fontWeight="bold" color="gray.800">
          {value}
        </Text>
        <Badge colorScheme={change >= 0 ? "green" : "red"}>
          {change >= 0 ? "+" : ""}{change}%
        </Badge>
      </HStack>
    </VStack>
  </Box>
);

const participationData = [
  { name: 'Jan', users: 4000 },
  { name: 'Feb', users: 5000 },
  { name: 'Mar', users: 4800 },
  { name: 'Apr', users: 6000 },
  { name: 'May', users: 5500 },
  { name: 'Jun', users: 7000 }
];

const campaignDistribution = [
  { name: 'Active', value: 45 },
  { name: 'Completed', value: 30 },
  { name: 'Upcoming', value: 25 }
];

const COLORS = ['#38B2AC', '#48BB78', '#4299E1'];

const CampaignAnalytics = () => {
  const metrics = [
    { icon: FiUsers, title: "Total Participants", value: "12.5K", change: 12 },
    { icon: FiTrendingUp, title: "Engagement Rate", value: "68%", change: 5 },
    { icon: FiBarChart2, title: "Active Campaigns", value: "24", change: -3 },
    { icon: FiActivity, title: "Completion Rate", value: "87%", change: 8 }
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
            <Heading size="md" mb={6}>Participation Trends</Heading>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={participationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#38B2AC" 
                    fill="#E6FFFA" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box bg="white" p={6} rounded="lg" shadow="md">
            <Heading size="md" mb={6}>Campaign Distribution</Heading>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={campaignDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {campaignDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default CampaignAnalytics;