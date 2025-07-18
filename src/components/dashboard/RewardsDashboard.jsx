import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  Heading,
  Text,
  HStack,
  Badge,
  Button,
  Flex,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Divider,
  Progress,
  useToast
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import ReceiptUploader from './ReceiptUploader';
import LiveAuctions from './LiveAuctions';
import { UserController } from '../../controllers/UserController';

const { FiAward, FiTrendingUp, FiClock, FiTarget, FiGift } = FiIcons;

const MotionBox = motion(Box);

const StatCard = ({ icon, title, value, change, color = "teal" }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  
  return (
    <MotionBox
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg={bgColor}
      p={5}
      borderRadius="xl"
      shadow="md"
      borderLeft="4px solid"
      borderLeftColor={`${color}.500`}
    >
      <Stat>
        <HStack spacing={3} mb={2}>
          <Box color={`${color}.500`}>
            <SafeIcon icon={icon} className="text-2xl" />
          </Box>
          <StatLabel fontSize="sm" color="gray.500">{title}</StatLabel>
        </HStack>
        <StatNumber fontSize="3xl" color="gray.800">{value}</StatNumber>
        {change !== undefined && (
          <StatHelpText>
            <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
            {Math.abs(change)}%
          </StatHelpText>
        )}
      </Stat>
    </MotionBox>
  );
};

const PointsHistoryChart = ({ data }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  
  return (
    <Box bg={bgColor} p={5} borderRadius="xl" shadow="md">
      <VStack align="start" mb={4}>
        <Heading size="md">Points History</Heading>
        <Text fontSize="sm" color="gray.500">Your points activity over time</Text>
      </VStack>
      <VStack spacing={4} align="stretch">
        {data.map((point, index) => (
          <Box key={index}>
            <HStack justify="space-between" mb={1}>
              <Text fontSize="sm">{point.date}</Text>
              <Text fontSize="sm" fontWeight="bold">{point.points} points</Text>
            </HStack>
            <Progress 
              value={(point.points / Math.max(...data.map(d => d.points))) * 100} 
              size="sm" 
              colorScheme="teal" 
              borderRadius="full"
            />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

const GoalProgressChart = ({ goal, current }) => {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  const bgColor = useColorModeValue('white', 'gray.700');
  
  return (
    <Box bg={bgColor} p={5} borderRadius="xl" shadow="md">
      <VStack align="start" spacing={4}>
        <Heading size="md">Points Goal</Heading>
        <Text fontSize="sm" color="gray.500">Progress toward next reward tier</Text>
        <Box w="100%" pt={4}>
          <Progress 
            value={percentage} 
            size="lg" 
            colorScheme="teal" 
            borderRadius="full" 
            bg="gray.100"
          />
          <HStack justify="space-between" mt={2}>
            <Text fontSize="sm" color="gray.600">
              {current} / {goal} points
            </Text>
            <Badge colorScheme="teal">{percentage}%</Badge>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

const RewardsDashboard = () => {
  const [user, setUser] = useState(null);
  const [pointsHistory] = useState([
    { date: '2024-03-15', points: 500 },
    { date: '2024-03-14', points: 300 },
    { date: '2024-03-13', points: 200 },
    { date: '2024-03-12', points: 400 },
    { date: '2024-03-11', points: 150 }
  ]);

  useEffect(() => {
    const userData = UserController.getUser();
    setUser(userData);
  }, []);

  const stats = [
    {
      icon: FiAward,
      title: "Total Points",
      value: user?.points || 0,
      change: 12
    },
    {
      icon: FiTrendingUp,
      title: "Activities Completed",
      value: "24",
      change: 8
    },
    {
      icon: FiTarget,
      title: "Current Tier",
      value: "Gold",
      color: "yellow"
    },
    {
      icon: FiGift,
      title: "Rewards Claimed",
      value: "7",
      change: 15
    }
  ];

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl" color="teal.600">Rewards Dashboard</Heading>
        
        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </SimpleGrid>

        {/* Charts Grid */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <PointsHistoryChart data={pointsHistory} />
          <GoalProgressChart goal={1000} current={user?.points || 0} />
        </SimpleGrid>

        {/* Receipt Upload Section */}
        <Box bg={useColorModeValue('white', 'gray.700')} p={6} borderRadius="xl" shadow="md">
          <VStack spacing={4}>
            <Heading size="md">Upload Receipt</Heading>
            <ReceiptUploader onPointsEarned={(points) => {
              if (user) {
                setUser({ ...user, points: user.points + points });
              }
            }} />
          </VStack>
        </Box>

        {/* Live Auctions Section */}
        <Box>
          <Heading size="lg" mb={6}>Live Auctions</Heading>
          <LiveAuctions 
            auctions={[
              {
                id: 1,
                name: "Premium Headphones",
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
                currentBid: 500,
                endTime: new Date(Date.now() + 3600000)
              },
              {
                id: 2,
                name: "Smart Watch",
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
                currentBid: 750,
                endTime: new Date(Date.now() + 7200000)
              }
            ]}
            userPoints={user?.points || 0}
          />
        </Box>
      </VStack>
    </Container>
  );
};

export default RewardsDashboard;